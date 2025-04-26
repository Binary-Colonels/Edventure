from flask import Blueprint, jsonify, request
from utils import get_db_connection, token_required

enrollments = Blueprint('enrollments', __name__)

@enrollments.route('/enroll_to_course', methods=['POST'])
@token_required
def enroll_in_course():
    """
    Enroll the authenticated user in a specific course.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format:
    {
        "course_id": 1
    }
    
    Success Response (201):
    {
        "success": true,
        "message": "Successfully enrolled in the course",
        "enrollment_id": {
            "user_id": 1,
            "course_id": 1
        }
    }
    
    Error Response (400):
    {
        "success": false,
        "message": "Already enrolled in this course"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    data = request.get_json()
    course_id = data.get('course_id')
    
    if not course_id:
        return jsonify({"success": False, "message": "Course ID is required"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if course exists
        cursor.execute('SELECT * FROM courses WHERE id = ?', (course_id,))
        course = cursor.fetchone()
        
        if not course:
            return jsonify({"success": False, "message": "Course not found"}), 404
        
        # Check if user is already enrolled
        cursor.execute('''
            SELECT * FROM user_enrollments
            WHERE user_id = ? AND course_id = ?
        ''', (user_id, course_id))
        
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Already enrolled in this course"}), 400
        
        # Enroll the user
        cursor.execute('''
            INSERT INTO user_enrollments (user_id, course_id)
            VALUES (?, ?)
        ''', (user_id, course_id))
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Successfully enrolled in the course",
            "enrollment_id": {
                "user_id": user_id,
                "course_id": course_id
            }
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Enrollment failed: {str(e)}"}), 500
    finally:
        conn.close()

@enrollments.route('/user_enrollments/<int:user_id>', methods=['GET'])
@token_required
def get_user_enrollments(user_id):
    """
    Get all enrollments for a specific user.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "total_count": 3,
        "enrollments": [
            {
                "course_id": 1,
                "course_title": "Introduction to Python",
                "enrollment_date": "2023-01-02T10:00:00",
                "last_accessed_date": "2023-01-05T15:30:00",
                "progress_percentage": 35.5,
                "is_completed": false,
                "completion_date": null
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
    # Check if user is requesting their own enrollments or if admin is requesting
    if token_data['user_id'] != user_id and token_data['role'] != 'admin':
        return jsonify({"success": False, "message": "Unauthorized access"}), 403
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get all enrollments for the user
        cursor.execute('''
            SELECT ue.course_id, c.title as course_title, ue.enrollment_date,
                   ue.last_accessed_date, ue.progress_percentage, ue.is_completed,
                   ue.completion_date
            FROM user_enrollments ue
            JOIN courses c ON ue.course_id = c.id
            WHERE ue.user_id = ?
            ORDER BY ue.enrollment_date DESC
        ''', (user_id,))
        enrollments = cursor.fetchall()
        
        return jsonify({
            "success": True,
            "total_count": len(enrollments),
            "enrollments": [dict(enrollment) for enrollment in enrollments]
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch enrollments: {str(e)}"}), 500
    finally:
        conn.close()

@enrollments.route('/course_enrollments/<int:course_id>', methods=['GET'])
@token_required
def get_course_enrollments(course_id):
    """
    Get all users enrolled in a specific course.
    Only accessible to the course creator or admin.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "total_count": 50,
        "enrollments": [
            {
                "user_id": 1,
                "username": "johndoe",
                "enrollment_date": "2023-01-02T10:00:00",
                "progress_percentage": 35.5,
                "is_completed": false,
                "completion_date": null
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
    user_id = token_data['user_id']
    role = token_data['role']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if course exists and user is authorized
        cursor.execute('''
            SELECT creator_id FROM courses
            WHERE id = ?
        ''', (course_id,))
        course = cursor.fetchone()
        
        if not course:
            return jsonify({"success": False, "message": "Course not found"}), 404
        
        # Only allow course creator or admin to view all enrollments
        if course['creator_id'] != user_id and role != 'admin':
            return jsonify({"success": False, "message": "Unauthorized access"}), 403
        
        # Get all users enrolled in the course
        cursor.execute('''
            SELECT ue.user_id, u.username, ue.enrollment_date,
                   ue.progress_percentage, ue.is_completed, ue.completion_date
            FROM user_enrollments ue
            JOIN users u ON ue.user_id = u.id
            WHERE ue.course_id = ?
            ORDER BY ue.enrollment_date DESC
        ''', (course_id,))
        enrollments = cursor.fetchall()
        
        return jsonify({
            "success": True,
            "total_count": len(enrollments),
            "enrollments": [dict(enrollment) for enrollment in enrollments]
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch enrollments: {str(e)}"}), 500
    finally:
        conn.close()

@enrollments.route('/enrolled_course_details', methods=['GET'])
@token_required
def get_enrollment_details():
    """
    Get detailed enrollment information for the authenticated user in a specific course.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Query Parameters:
    - course_id: ID of the course to check enrollment for
    
    Success Response (200):
    {
        "success": true,
        "enrolled": true,
        "enrollment": {
            "course_id": 1,
            "course_title": "Introduction to Python",
            "enrollment_date": "2023-01-02T10:00:00",
            "last_accessed_date": "2023-01-05T15:30:00",
            "progress_percentage": 35.5,
            "is_completed": false,
            "completion_date": null,
            "completed_lessons": [1, 2, 3],
            "completed_quests": [1, 2]
        }
    }
    
    Error Response (404):
    {
        "success": true,
        "enrolled": false,
        "message": "Not enrolled in this course"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    course_id = request.args.get('course_id')
    if not course_id:
        return jsonify({"success": False, "message": "Course ID is required"}), 400
    
    course_id = int(course_id)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if user is enrolled in the course
        cursor.execute('''
            SELECT ue.*, c.title as course_title
            FROM user_enrollments ue
            JOIN courses c ON ue.course_id = c.id
            WHERE ue.user_id = ? AND ue.course_id = ?
        ''', (user_id, course_id))
        enrollment = cursor.fetchone()
        
        if not enrollment:
            return jsonify({
                "success": True,
                "enrolled": False,
                "message": "Not enrolled in this course"
            }), 200
        
        # Get completed lessons
        cursor.execute('''
            SELECT cl.lesson_id
            FROM completed_lessons cl
            JOIN lessons l ON cl.lesson_id = l.id
            WHERE cl.user_id = ? AND l.course_id = ?
            ORDER BY l.order_number
        ''', (user_id, course_id))
        completed_lessons = [row['lesson_id'] for row in cursor.fetchall()]
        
        # Get completed quests
        cursor.execute('''
            SELECT cq.quest_id
            FROM completed_quests cq
            JOIN quests q ON cq.quest_id = q.id
            WHERE cq.user_id = ? AND q.course_id = ?
        ''', (user_id, course_id))
        completed_quests = [row['quest_id'] for row in cursor.fetchall()]
        
        enrollment_data = dict(enrollment)
        enrollment_data['completed_lessons'] = completed_lessons
        enrollment_data['completed_quests'] = completed_quests
        
        return jsonify({
            "success": True,
            "enrolled": True,
            "enrollment": enrollment_data
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch enrollment details: {str(e)}"}), 500
    finally:
        conn.close()

@enrollments.route('/user_progress', methods=['GET'])
@token_required
def get_user_progress():
    """
    Get overall progress statistics for the authenticated user across all enrolled courses.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "user_id": 1,
        "total_courses_enrolled": 5,
        "completed_courses": 2,
        "in_progress_courses": 3,
        "total_lessons_completed": 25,
        "total_quests_completed": 18,
        "total_exp_earned": 1500,
        "total_coins_earned": 750,
        "average_progress": 65.5
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get count of total enrolled courses
        cursor.execute('''
            SELECT COUNT(*) as total_enrolled
            FROM user_enrollments
            WHERE user_id = ?
        ''', (user_id,))
        total_enrolled = cursor.fetchone()['total_enrolled']
        
        # Get count of completed courses
        cursor.execute('''
            SELECT COUNT(*) as completed_courses
            FROM user_enrollments
            WHERE user_id = ? AND is_completed = 1
        ''', (user_id,))
        completed_courses = cursor.fetchone()['completed_courses']
        
        # Get count of total completed lessons
        cursor.execute('''
            SELECT COUNT(*) as total_lessons
            FROM completed_lessons
            WHERE user_id = ?
        ''', (user_id,))
        total_lessons_completed = cursor.fetchone()['total_lessons']
        
        # Get count of total completed quests
        cursor.execute('''
            SELECT COUNT(*) as total_quests
            FROM completed_quests
            WHERE user_id = ?
        ''', (user_id,))
        total_quests_completed = cursor.fetchone()['total_quests']
        
        # Get user exp and coins
        cursor.execute('''
            SELECT exp, coins
            FROM users
            WHERE id = ?
        ''', (user_id,))
        user_stats = cursor.fetchone()
        
        # Calculate average progress across all courses
        cursor.execute('''
            SELECT AVG(progress_percentage) as avg_progress
            FROM user_enrollments
            WHERE user_id = ?
        ''', (user_id,))
        avg_progress = cursor.fetchone()['avg_progress'] or 0
        
        return jsonify({
            "success": True,
            "user_id": user_id,
            "total_courses_enrolled": total_enrolled,
            "completed_courses": completed_courses,
            "in_progress_courses": total_enrolled - completed_courses,
            "total_lessons_completed": total_lessons_completed,
            "total_quests_completed": total_quests_completed,
            "total_exp_earned": user_stats['exp'],
            "total_coins_earned": user_stats['coins'],
            "average_progress": avg_progress
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch progress statistics: {str(e)}"}), 500
    finally:
        conn.close()
