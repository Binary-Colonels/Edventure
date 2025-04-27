import sqlite3
import os
import datetime
import argparse

def get_db_connection():
    """Connect to the database and set row factory"""
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def backup_database():
    """Create a backup of the database before migrations"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = 'db_backups'
    
    # Create backup directory if it doesn't exist
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    backup_path = os.path.join(backup_dir, f'database_backup_{timestamp}.db')
    
    # Copy the database file
    try:
        with open('database.db', 'rb') as src, open(backup_path, 'wb') as dst:
            dst.write(src.read())
        print(f"Database backup created at: {backup_path}")
        return True
    except Exception as e:
        print(f"Backup failed: {str(e)}")
        return False

def add_column(table_name, column_name, column_type, default_value=None):
    """Add a new column to an existing table"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if table exists
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
        if not cursor.fetchone():
            print(f"Table '{table_name}' does not exist")
            return False
        
        # Check if column already exists
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        column_names = [col['name'] for col in columns]
        
        if column_name in column_names:
            print(f"Column '{column_name}' already exists in table '{table_name}'")
            return False
        
        # Add column with or without default value
        if default_value is not None:
            sql = f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type} DEFAULT ?"
            cursor.execute(sql, (default_value,))
        else:
            sql = f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}"
            cursor.execute(sql)
        
        conn.commit()
        print(f"Column '{column_name}' added to table '{table_name}' successfully")
        return True
    
    except Exception as e:
        conn.rollback()
        print(f"Error adding column: {str(e)}")
        return False
    finally:
        conn.close()

def create_table(table_name, columns_definitions):
    """Create a new table if it doesn't exist"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if table already exists
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
        if cursor.fetchone():
            print(f"Table '{table_name}' already exists")
            return False
        
        # Create table
        columns_sql = ', '.join(columns_definitions)
        sql = f"CREATE TABLE {table_name} ({columns_sql})"
        cursor.execute(sql)
        
        conn.commit()
        print(f"Table '{table_name}' created successfully")
        return True
    
    except Exception as e:
        conn.rollback()
        print(f"Error creating table: {str(e)}")
        return False
    finally:
        conn.close()

def create_index(table_name, column_names, index_name=None, unique=False):
    """Create an index on specified columns"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Generate index name if not provided
        if index_name is None:
            index_name = f"idx_{table_name}_{'_'.join(column_names)}"
        
        # Check if index already exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='index' AND name=?", (index_name,))
        if cursor.fetchone():
            print(f"Index '{index_name}' already exists")
            return False
        
        # Create index
        unique_str = "UNIQUE" if unique else ""
        columns_str = ', '.join(column_names)
        sql = f"CREATE {unique_str} INDEX {index_name} ON {table_name} ({columns_str})"
        cursor.execute(sql)
        
        conn.commit()
        print(f"Index '{index_name}' created successfully")
        return True
    
    except Exception as e:
        conn.rollback()
        print(f"Error creating index: {str(e)}")
        return False
    finally:
        conn.close()

