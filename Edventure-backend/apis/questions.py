from flask import Blueprint, jsonify, request
from utils import get_db_connection, token_required

questions = Blueprint('questions', __name__)

@questions.route('/create_question', methods=['POST'])
@token_required
def create_question():
    """
    Create a new question for a quest.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format:
    {
        "quest_id": 1,
        "question_text": "Which statement correctly creates a variable in Python?",
        "option_1": "var x = 10;",
        "option_2": "x = 10",
        "option_3": "int x = 10;",
        "option_4": "set x = 10;",
        "correct_option": 2
    }
    
    Success Response (201):
    {
        "success": true,
        "message": "Question created successfully",
        "question_id": 1
    }
    
    Error Response (500):
    {
        "success": false,
        "message": "Question creation failed: <error details>"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    # Get question data from request
    data = request.get_json()
    quest_id = data.get('quest_id')
    question_text = data.get('question_text')
    option_1 = data.get('option_1')
    option_2 = data.get('option_2')
    option_3 = data.get('option_3')
    option_4 = data.get('option_4')
    correct_option = data.get('correct_option')
    
    # Validate required fields
    if not all([quest_id, question_text, option_1, option_2, option_3, option_4, correct_option]):
        return jsonify({"success": False, "message": "All fields are required"}), 400
    
    # Validate correct_option range
    if not 1 <= correct_option <= 4:
        return jsonify({"success": False, "message": "Correct option must be between 1 and 4"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get quest details to verify it exists and verify user authorization
        cursor.execute('''
            SELECT q.*, c.creator_id
            FROM quests q
            JOIN lessons l ON q.lesson_id = l.id
            JOIN courses c ON l.course_id = c.id
            WHERE q.id = ?
        ''', (quest_id,))
        quest = cursor.fetchone()
        
        if not quest:
            return jsonify({"success": False, "message": "Quest not found"}), 404
        
        # Only allow course creator or admin to add questions
        if quest['creator_id'] != user_id and token_data['role'] != 'admin':
            return jsonify({"success": False, "message": "Unauthorized to add questions to this quest"}), 403
        
        # Insert question
        cursor.execute('''
            INSERT INTO quest_questions (
                quest_id, question_text, option_1, option_2,
                option_3, option_4, correct_option
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            quest_id, question_text, option_1, option_2,
            option_3, option_4, correct_option
        ))
        
        question_id = cursor.lastrowid
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Question created successfully",
            "question_id": question_id
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Question creation failed: {str(e)}"}), 500
    finally:
        conn.close()

@questions.route('/quest_questions/<int:quest_id>', methods=['GET'])
def get_quest_questions(quest_id):
    """
    Get all questions for a specific quest.
    
    Success Response (200):
    {
        "success": true,
        "quest_title": "Variables Quiz",
        "total_count": 5,
        "questions": [
            {
                "id": 1,
                "question_text": "Which statement correctly creates a variable in Python?",
                "option_1": "var x = 10;",
                "option_2": "x = 10",
                "option_3": "int x = 10;",
                "option_4": "set x = 10;"
            },
            ...
        ]
    }
    
    Note: The correct options are intentionally omitted from the response
    to prevent cheating. They are only included when specifically needed
    for administrative purposes.
    
    Error Response (404):
    {
        "success": false,
        "message": "Quest not found"
    }
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Verify the quest exists
        cursor.execute('SELECT title FROM quests WHERE id = ?', (quest_id,))
        quest = cursor.fetchone()
        
        if not quest:
            return jsonify({"success": False, "message": "Quest not found"}), 404
        
        # Get all questions for the quest
        cursor.execute('''
            SELECT id, question_text, option_1, option_2, option_3, option_4
            FROM quest_questions
            WHERE quest_id = ?
            ORDER BY id
        ''', (quest_id,))
        questions = cursor.fetchall()
        
        return jsonify({
            "success": True,
            "quest_title": quest['title'],
            "total_count": len(questions),
            "questions": [dict(question) for question in questions]
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch questions: {str(e)}"}), 500
    finally:
        conn.close()

@questions.route('/get_quest/<int:quest_id>', methods=['GET'])
@token_required
def get_quest_questions_with_answers(quest_id):
    """
    Get all questions with correct answers for a specific quest.
    Only accessible to the course creator or admin.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "quest_title": "Variables Quiz",
        "total_count": 5,
        "questions": [
            {
                "id": 1,
                "question_text": "Which statement correctly creates a variable in Python?",
                "option_1": "var x = 10;",
                "option_2": "x = 10",
                "option_3": "int x = 10;",
                "option_4": "set x = 10;",
                "correct_option": 2
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
        # Get quest details to verify it exists and verify user authorization
        cursor.execute('''
            SELECT q.*, c.creator_id, q.title
            FROM quests q
            JOIN lessons l ON q.lesson_id = l.id
            JOIN courses c ON l.course_id = c.id
            WHERE q.id = ?
        ''', (quest_id,))
        quest = cursor.fetchone()
        
        if not quest:
            return jsonify({"success": False, "message": "Quest not found"}), 404
        
        # Only allow course creator or admin to see answers
        if quest['creator_id'] != user_id and role != 'admin':
            return jsonify({"success": False, "message": "Unauthorized access"}), 403
        
        # Get all questions with answers for the quest
        cursor.execute('''
            SELECT *
            FROM quest_questions
            WHERE quest_id = ?
            ORDER BY id
        ''', (quest_id,))
        questions = cursor.fetchall()
        
        return jsonify({
            "success": True,
            "quest_title": quest['title'],
            "total_count": len(questions),
            "questions": [dict(question) for question in questions]
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch questions: {str(e)}"}), 500
    finally:
        conn.close()

@questions.route('/submit_quest', methods=['POST'])
@token_required
def check_answers():
    """
    Check the answers submitted by the user for a quest.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format:
    {
        "quest_id": 1,
        "answers": [
            {"question_id": 1, "selected_option": 2},
            {"question_id": 2, "selected_option": 1},
            ...
        ]
    }
    
    Success Response (200):
    {
        "success": true,
        "total_questions": 5,
        "correct_answers": 4,
        "percentage": 80.0,
        "passed": true,
        "results": [
            {"question_id": 1, "correct": true},
            {"question_id": 2, "correct": false},
            ...
        ]
    }
    
    Error Response (404):
    {
        "success": false,
        "message": "Quest not found"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    data = request.get_json()
    quest_id = data.get('quest_id')
    answers = data.get('answers', [])
    
    if not quest_id or not answers:
        return jsonify({"success": False, "message": "Quest ID and answers are required"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if quest exists
        cursor.execute('SELECT * FROM quests WHERE id = ?', (quest_id,))
        quest = cursor.fetchone()
        
        if not quest:
            return jsonify({"success": False, "message": "Quest not found"}), 404
        
        # Process each answer
        results = []
        correct_count = 0
        
        for answer in answers:
            question_id = answer.get('question_id')
            selected_option = answer.get('selected_option')
            
            # Get the correct answer
            cursor.execute('''
                SELECT correct_option FROM quest_questions
                WHERE id = ? AND quest_id = ?
            ''', (question_id, quest_id))
            question = cursor.fetchone()
            
            if not question:
                continue
            
            is_correct = question['correct_option'] == selected_option
            if is_correct:
                correct_count += 1
            
            results.append({
                "question_id": question_id,
                "correct": is_correct
            })
        
        total_questions = len(results)
        percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0
        passed = percentage >= 70  # Consider passing score as 70%
        
        # If the user passed, check if we need to mark the quest as completed
        if passed:
            # Check if quest already completed
            cursor.execute('''
                SELECT * FROM completed_quests
                WHERE user_id = ? AND quest_id = ?
            ''', (user_id, quest_id))
            
            if not cursor.fetchone():
                # Calculate time taken (assuming passed in the request or use a default)
                time_taken = data.get('time_taken_seconds', 0)
                
                # Mark quest as completed
                cursor.execute('''
                    INSERT INTO completed_quests (user_id, quest_id, time_taken_seconds)
                    VALUES (?, ?, ?)
                ''', (user_id, quest_id, time_taken))
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "total_questions": total_questions,
            "correct_answers": correct_count,
            "percentage": percentage,
            "passed": passed,
            "results": results
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Failed to check answers: {str(e)}"}), 500
    finally:
        conn.close()
