from flask import Blueprint, current_app, jsonify, request
import jwt
import bcrypt
import datetime
from utils import get_db_connection, token_required

user_management = Blueprint('user_management', __name__)

@user_management.route('/authenticate', methods=['POST'])
def authenticate():
    """
    Authenticate a user with email and password.
    
    Request Format:
    {
        "email": "user@example.com",
        "password": "userpassword123"
    }
    
    Success Response (200):
    {
        "success": true,
        "message": "Authentication successful",
        "token": "jwt_token_here",
        "user": {
            "id": 1,
            "username": "johndoe",
            "email": "user@example.com",
            "role": "student",
            "qualification": "undergraduate",
            "institute_company": "RGIT",
            "coins": 50,
            "rank": 5
        }
    }
    
    Error Response (401):
    {
        "success": false,
        "message": "Invalid credentials"
    }
    """
    email = request.json.get("email")
    password = request.json.get("password")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, password_hash, username, role, qualification, institute_company, coins, rank 
        FROM users 
        WHERE email = ?
    ''', (email,))
    result = cursor.fetchone()
    conn.close()

    if result and bcrypt.checkpw(password.encode('utf-8'), result['password_hash'].encode('utf-8')):
        token = jwt.encode({
            'user_id': result['id'],
            'email': email,
            'role': result['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=90)
        }, current_app.config['SECRET_KEY'])

        return jsonify({
            "success": True,
            "message": "Authentication successful",
            "token": token,
            "user": {
                "id": result['id'],
                "username": result['username'],
                "email": email,
                "role": result['role'],
                "qualification": result['qualification'],
                "institute_company": result['institute_company'],
                "coins": result['coins'],
                "rank": result['rank']
            }
        }), 200

    return jsonify({"success": False, "message": "Invalid credentials"}), 401

@user_management.route('/register', methods=['POST'])
def register():
    """
    Register a new user. Different requirements for admin and student roles.
    
    Request Format for Admin:
    {
        "username": "adminuser",
        "email": "admin@example.com",
        "password": "securepassword123",
        "role": "admin"
    }
    
    Request Format for Student:
    {
        "username": "studentuser",
        "email": "student@example.com",
        "password": "securepassword123",
        "role": "student",
        "qualification": "undergraduate",
        "institute_company": "RGIT",
        "interests": [1, 2, 3]  // Array of interest tag IDs
    }
    
    Note: qualification must be one of:
    - middle_school
    - high_school
    - undergraduate
    - graduate
    - post_graduate
    - working_professional
    - teacher
    
    Success Response (201):
    {
        "success": true,
        "message": "User registered successfully",
        "user_id": 1
    }
    
    Error Responses:
    - 400: Invalid role or missing required fields
    - 409: Email already exists
    - 500: Registration failed with error message
    """
    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")
    role = request.json.get("role")
    
    # Validate role
    if role not in ['admin', 'student']:
        return jsonify({"success": False, "message": "Invalid role. Must be 'admin' or 'student'"}), 400
    
    # Validate required fields based on role
    if role == 'student':
        qualification = request.json.get("qualification")
        institute_company = request.json.get("institute_company")
        interests = request.json.get("interests", [])
        
        if not all([qualification, institute_company]):
            return jsonify({"success": False, "message": "Missing required fields for student registration"}), 400
    else:
        qualification = None
        institute_company = None
        interests = []

    # Hash the password
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if email already exists
        cursor.execute('SELECT COUNT(*) FROM users WHERE email = ?', (email,))
        if cursor.fetchone()[0] > 0:
            return jsonify({"success": False, "message": "Email already exists"}), 409

        # Insert new user
        cursor.execute('''
            INSERT INTO users (username, email, password_hash, role, qualification, institute_company, exp)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        ''', (username, email, password_hash, role, qualification, institute_company))
        
        user_id = cursor.lastrowid

        # Add user interests if provided (only for students)
        if interests:
            for interest_id in interests:
                cursor.execute('''
                    INSERT INTO user_interests (user_id, interest_id)
                    VALUES (?, ?)
                ''', (user_id, interest_id))

        conn.commit()

        return jsonify({
            "success": True, 
            "message": "User registered successfully",
            "user_id": user_id
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Registration failed: {str(e)}"}), 500
    finally:
        conn.close()

@user_management.route('/get_profile', methods=['GET'])
@token_required
def get_profile():
    """
    Get the complete profile of the authenticated user including their interests.
    
    Headers Required:
    - Authorization: <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "user": {
            "id": 1,
            "username": "johndoe",
            "email": "user@example.com",
            "role": "student",
            "qualification": "undergraduate",
            "institute_company": "RGIT",
            "coins": 50,
            "rank": 5,
            "created_at": "2024-03-20T10:00:00",
            "interests": [
                {
                    "id": 1,
                    "name": "AIML",
                    "description": "Artificial Intelligence and Machine Learning"
                }
            ]
        }
    }
    
    Error Responses:
    - 404: User not found
    - 500: Failed to fetch profile with error message
    """
    token_data = request.token_data
    user_id = token_data['user_id']

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Get user details
        cursor.execute('''
            SELECT id, username, email, role, qualification, institute_company, coins, rank, created_at
            FROM users 
            WHERE id = ?
        ''', (user_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Get user interests (only for students)
        interests = []
        if user['role'] == 'student':
            cursor.execute('''
                SELECT it.id, it.name, it.description
                FROM interest_tags it
                JOIN user_interests ui ON it.id = ui.interest_id
                WHERE ui.user_id = ?
            ''', (user_id,))
            interests = cursor.fetchall()

        return jsonify({
            "success": True,
            "user": {
                "id": user['id'],
                "username": user['username'],
                "email": user['email'],
                "role": user['role'],
                "qualification": user['qualification'],
                "institute_company": user['institute_company'],
                "coins": user['coins'],
                "rank": user['rank'],
                "created_at": user['created_at'],
                "interests": [dict(interest) for interest in interests]
            }
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch profile: {str(e)}"}), 500
    finally:
        conn.close()

@user_management.route('/edit_profile', methods=['PUT'])
@token_required
def update_profile():
    """
    Update the profile of the authenticated user.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format for Student:
    {
        "username": "johndoe",           // optional
        "qualification": "undergraduate", // optional
        "institute_company": "RGIT",     // optional
        "interests": [1, 2, 3],          // optional, array of interest tag IDs
        "new_password": "newpass123"      // optional
    }
    
    Request Format for Admin:
    {
        "username": "adminuser",         // optional
        "new_password": "newpass123"      // optional
    }
    
    Note: qualification must be one of:
    - middle_school
    - high_school
    - undergraduate
    - graduate
    - post_graduate
    - working_professional
    - teacher
    
    Success Response (200):
    {
        "success": true,
        "message": "Profile updated successfully"
    }
    
    Error Response (500):
    {
        "success": false,
        "message": "Update failed: <error details>"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    role = token_data['role']

    # Get updateable fields
    username = request.json.get("username")
    new_password = request.json.get("new_password")

    # Role-specific fields
    if role == 'student':
        qualification = request.json.get("qualification")
        institute_company = request.json.get("institute_company")
        interests = request.json.get("interests")
    else:
        qualification = None
        institute_company = None
        interests = None

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Update user details
        update_fields = []
        update_values = []
        
        if username:
            update_fields.append("username = ?")
            update_values.append(username)
        if new_password:
            password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            update_fields.append("password_hash = ?")
            update_values.append(password_hash)
        if role == 'student':
            if qualification:
                update_fields.append("qualification = ?")
                update_values.append(qualification)
            if institute_company:
                update_fields.append("institute_company = ?")
                update_values.append(institute_company)

        if update_fields:
            update_values.append(user_id)
            cursor.execute(f'''
                UPDATE users 
                SET {', '.join(update_fields)}
                WHERE id = ?
            ''', update_values)

        # Update interests if provided (only for students)
        if role == 'student' and interests is not None:
            # Remove existing interests
            cursor.execute('DELETE FROM user_interests WHERE user_id = ?', (user_id,))
            
            # Add new interests
            for interest_id in interests:
                cursor.execute('''
                    INSERT INTO user_interests (user_id, interest_id)
                    VALUES (?, ?)
                ''', (user_id, interest_id))

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Profile updated successfully"
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Update failed: {str(e)}"}), 500
    finally:
        conn.close()

@user_management.route('/get_all_students', methods=['GET'])
@token_required
def get_all_students():
    """
    Get the list of all students and their data. Only admin users can access this endpoint.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "students": [
            {
                "id": 1,
                "username": "johndoe",
                "email": "student@example.com",
                "qualification": "undergraduate",
                "institute_company": "RGIT",
                "coins": 50,
                "rank": 5,
                "created_at": "2024-03-20T10:00:00"
            },
            ...
        ]
    }
    
    Error Responses:
    - 403: Unauthorized access (non-admin users)
    - 500: Failed to fetch students with error message
    """
    token_data = request.token_data
    
    # Check if user is admin
    if token_data['role'] != 'admin':
        return jsonify({"success": False, "message": "Only admin users can access this endpoint"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Get all students
        cursor.execute('''
            SELECT id, username, email, qualification, institute_company, coins, rank, created_at
            FROM users 
            WHERE role = 'student'
        ''')
        students = cursor.fetchall()

        return jsonify({
            "success": True,
            "students": [dict(student) for student in students]
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch students: {str(e)}"}), 500
    finally:
        conn.close()
