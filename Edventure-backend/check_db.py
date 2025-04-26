import sqlite3

def check_database():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Check if notes table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='notes'")
    if not cursor.fetchone():
        print("Notes table does not exist. Creating it now...")
        
        cursor.execute('''
        CREATE TABLE notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            pdf_content BLOB NOT NULL,
            upvote_count INTEGER DEFAULT 0,
            downvote_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            has_quiz INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        ''')
        conn.commit()
        print("Notes table created successfully")
    else:
        print("Notes table exists")
        
        # Check if all required columns exist
        cursor.execute("PRAGMA table_info(notes)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        print(f"Current columns in notes table: {column_names}")
        
        # Check if has_quiz column exists, add if not
        if 'has_quiz' not in column_names:
            print("Adding has_quiz column to notes table...")
            cursor.execute("ALTER TABLE notes ADD COLUMN has_quiz INTEGER DEFAULT 0")
            conn.commit()
            print("Column added")
    
    # Show example of data
    cursor.execute("SELECT * FROM notes LIMIT 5")
    rows = cursor.fetchall()
    if rows:
        print(f"Found {len(rows)} notes in database")
        for row in rows:
            print(f"ID: {row[0]}, User ID: {row[1]}, Title: {row[2]}, Created: {row[7]}")
    else:
        print("No notes found in database")
        
    # Check users table to make sure it exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
    if not cursor.fetchone():
        print("Users table does not exist. Creating it now...")
        
        cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL,
            qualification TEXT,
            institute_company TEXT,
            coins INTEGER DEFAULT 0,
            rank INTEGER DEFAULT 1,
            exp INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        conn.commit()
        print("Users table created successfully")
    else:
        print("Users table exists")
        
        # Show example of users
        cursor.execute("SELECT id, username, email, role FROM users LIMIT 5")
        users = cursor.fetchall()
        if users:
            print(f"Found {len(users)} users in database")
            for user in users:
                print(f"ID: {user[0]}, Username: {user[1]}, Email: {user[2]}, Role: {user[3]}")
        else:
            print("No users found in database")
    
    conn.close()

if __name__ == "__main__":
    check_database() 