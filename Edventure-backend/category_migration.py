"""
Example migration script to add categories functionality to the notes system
"""
import sqlite3
from migration import (
    backup_database, 
    create_table, 
    add_column, 
    create_index,
    add_foreign_key,
    insert_sample_data,
    show_tables
)

def run_category_migration():
    """Run migrations to add categories functionality"""
    print("Starting category migration...")
    
    # Always back up the database first
    backup_database()
    
    # 1. Create categories table
    create_table("categories", [
        "id INTEGER PRIMARY KEY AUTOINCREMENT",
        "name TEXT NOT NULL UNIQUE",
        "description TEXT",
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    ])
    
    # 2. Add category_id column to notes table
    add_column("notes", "category_id", "INTEGER", None)
    
    # 3. Create index on category_id
    create_index("notes", ["category_id"])
    
    # 4. Add foreign key constraint
    add_foreign_key("notes", "category_id", "categories", "id", "SET NULL")
    
    # 5. Insert some default categories
    default_categories = [
        {"name": "General", "description": "General notes"},
        {"name": "Mathematics", "description": "Math related notes and formulas"},
        {"name": "Computer Science", "description": "CS related concepts and tutorials"},
        {"name": "Physics", "description": "Physics study materials"},
        {"name": "Chemistry", "description": "Chemistry notes and reference"},
        {"name": "Biology", "description": "Biology study materials"},
        {"name": "Literature", "description": "Literature and language notes"},
        {"name": "History", "description": "Historical references and notes"}
    ]
    insert_sample_data("categories", default_categories)
    
    # 6. Show the updated database structure
    show_tables()
    
    print("\nCategory migration completed successfully!")
    print("Now you can categorize notes by updating the category_id field.")

if __name__ == "__main__":
    run_category_migration() 