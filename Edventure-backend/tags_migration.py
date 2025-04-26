"""
Example migration script to add a tagging system to the notes
This creates a many-to-many relationship between notes and tags
"""
import sqlite3
from migration import (
    backup_database, 
    create_table, 
    add_column, 
    create_index,
    insert_sample_data,
    show_tables,
    run_custom_sql
)

def run_tags_migration():
    """Run migrations to add tagging functionality"""
    print("Starting tags migration...")
    
    # Always back up the database first
    backup_database()
    
    # 1. Create tags table
    create_table("tags", [
        "id INTEGER PRIMARY KEY AUTOINCREMENT",
        "name TEXT NOT NULL UNIQUE",
        "color TEXT DEFAULT '#3B82F6'",  # Default blue color
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    ])
    
    # 2. Create note_tags junction table (many-to-many)
    create_table("note_tags", [
        "note_id INTEGER NOT NULL",
        "tag_id INTEGER NOT NULL",
        "PRIMARY KEY (note_id, tag_id)",
        "FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE",
        "FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE"
    ])
    
    # 3. Create indexes for performance
    create_index("tags", ["name"])
    create_index("note_tags", ["note_id"])
    create_index("note_tags", ["tag_id"])
    
    # 4. Insert some default tags
    default_tags = [
        {"name": "Important", "color": "#EF4444"},  # Red
        {"name": "Reference", "color": "#3B82F6"},  # Blue
        {"name": "To Review", "color": "#F59E0B"},  # Amber
        {"name": "Exam Prep", "color": "#10B981"},  # Green
        {"name": "Assignment", "color": "#8B5CF6"},  # Purple
        {"name": "Tutorial", "color": "#EC4899"},   # Pink
        {"name": "Lecture Notes", "color": "#6366F1"}, # Indigo
        {"name": "Research", "color": "#14B8A6"}    # Teal
    ]
    insert_sample_data("tags", default_tags)
    
    # 5. Add helper functions (stored as triggers/views)
    
    # Create a view to easily get all tags for a note
    run_custom_sql("""
    CREATE VIEW IF NOT EXISTS note_with_tags AS
    SELECT n.*, GROUP_CONCAT(t.name, ', ') as tags
    FROM notes n
    LEFT JOIN note_tags nt ON n.id = nt.note_id
    LEFT JOIN tags t ON t.id = nt.tag_id
    GROUP BY n.id
    """)
    
    # 6. Show the updated database structure
    show_tables()
    
    # 7. Example usage for finding notes with tags
    print("\nExample SQL for working with tags:")
    print("----------------------------------")
    print("-- Add a tag to a note:")
    print("INSERT INTO note_tags (note_id, tag_id) VALUES (1, 2);")
    print("\n-- Get all tags for a note:")
    print("SELECT t.* FROM tags t JOIN note_tags nt ON t.id = nt.tag_id WHERE nt.note_id = 1;")
    print("\n-- Get all notes with a specific tag:")
    print("SELECT n.* FROM notes n JOIN note_tags nt ON n.id = nt.note_id WHERE nt.tag_id = 2;")
    print("\n-- Find notes with multiple tags (AND logic):")
    print("""
    SELECT n.* FROM notes n 
    JOIN note_tags nt1 ON n.id = nt1.note_id AND nt1.tag_id = 1
    JOIN note_tags nt2 ON n.id = nt2.note_id AND nt2.tag_id = 2;
    """)
    print("\n-- Find notes with any of multiple tags (OR logic):")
    print("""
    SELECT DISTINCT n.* FROM notes n 
    JOIN note_tags nt ON n.id = nt.note_id 
    WHERE nt.tag_id IN (1, 2, 3);
    """)
    
    print("\nTags migration completed successfully!")

if __name__ == "__main__":
    run_tags_migration() 