def add_foreign_key(table_name, column_name, referenced_table, referenced_column, on_delete="CASCADE"):
    """Add a foreign key constraint (requires recreating the table)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # This is more complex as SQLite doesn't support ADD CONSTRAINT
        # 1. Get table info
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        
        # 2. Get all rows
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        
        # 3. Generate column definitions for new table
        column_defs = []
        column_names = []
        for col in columns:
            col_name = col['name']
            col_type = col['type']
            not_null = "NOT NULL" if col['notnull'] else ""
            pk = "PRIMARY KEY" if col['pk'] else ""
            default = f"DEFAULT {col['dflt_value']}" if col['dflt_value'] is not None else ""
            
            column_names.append(col_name)
            column_defs.append(f"{col_name} {col_type} {not_null} {pk} {default}".strip())
        
        # 4. Add foreign key definition
        fk_def = f"FOREIGN KEY ({column_name}) REFERENCES {referenced_table}({referenced_column}) ON DELETE {on_delete}"
        column_defs.append(fk_def)
        
        # 5. Create new table with _temp suffix
        temp_table = f"{table_name}_temp"
        create_sql = f"CREATE TABLE {temp_table} ({', '.join(column_defs)})"
        cursor.execute(create_sql)
        
        # 6. Copy data
        placeholders = ', '.join(['?' for _ in column_names])
        insert_sql = f"INSERT INTO {temp_table} ({', '.join(column_names)}) VALUES ({placeholders})"
        
        for row in rows:
            values = [row[col_name] for col_name in column_names]
            cursor.execute(insert_sql, values)
        
        # 7. Drop old table and rename new one
        cursor.execute(f"DROP TABLE {table_name}")
        cursor.execute(f"ALTER TABLE {temp_table} RENAME TO {table_name}")
        
        conn.commit()
        print(f"Foreign key constraint added to {table_name}.{column_name} referencing {referenced_table}.{referenced_column}")
        return True
    
    except Exception as e:
        conn.rollback()
        print(f"Error adding foreign key: {str(e)}")
        return False
    finally:
        conn.close()

def insert_sample_data(table_name, data_list):
    """Insert sample data into a table
    data_list should be a list of dictionaries with column:value pairs
    """
    if not data_list:
        print("No data provided")
        return False
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if table exists
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
        if not cursor.fetchone():
            print(f"Table '{table_name}' does not exist")
            return False
        
        count = 0
        for data_item in data_list:
            columns = list(data_item.keys())
            placeholders = ', '.join(['?' for _ in columns])
            values = [data_item[col] for col in columns]
            
            sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"
            try:
                cursor.execute(sql, values)
                count += 1
            except sqlite3.IntegrityError as e:
                print(f"Skipping row due to integrity error: {str(e)}")
        
        conn.commit()
        print(f"Inserted {count} rows into '{table_name}'")
        return True
    
    except Exception as e:
        conn.rollback()
        print(f"Error inserting data: {str(e)}")
        return False
    finally:
        conn.close()

def run_custom_sql(sql_statement, params=None):
    """Run a custom SQL statement"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if params:
            cursor.execute(sql_statement, params)
        else:
            cursor.execute(sql_statement)
        
        conn.commit()
        print("Custom SQL executed successfully")
        if sql_statement.strip().upper().startswith("SELECT"):
            rows = cursor.fetchall()
            for row in rows:
                print(dict(row))
        return True
    
    except Exception as e:
        conn.rollback()
        print(f"Error executing SQL: {str(e)}")
        return False
    finally:
        conn.close()

def show_tables():
    """Show all tables in the database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = cursor.fetchall()
        
        print("\nDatabase Tables:")
        print("================")
        for table in tables:
            if table['name'].startswith('sqlite_'):
                continue  # Skip SQLite internal tables
            
            print(f"\n- {table['name']}")
            cursor.execute(f"PRAGMA table_info({table['name']})")
            columns = cursor.fetchall()
            
            for col in columns:
                pk = "PRIMARY KEY" if col['pk'] else ""
                notnull = "NOT NULL" if col['notnull'] else ""
                default = f"DEFAULT {col['dflt_value']}" if col['dflt_value'] is not None else ""
                print(f"  - {col['name']} ({col['type']} {notnull} {default} {pk})".strip())
            
            # Show row count
            cursor.execute(f"SELECT COUNT(*) as count FROM {table['name']}")
            count = cursor.fetchone()['count']
            print(f"  Total rows: {count}")
        
        return True
    
    except Exception as e:
        print(f"Error showing tables: {str(e)}")
        return False
    finally:
        conn.close()

def example_usage():
    """Show example usage of the migration script"""
    print("""
Migration Script Examples:
=========================

1. Add a new column:
   python migration.py add-column --table notes --name category --type TEXT --default General

2. Create a new table:
   python migration.py create-table --name categories --columns "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, description TEXT"

3. Create an index:
   python migration.py create-index --table notes --columns title,user_id

4. Add a foreign key (requires table recreation):
   python migration.py add-foreign-key --table notes --column category_id --ref-table categories --ref-column id

