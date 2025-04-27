import sqlite3

def get_db_connection():
    """Connect to the database and set row factory"""
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def add_podcast_column():
    """Add has_podcast column to the notes table"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(notes)")
        columns = cursor.fetchall()
        column_names = [col['name'] for col in columns]
        
        if 'has_podcast' in column_names:
            print("Column 'has_podcast' already exists in table 'notes'")
            return
        
        # Add column with default value
        cursor.execute("ALTER TABLE notes ADD COLUMN has_podcast INTEGER DEFAULT 0")
        
        conn.commit()
        print("Column 'has_podcast' added to table 'notes' successfully")
    
    except Exception as e:
        conn.rollback()
        print(f"Error adding column: {str(e)}")
    finally:
        conn.close()

if __name__ == "__main__":
    add_podcast_column() 