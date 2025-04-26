from flask import Blueprint, jsonify, request
from utils import get_db_connection, token_required

lessons = Blueprint('lessons', __name__)

@lessons.route('/create_lesson', methods=['POST'])
@token_required
def create_lesson():
    """
    Create a new lesson for a course.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format:
    {
        "course_id": 1,
        "title": "Introduction to Variables",
        "content_html": "<p>This lesson covers variables in Python...</p>",
        "pdf_notes_url": "https://example.com/notes.pdf",
        "video_url": "https://youtube.com/watch?v=12345",
        "order_number": 1,
        "exp_reward": 50,
        "coins_reward": 20
    }
    
    Success Response (201):
    {
        "success": true,
        "message": "Lesson created successfully",
        "lesson_id": 1
    }
    
    Error Response (500):
    {
        "success": false,
        "message": "Lesson creation failed: <error details>"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    # Get lesson data from request
    data = request.get_json()
    course_id = data.get('course_id')
    title = data.get('title')
    content_html = data.get('content_html')
    pdf_notes_url = data.get('pdf_notes_url')
    video_url = data.get('video_url')
    order_number = data.get('order_number')
    coins_reward = data.get('coins_reward', 0)
    
    # Validate required fields
    if not course_id or not title or not order_number:
        return jsonify({"success": False, "message": "Course ID, title, and order number are required"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Verify the course exists and user is the creator
        cursor.execute('''
            SELECT creator_id FROM courses WHERE id = ?
        ''', (course_id,))
        course = cursor.fetchone()
        
        if not course:
            return jsonify({"success": False, "message": "Course not found"}), 404
        
        # Only allow course creator or admin to add lessons
        if course['creator_id'] != user_id and token_data['role'] != 'admin':
            return jsonify({"success": False, "message": "Unauthorized to add lessons to this course"}), 403
        
        # Insert lesson
        cursor.execute('''
            INSERT INTO lessons (
                course_id, title, content_html, pdf_notes_url, video_url,
                order_number, coins_reward
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            course_id, title, content_html, pdf_notes_url, video_url,
            order_number, coins_reward
        ))
        
        lesson_id = cursor.lastrowid
        
        # Update total coins for the course
        cursor.execute('''
            UPDATE courses
            SET total_coins = total_coins + ?
            WHERE id = ?
        ''', (coins_reward, course_id))
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Lesson created successfully",
            "lesson_id": lesson_id
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Lesson creation failed: {str(e)}"}), 500
    finally:
        conn.close()

@lessons.route('/course_lessons/<int:course_id>', methods=['GET'])
def get_course_lessons(course_id):
    """
    Get all lessons for a specific course.
    
    Success Response (200):
    {
        "success": true,
        "course_title": "Introduction to Python",
        "total_count": 10,
        "lessons": [
            {
                "id": 1,
                "title": "Introduction to Variables",
                "content_html": "<p>This lesson covers variables in Python...</p>",
                "pdf_notes_url": "https://example.com/notes.pdf",
                "video_url": "https://youtube.com/watch?v=12345",
                "order_number": 1,
                "coins_reward": 20,
                "created_at": "2023-01-01T12:00:00",
                "updated_at": "2023-01-01T12:00:00",
                "quest_count": 2
            },
            ...
        ]
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
        # Verify the course exists
        cursor.execute('SELECT title FROM courses WHERE id = ?', (course_id,))
        course = cursor.fetchone()
        
        if not course:
            return jsonify({"success": False, "message": "Course not found"}), 404
        
        # Get all lessons for the course, ordered by order_number
        cursor.execute('''
            SELECT * FROM lessons
            WHERE course_id = ?
            ORDER BY order_number
        ''', (course_id,))
        lessons = cursor.fetchall()
        
        result = []
        for lesson in lessons:
            # Get quest count for this lesson
            cursor.execute('''
                SELECT COUNT(*) as quest_count
                FROM quests
                WHERE lesson_id = ?
            ''', (lesson['id'],))
            quest_count = cursor.fetchone()['quest_count']
            
            lesson_data = dict(lesson)
            lesson_data['quest_count'] = quest_count
            
            result.append(lesson_data)
        
        return jsonify({
            "success": True,
            "course_title": course['title'],
            "total_count": len(result),
            "lessons": result
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch lessons: {str(e)}"}), 500
    finally:
        conn.close()

@lessons.route('/user_completed_lessons/<int:user_id>', methods=['GET'])
@token_required
def get_completed_lessons(user_id):
    """
    Get all lessons completed by a specific user.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "total_count": 15,
        "completed_lessons": [
            {
                "id": 1,
                "course_id": 1,
                "course_title": "Introduction to Python",
                "title": "Introduction to Variables",
                "order_number": 1,
                "coins_reward": 20,
                "completion_date": "2023-01-02T15:30:00"
            },
            ...
        ]
    }
    
    Error Response (403):
    {
        "success": false,
        "message": "Unauthorized access"
    }
    """
    token_data = request.token_data
    # Check if user is requesting their own lessons or if admin is requesting
    if token_data['user_id'] != user_id and token_data['role'] != 'admin':
        return jsonify({"success": False, "message": "Unauthorized access"}), 403
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get all completed lessons for the user
        cursor.execute('''
            SELECT l.id, l.course_id, c.title as course_title, l.title, 
                   l.order_number, l.coins_reward, cl.completion_date
            FROM completed_lessons cl
            JOIN lessons l ON cl.lesson_id = l.id
            JOIN courses c ON l.course_id = c.id
            WHERE cl.user_id = ?
            ORDER BY cl.completion_date DESC
        ''', (user_id,))
        completed_lessons = cursor.fetchall()
        
        return jsonify({
            "success": True,
            "total_count": len(completed_lessons),
            "completed_lessons": [dict(lesson) for lesson in completed_lessons]
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch completed lessons: {str(e)}"}), 500
    finally:
        conn.close()

@lessons.route('/mark_completed_lesson/<int:lesson_id>', methods=['POST'])
@token_required
def complete_lesson(lesson_id):
    """
    Mark a lesson as completed by the authenticated user.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "message": "Lesson marked as completed",
        "coins_gained": 20,
        "course_progress": 35.5
    }
    
    Error Response (400):
    {
        "success": false,
        "message": "Lesson already completed"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if lesson exists
        cursor.execute('''
            SELECT l.*, c.id as course_id 
            FROM lessons l
            JOIN courses c ON l.course_id = c.id
            WHERE l.id = ?
        ''', (lesson_id,))
        lesson = cursor.fetchone()
        
        if not lesson:
            return jsonify({"success": False, "message": "Lesson not found"}), 404
        
        # Check if user is enrolled in the course
        cursor.execute('''
            SELECT * FROM user_enrollments
            WHERE user_id = ? AND course_id = ?
        ''', (user_id, lesson['course_id']))
        enrollment = cursor.fetchone()
        
        if not enrollment:
            return jsonify({"success": False, "message": "User not enrolled in this course"}), 403
        
        # Check if lesson already completed
        cursor.execute('''
            SELECT * FROM completed_lessons
            WHERE user_id = ? AND lesson_id = ?
        ''', (user_id, lesson_id))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Lesson already completed"}), 400
        
        # Mark lesson as completed
        cursor.execute('''
            INSERT INTO completed_lessons (user_id, lesson_id)
            VALUES (?, ?)
        ''', (user_id, lesson_id))
        
        # Award coins to user
        cursor.execute('''
            UPDATE users
            SET coins = coins + ?
            WHERE id = ?
        ''', (lesson['coins_reward'], user_id))
        
        # Calculate new course progress
        cursor.execute('''
            SELECT COUNT(*) as total_lessons
            FROM lessons
            WHERE course_id = ?
        ''', (lesson['course_id'],))
        total_lessons = cursor.fetchone()['total_lessons']
        
        cursor.execute('''
            SELECT COUNT(*) as completed_count
            FROM completed_lessons cl
            JOIN lessons l ON cl.lesson_id = l.id
            WHERE l.course_id = ? AND cl.user_id = ?
        ''', (lesson['course_id'], user_id))
        completed_count = cursor.fetchone()['completed_count']
        
        progress_percentage = (completed_count / total_lessons) * 100 if total_lessons > 0 else 0
        
        # Update course progress
        cursor.execute('''
            UPDATE user_enrollments
            SET progress_percentage = ?,
                last_accessed_date = CURRENT_TIMESTAMP
            WHERE user_id = ? AND course_id = ?
        ''', (progress_percentage, user_id, lesson['course_id']))
        
        # Check if all lessons completed
        if completed_count == total_lessons:
            cursor.execute('''
                UPDATE user_enrollments
                SET is_completed = 1,
                    completion_date = CURRENT_TIMESTAMP
                WHERE user_id = ? AND course_id = ?
            ''', (user_id, lesson['course_id']))
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Lesson marked as completed",
            "coins_gained": lesson['coins_reward'],
            "course_progress": progress_percentage
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Failed to complete lesson: {str(e)}"}), 500
    finally:
        conn.close()

@lessons.route('/get_lesson_details/<int:lesson_id>', methods=['GET'])
def get_lesson_details(lesson_id):
    """
    Get detailed information about a specific lesson.
    
    Success Response (200):
    {
        "success": true,
        "lesson": {
            "id": 1,
            "course_id": 1,
            "course_title": "Introduction to Python",
            "title": "Introduction to Variables",
            "content_html": "<p>This lesson covers variables in Python...</p>",
            "pdf_notes_url": "https://example.com/notes.pdf",
            "video_url": "https://youtube.com/watch?v=12345",
            "order_number": 1,
            "coins_reward": 20,
            "created_at": "2023-01-01T12:00:00",
            "updated_at": "2023-01-01T12:00:00",
            "quests": [
                {
                    "id": 1,
                    "title": "Variables Quiz",
                    "time_duration_minutes": 10
                },
                ...
            ],
            "next_lesson": {
                "id": 2,
                "title": "Data Types in Python"
            },
            "prev_lesson": null
        }
    }
    
    Error Response (404):
    {
        "success": false,
        "message": "Lesson not found"
    }
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get lesson details
        cursor.execute('''
            SELECT l.*, c.title as course_title
            FROM lessons l
            JOIN courses c ON l.course_id = c.id
            WHERE l.id = ?
        ''', (lesson_id,))
        lesson = cursor.fetchone()
        
        if not lesson:
            return jsonify({"success": False, "message": "Lesson not found"}), 404
        
        # Get quests for this lesson
        cursor.execute('''
            SELECT id, title, time_duration_minutes
            FROM quests
            WHERE lesson_id = ?
            ORDER BY id
        ''', (lesson_id,))
        quests = cursor.fetchall()
        
        # Get next lesson
        cursor.execute('''
            SELECT id, title
            FROM lessons
            WHERE course_id = ? AND order_number > ?
            ORDER BY order_number
            LIMIT 1
        ''', (lesson['course_id'], lesson['order_number']))
        next_lesson = cursor.fetchone()
        
        # Get previous lesson
        cursor.execute('''
            SELECT id, title
            FROM lessons
            WHERE course_id = ? AND order_number < ?
            ORDER BY order_number DESC
            LIMIT 1
        ''', (lesson['course_id'], lesson['order_number']))
        prev_lesson = cursor.fetchone()
        
        lesson_data = dict(lesson)
        lesson_data['quests'] = [dict(quest) for quest in quests]
        lesson_data['next_lesson'] = dict(next_lesson) if next_lesson else None
        lesson_data['prev_lesson'] = dict(prev_lesson) if prev_lesson else None
        
        return jsonify({
            "success": True,
            "lesson": lesson_data
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch lesson details: {str(e)}"}), 500
    finally:
        conn.close()
