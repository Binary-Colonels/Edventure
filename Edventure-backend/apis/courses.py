from flask import Blueprint, jsonify, request
from utils import get_db_connection, token_required

courses = Blueprint('courses', __name__)

@courses.route('/create_course', methods=['POST'])
@token_required
def create_course():
    """
    Create a new course.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format:
    {
        "title": "Introduction to Python",
        "description": "Learn the basics of Python programming",
        "difficulty_level": 2,
        "thumbnail_url": "https://example.com/thumbnail.jpg",
        "duration_hours": 10,
        "prerequisites": "Basic programming knowledge",
        "total_coins": 200,
        "interest_tags": [1, 2, 3]  // Array of interest tag IDs
    }
    
    Success Response (201):
    {
        "success": true,
        "message": "Course created successfully",
        "course_id": 1
    }
    
    Error Response (500):
    {
        "success": false,
        "message": "Course creation failed: <error details>"
    }
    """
    token_data = request.token_data
    creator_id = token_data['user_id']
    
    # Get course data from request
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    difficulty_level = data.get('difficulty_level')
    thumbnail_url = data.get('thumbnail_url')
    duration_hours = data.get('duration_hours')
    prerequisites = data.get('prerequisites')
    total_coins = data.get('total_coins', 0)
    interest_tags = data.get('interest_tags', [])
    
    # Validate required fields
    if not title or not difficulty_level:
        return jsonify({"success": False, "message": "Title and difficulty level are required"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Insert course
        cursor.execute('''
            INSERT INTO courses (
                title, description, difficulty_level, thumbnail_url, 
                duration_hours, prerequisites, creator_id, total_coins
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            title, description, difficulty_level, thumbnail_url,
            duration_hours, prerequisites, creator_id, total_coins
        ))
        
        course_id = cursor.lastrowid
        
        # Add interest tags
        for tag_id in interest_tags:
            cursor.execute('''
                INSERT INTO course_tags (course_id, interest_id)
                VALUES (?, ?)
            ''', (course_id, tag_id))
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Course created successfully",
            "course_id": course_id
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Course creation failed: {str(e)}"}), 500
    finally:
        conn.close()

@courses.route('/all_courses', methods=['GET'])
def get_all_courses():
    """
    Get all courses with details including lesson and quest counts.
    
    Success Response (200):
    {
        "success": true,
        "total_count": 5,
        "courses": [
            {
                "id": 1,
                "title": "Introduction to Python",
                "description": "Learn the basics of Python programming",
                "difficulty_level": 2,
                "thumbnail_url": "https://example.com/thumbnail.jpg",
                "duration_hours": 10,
                "prerequisites": "Basic programming knowledge",
                "creator_id": 1,
                "total_coins": 200,
                "created_at": "2023-01-01T12:00:00",
                "updated_at": "2023-01-01T12:00:00",
                "lesson_count": 10,
                "quest_count": 5,
                "interest_tags": [1, 2, 3]
            },
            ...
        ]
    }
    
    Error Response (500):
    {
        "success": false,
        "message": "Failed to fetch courses: <error details>"
    }
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get all courses
        cursor.execute('''
            SELECT * FROM courses
            ORDER BY created_at DESC
        ''')
        courses = cursor.fetchall()
        
        result = []
        for course in courses:
            # Get lesson count
            cursor.execute('''
                SELECT COUNT(*) as lesson_count
                FROM lessons
                WHERE course_id = ?
            ''', (course['id'],))
            lesson_count = cursor.fetchone()['lesson_count']
            
            # Get quest count
            cursor.execute('''
                SELECT COUNT(*) as quest_count
                FROM quests
                WHERE course_id = ?
            ''', (course['id'],))
            quest_count = cursor.fetchone()['quest_count']
            
            # Get interest tags
            cursor.execute('''
                SELECT interest_id
                FROM course_tags
                WHERE course_id = ?
            ''', (course['id'],))
            tags = cursor.fetchall()
            interest_tags = [tag['interest_id'] for tag in tags]
            
            course_data = dict(course)
            course_data['lesson_count'] = lesson_count
            course_data['quest_count'] = quest_count
            course_data['interest_tags'] = interest_tags
            
            result.append(course_data)
        
        return jsonify({
            "success": True,
            "total_count": len(result),
            "courses": result
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch courses: {str(e)}"}), 500
    finally:
        conn.close()

@courses.route('/user_courses/<int:user_id>', methods=['GET'])
@token_required
def get_user_courses(user_id):
    """
    Get all courses a user has enrolled in with progress details.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "total_count": 3,
        "courses": [
            {
                "id": 1,
                "title": "Introduction to Python",
                "description": "Learn the basics of Python programming",
                "difficulty_level": 2,
                "thumbnail_url": "https://example.com/thumbnail.jpg",
                "duration_hours": 10,
                "prerequisites": "Basic programming knowledge",
                "creator_id": 1,
                "total_coins": 200,
                "created_at": "2023-01-01T12:00:00",
                "updated_at": "2023-01-01T12:00:00",
                "lesson_count": 10,
                "quest_count": 5,
                "completed_lessons": 5,
                "completed_quests": 3,
                "progress_percentage": 50.0,
                "enrollment_date": "2023-01-02T10:00:00",
                "is_completed": false
            },
            ...
        ]
    }
    
    Error Response (500):
    {
        "success": false,
        "message": "Failed to fetch user courses: <error details>"
    }
    """
    token_data = request.token_data
    # Check if user is requesting their own courses or if admin is requesting
    if token_data['user_id'] != user_id and token_data['role'] != 'admin':
        return jsonify({"success": False, "message": "Unauthorized access"}), 403
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get enrolled courses
        cursor.execute('''
            SELECT c.*, ue.enrollment_date, ue.progress_percentage, ue.is_completed
            FROM courses c
            JOIN user_enrollments ue ON c.id = ue.course_id
            WHERE ue.user_id = ?
            ORDER BY ue.enrollment_date DESC
        ''', (user_id,))
        courses = cursor.fetchall()
        
        result = []
        for course in courses:
            # Get lesson count
            cursor.execute('''
                SELECT COUNT(*) as lesson_count
                FROM lessons
                WHERE course_id = ?
            ''', (course['id'],))
            lesson_count = cursor.fetchone()['lesson_count']
            
            # Get quest count
            cursor.execute('''
                SELECT COUNT(*) as quest_count
                FROM quests
                WHERE course_id = ?
            ''', (course['id'],))
            quest_count = cursor.fetchone()['quest_count']
            
            # Get completed lessons count
            cursor.execute('''
                SELECT COUNT(*) as completed_count
                FROM completed_lessons cl
                JOIN lessons l ON cl.lesson_id = l.id
                WHERE l.course_id = ? AND cl.user_id = ?
            ''', (course['id'], user_id))
            completed_lessons = cursor.fetchone()['completed_count']
            
            # Get completed quests count
            cursor.execute('''
                SELECT COUNT(*) as completed_count
                FROM completed_quests cq
                JOIN quests q ON cq.quest_id = q.id
                WHERE q.course_id = ? AND cq.user_id = ?
            ''', (course['id'], user_id))
            completed_quests = cursor.fetchone()['completed_count']
            
            course_data = dict(course)
            course_data['lesson_count'] = lesson_count
            course_data['quest_count'] = quest_count
            course_data['completed_lessons'] = completed_lessons
            course_data['completed_quests'] = completed_quests
            
            result.append(course_data)
        
        return jsonify({
            "success": True,
            "total_count": len(result),
            "courses": result
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch user courses: {str(e)}"}), 500
    finally:
        conn.close()

@courses.route('/course_details/<int:course_id>', methods=['GET'])
def get_course_details(course_id):
    """
    Get detailed information about a specific course.
    
    Success Response (200):
    {
        "success": true,
        "course": {
            "id": 1,
            "title": "Introduction to Python",
            "description": "Learn the basics of Python programming",
            "difficulty_level": 2,
            "thumbnail_url": "https://example.com/thumbnail.jpg",
            "duration_hours": 10,
            "prerequisites": "Basic programming knowledge",
            "creator_id": 1,
            "creator_name": "John Doe",
            "total_coins": 200,
            "created_at": "2023-01-01T12:00:00",
            "updated_at": "2023-01-01T12:00:00",
            "lesson_count": 10,
            "quest_count": 5,
            "interest_tags": [
                {
                    "id": 1,
                    "name": "AIML",
                    "description": "Artificial Intelligence and Machine Learning"
                },
                ...
            ],
            "enrollment_count": 150
        }
    }
    
    Error Response (404):
    {
        "success": false,
        "message": "Course not found"
    }
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get course details
        cursor.execute('''
            SELECT c.*, u.username as creator_name
            FROM courses c
            LEFT JOIN users u ON c.creator_id = u.id
            WHERE c.id = ?
        ''', (course_id,))
        course = cursor.fetchone()
        
        if not course:
            return jsonify({"success": False, "message": "Course not found"}), 404
        
        # Get lesson count
        cursor.execute('''
            SELECT COUNT(*) as lesson_count
            FROM lessons
            WHERE course_id = ?
        ''', (course_id,))
        lesson_count = cursor.fetchone()['lesson_count']
        
        # Get quest count
        cursor.execute('''
            SELECT COUNT(*) as quest_count
            FROM quests
            WHERE course_id = ?
        ''', (course_id,))
        quest_count = cursor.fetchone()['quest_count']
        
        # Get interest tags
        cursor.execute('''
            SELECT it.*
            FROM interest_tags it
            JOIN course_tags ct ON it.id = ct.interest_id
            WHERE ct.course_id = ?
        ''', (course_id,))
        interest_tags = cursor.fetchall()
        
        # Get enrollment count
        cursor.execute('''
            SELECT COUNT(*) as enrollment_count
            FROM user_enrollments
            WHERE course_id = ?
        ''', (course_id,))
        enrollment_count = cursor.fetchone()['enrollment_count']
        
        course_data = dict(course)
        course_data['lesson_count'] = lesson_count
        course_data['quest_count'] = quest_count
        course_data['interest_tags'] = [dict(tag) for tag in interest_tags]
        course_data['enrollment_count'] = enrollment_count
        
        return jsonify({
            "success": True,
            "course": course_data
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch course details: {str(e)}"}), 500
    finally:
        conn.close()
