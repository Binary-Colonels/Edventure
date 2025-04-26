from flask import Blueprint, jsonify, request
from utils import get_db_connection, token_required

quests = Blueprint('quests', __name__)

@quests.route('/create_quest', methods=['POST'])
@token_required
def create_quest():
    """
    Create a new quest for a lesson.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format:
    {
        "lesson_id": 1,
        "title": "Variables Quiz",
        "description": "Test your knowledge of Python variables",
        "time_duration_minutes": 15,
        "exp_reward": 30
    }
    
    Success Response (201):
    {
        "success": true,
        "message": "Quest created successfully",
        "quest_id": 1
    }
    
    Error Response (500):
    {
        "success": false,
        "message": "Quest creation failed: <error details>"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    # Get quest data from request
    data = request.get_json()
    lesson_id = data.get('lesson_id')
    title = data.get('title')
    description = data.get('description')
    time_duration_minutes = data.get('time_duration_minutes')
    
    # Validate required fields
    if not lesson_id or not title or not time_duration_minutes:
        return jsonify({"success": False, "message": "Lesson ID, title, and time duration are required"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get lesson details to verify it exists and get course_id
        cursor.execute('''
            SELECT l.*, c.creator_id
            FROM lessons l
            JOIN courses c ON l.course_id = c.id
            WHERE l.id = ?
        ''', (lesson_id,))
        lesson = cursor.fetchone()
        
        if not lesson:
            return jsonify({"success": False, "message": "Lesson not found"}), 404
        
        # Only allow course creator or admin to add quests
        if lesson['creator_id'] != user_id and token_data['role'] != 'admin':
            return jsonify({"success": False, "message": "Unauthorized to add quests to this lesson"}), 403
        
        # Insert quest
        cursor.execute('''
            INSERT INTO quests (
                lesson_id, course_id, title, description, 
                time_duration_minutes
            ) VALUES (?, ?, ?, ?, ?)
        ''', (
            lesson_id, lesson['course_id'], title, description, 
            time_duration_minutes
        ))
        
        quest_id = cursor.lastrowid
        
        # Update total exp for the course
        cursor.execute('''
            UPDATE courses
            SET 
            WHERE id = ?
        ''', (lesson['course_id'],))
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Quest created successfully",
            "quest_id": quest_id
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Quest creation failed: {str(e)}"}), 500
    finally:
        conn.close()

@quests.route('/lesson_quests/<int:lesson_id>', methods=['GET'])
def get_lesson_quests(lesson_id):
    """
    Get all quests for a specific lesson.
    
    Success Response (200):
    {
        "success": true,
        "lesson_title": "Introduction to Variables",
        "total_count": 3,
        "quests": [
            {
                "id": 1,
                "title": "Variables Quiz",
                "description": "Test your knowledge of Python variables",
                "time_duration_minutes": 15,
                "created_at": "2023-01-01T12:00:00",
                "updated_at": "2023-01-01T12:00:00",
                "question_count": 5
            },
            ...
        ]
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
        # Verify the lesson exists
        cursor.execute('SELECT title FROM lessons WHERE id = ?', (lesson_id,))
        lesson = cursor.fetchone()
        
        if not lesson:
            return jsonify({"success": False, "message": "Lesson not found"}), 404
        
        # Get all quests for the lesson
        cursor.execute('''
            SELECT * FROM quests
            WHERE lesson_id = ?
            ORDER BY id
        ''', (lesson_id,))
        quests = cursor.fetchall()
        
        result = []
        for quest in quests:
            # Get question count for this quest
            cursor.execute('''
                SELECT COUNT(*) as question_count
                FROM quest_questions
                WHERE quest_id = ?
            ''', (quest['id'],))
            question_count = cursor.fetchone()['question_count']
            
            quest_data = dict(quest)
            quest_data['question_count'] = question_count
            
            result.append(quest_data)
        
        return jsonify({
            "success": True,
            "lesson_title": lesson['title'],
            "total_count": len(result),
            "quests": result
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch quests: {str(e)}"}), 500
    finally:
        conn.close()

@quests.route('/completed/<int:user_id>', methods=['GET'])
@token_required
def get_completed_quests(user_id):
    """
    Get all quests completed by a specific user.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "total_count": 10,
        "completed_quests": [
            {
                "id": 1,
                "lesson_id": 1,
                "lesson_title": "Introduction to Variables",
                "course_id": 1,
                "course_title": "Introduction to Python",
                "title": "Variables Quiz",
                "time_duration_minutes": 15,
                "time_taken_seconds": 450,
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
    # Check if user is requesting their own quests or if admin is requesting
    if token_data['user_id'] != user_id and token_data['role'] != 'admin':
        return jsonify({"success": False, "message": "Unauthorized access"}), 403
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get all completed quests for the user
        cursor.execute('''
            SELECT q.id, q.lesson_id, l.title as lesson_title, q.course_id, 
                   c.title as course_title, q.title, q.time_duration_minutes, 
                   cq.time_taken_seconds, cq.completion_date
            FROM completed_quests cq
            JOIN quests q ON cq.quest_id = q.id
            JOIN lessons l ON q.lesson_id = l.id
            JOIN courses c ON q.course_id = c.id
            WHERE cq.user_id = ?
            ORDER BY cq.completion_date DESC
        ''', (user_id,))
        completed_quests = cursor.fetchall()
        
        return jsonify({
            "success": True,
            "total_count": len(completed_quests),
            "completed_quests": [dict(quest) for quest in completed_quests]
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch completed quests: {str(e)}"}), 500
    finally:
        conn.close()

@quests.route('/mark_completed_quest/<int:quest_id>', methods=['POST'])
@token_required
def complete_quest(quest_id):
    """
    Mark a quest as completed by the authenticated user.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format:
    {
        "time_taken_seconds": 450
    }
    
    Success Response (200):
    {
        "success": true,
        "message": "Quest marked as completed",
        "exp_gained": 30,
        "course_progress": 40.0
    }
    
    Error Response (400):
    {
        "success": false,
        "message": "Quest already completed"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    # Get time taken
    data = request.get_json()
    time_taken_seconds = data.get('time_taken_seconds', 0)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if quest exists
        cursor.execute('''
            SELECT q.*, l.course_id 
            FROM quests q
            JOIN lessons l ON q.lesson_id = l.id
            WHERE q.id = ?
        ''', (quest_id,))
        quest = cursor.fetchone()
        
        if not quest:
            return jsonify({"success": False, "message": "Quest not found"}), 404
        
        # Check if user is enrolled in the course
        cursor.execute('''
            SELECT * FROM user_enrollments
            WHERE user_id = ? AND course_id = ?
        ''', (user_id, quest['course_id']))
        enrollment = cursor.fetchone()
        
        if not enrollment:
            return jsonify({"success": False, "message": "User not enrolled in this course"}), 403
        
        # Check if quest already completed
        cursor.execute('''
            SELECT * FROM completed_quests
            WHERE user_id = ? AND quest_id = ?
        ''', (user_id, quest_id))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Quest already completed"}), 400
        
        # Mark quest as completed
        cursor.execute('''
            INSERT INTO completed_quests (user_id, quest_id, time_taken_seconds)
            VALUES (?, ?, ?)
        ''', (user_id, quest_id, time_taken_seconds))
        
        # Calculate new course progress (based on lessons completed, not quests)
        cursor.execute('''
            SELECT COUNT(*) as total_lessons
            FROM lessons
            WHERE course_id = ?
        ''', (quest['course_id'],))
        total_lessons = cursor.fetchone()['total_lessons']
        
        cursor.execute('''
            SELECT COUNT(*) as completed_count
            FROM completed_lessons cl
            JOIN lessons l ON cl.lesson_id = l.id
            WHERE l.course_id = ? AND cl.user_id = ?
        ''', (quest['course_id'], user_id))
        completed_count = cursor.fetchone()['completed_count']
        
        progress_percentage = (completed_count / total_lessons) * 100 if total_lessons > 0 else 0
        
        # Update course progress
        cursor.execute('''
            UPDATE user_enrollments
            SET last_accessed_date = CURRENT_TIMESTAMP
            WHERE user_id = ? AND course_id = ?
        ''', (user_id, quest['course_id']))
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Quest marked as completed",
            "exp_gained": quest['exp_reward'],
            "course_progress": progress_percentage
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Failed to complete quest: {str(e)}"}), 500
    finally:
        conn.close()

@quests.route('/get_quest_details/<int:quest_id>', methods=['GET'])
def get_quest_details(quest_id):
    """
    Get detailed information about a specific quest.
    
    Success Response (200):
    {
        "success": true,
        "quest": {
            "id": 1,
            "lesson_id": 1,
            "lesson_title": "Introduction to Variables",
            "course_id": 1,
            "course_title": "Introduction to Python",
            "title": "Variables Quiz",
            "description": "Test your knowledge of Python variables",
            "time_duration_minutes": 15,
            "created_at": "2023-01-01T12:00:00",
            "updated_at": "2023-01-01T12:00:00",
            "question_count": 5
        }
    }
    
    Error Response (404):
    {
        "success": false,
        "message": "Quest not found"
    }
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get quest details
        cursor.execute('''
            SELECT q.*, l.title as lesson_title, c.title as course_title
            FROM quests q
            JOIN lessons l ON q.lesson_id = l.id
            JOIN courses c ON q.course_id = c.id
            WHERE q.id = ?
        ''', (quest_id,))
        quest = cursor.fetchone()
        
        if not quest:
            return jsonify({"success": False, "message": "Quest not found"}), 404
        
        # Get question count for this quest
        cursor.execute('''
            SELECT COUNT(*) as question_count
            FROM quest_questions
            WHERE quest_id = ?
        ''', (quest_id,))
        question_count = cursor.fetchone()['question_count']
        
        quest_data = dict(quest)
        quest_data['question_count'] = question_count
        
        return jsonify({
            "success": True,
            "quest": quest_data
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch quest details: {str(e)}"}), 500
    finally:
        conn.close()