5. Insert sample data:
   python migration.py insert-data --table categories --data '[{"name":"Mathematics","description":"Math notes"},{"name":"Science","description":"Science notes"}]'

6. Run custom SQL:
   python migration.py run-sql --sql "SELECT * FROM notes WHERE title LIKE '%Math%'"

7. Show database structure:
   python migration.py show-tables
""")

def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description='Database Migration Tool')
    subparsers = parser.add_subparsers(dest='command', help='Command to run')
    
    # Add column command
    add_col_parser = subparsers.add_parser('add-column', help='Add a column to an existing table')
    add_col_parser.add_argument('--table', required=True, help='Table name')
    add_col_parser.add_argument('--name', required=True, help='Column name')
    add_col_parser.add_argument('--type', required=True, help='Column type (TEXT, INTEGER, etc.)')
    add_col_parser.add_argument('--default', help='Default value')
    
    # Create table command
    create_table_parser = subparsers.add_parser('create-table', help='Create a new table')
    create_table_parser.add_argument('--name', required=True, help='Table name')
    create_table_parser.add_argument('--columns', required=True, help='Column definitions (comma-separated)')
    
    # Create index command
    create_index_parser = subparsers.add_parser('create-index', help='Create an index')
    create_index_parser.add_argument('--table', required=True, help='Table name')
    create_index_parser.add_argument('--columns', required=True, help='Columns to index (comma-separated)')
    create_index_parser.add_argument('--name', help='Index name (optional)')
    create_index_parser.add_argument('--unique', action='store_true', help='Create a unique index')
    
    # Add foreign key command
    add_fk_parser = subparsers.add_parser('add-foreign-key', help='Add a foreign key constraint')
    add_fk_parser.add_argument('--table', required=True, help='Table name')
    add_fk_parser.add_argument('--column', required=True, help='Column name')
    add_fk_parser.add_argument('--ref-table', required=True, help='Referenced table')
    add_fk_parser.add_argument('--ref-column', required=True, help='Referenced column')
    add_fk_parser.add_argument('--on-delete', default='CASCADE', help='ON DELETE behavior (CASCADE, SET NULL, etc.)')
    
    # Insert data command
    insert_data_parser = subparsers.add_parser('insert-data', help='Insert sample data')
    insert_data_parser.add_argument('--table', required=True, help='Table name')
    insert_data_parser.add_argument('--data', required=True, help='JSON array of objects to insert')
    
    # Run SQL command
    run_sql_parser = subparsers.add_parser('run-sql', help='Run custom SQL')
    run_sql_parser.add_argument('--sql', required=True, help='SQL statement to execute')
    
    # Show tables command
    subparsers.add_parser('show-tables', help='Show all tables and their structure')
    
    # Examples command
    subparsers.add_parser('examples', help='Show usage examples')
    
    return parser.parse_args()

def main():
    """Main function to handle command line arguments"""
    args = parse_arguments()
    
    if args.command == 'add-column':
        backup_database()
        add_column(args.table, args.name, args.type, args.default)
    
    elif args.command == 'create-table':
        backup_database()
        create_table(args.name, args.columns.split(','))
    
    elif args.command == 'create-index':
        backup_database()
        create_index(args.table, args.columns.split(','), args.name, args.unique)
    
    elif args.command == 'add-foreign-key':
        backup_database()
        add_foreign_key(args.table, args.column, args.ref_table, args.ref_column, args.on_delete)
    
    elif args.command == 'insert-data':
        import json
        data = json.loads(args.data)
        backup_database()
        insert_sample_data(args.table, data)
    
    elif args.command == 'run-sql':
        backup_database()
        run_custom_sql(args.sql)
    
    elif args.command == 'show-tables':
        show_tables()
    
    elif args.command == 'examples':
        example_usage()
    
    elif args.command == 'add_podcast_column':
        # Specifically add the has_podcast column to the notes table
        add_column('notes', 'has_podcast', 'INTEGER', 0)
    
    else:
        print("Unknown command")

if __name__ == "__main__":
    main() 