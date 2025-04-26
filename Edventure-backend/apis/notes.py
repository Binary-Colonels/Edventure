from flask import Blueprint, jsonify, request, send_file
from utils import get_db_connection, token_required
import io
from datetime import datetime
import os
import mimetypes
import base64
import requests
import json

notes = Blueprint('notes', __name__)

@notes.route('/upload', methods=['POST'])
@token_required
def upload_note():
    """
    Upload a new note with PDF content.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format (multipart/form-data):
    - title: Title of the note
    - description: Description of the note (optional)
    - pdf_file: PDF file to upload
    
    Success Response (201):
    {
        "success": true,
        "message": "Note uploaded successfully",
        "note_id": 1,
        "points_earned": 100
    }
    
    Error Response (400):
    {
        "success": false,
        "message": "Missing required fields or invalid PDF"
    }
    """
    print("Upload note endpoint called")
    
    try:
        # Create uploads directory if it doesn't exist
        uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads')
        if not os.path.exists(uploads_dir):
            print(f"Creating uploads directory: {uploads_dir}")
            os.makedirs(uploads_dir)
        
        token_data = request.token_data
        user_id = token_data['user_id']
        print(f"User ID from token: {user_id}")
        
        print("Files in request:", list(request.files.keys()))
        print("Form data in request:", list(request.form.keys()))
        
        if 'pdf_file' not in request.files:
            print("No pdf_file in request.files")
            return jsonify({"success": False, "message": "No PDF file provided"}), 400
            
        pdf_file = request.files['pdf_file']
        print(f"Received file: {pdf_file.filename}, mime type: {pdf_file.content_type}")
        
        if pdf_file.filename == '' or not pdf_file.filename.lower().endswith('.pdf'):
            print(f"Invalid file: {pdf_file.filename}")
            return jsonify({"success": False, "message": "Invalid or no PDF file provided"}), 400
        
        title = request.form.get('title')
        description = request.form.get('description')
        
        print(f"Title: {title}, Description: {description and description[:20]}...")
        
        if not title:
            print("No title provided")
            return jsonify({"success": False, "message": "Title is required"}), 400
        
        pdf_content = pdf_file.read()
        print(f"PDF content size: {len(pdf_content)} bytes")
        
        # Save the file to disk as well (for backup)
        file_path = os.path.join(uploads_dir, f"{title.replace(' ', '_')}_{user_id}.pdf")
        with open(file_path, 'wb') as f:
            pdf_file.seek(0)  # Reset file position after reading
            pdf_file.save(f)
        print(f"File saved to: {file_path}")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Insert the note
            cursor.execute('''
                INSERT INTO notes (user_id, title, description, pdf_content, upvote_count, downvote_count, created_at)
                VALUES (?, ?, ?, ?, 0, 0, datetime('now'))
            ''', (user_id, title, description, pdf_content))
            
            conn.commit()
            note_id = cursor.lastrowid
            print(f"Note inserted successfully with ID: {note_id}")
            
            return jsonify({
                "success": True,
                "message": "Note uploaded successfully",
                "note_id": note_id,
                "points_earned": 100
            }), 201
            
        except Exception as e:
            conn.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"success": False, "message": f"Upload failed: {str(e)}"}), 500
        finally:
            conn.close()
    except Exception as e:
        print(f"Unexpected error in upload_note: {str(e)}")
        return jsonify({"success": False, "message": f"Server error: {str(e)}"}), 500

@notes.route('/user/<int:user_id>', methods=['GET'])
@token_required
def get_user_notes(user_id):
    """
    Get all notes uploaded by a specific user.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "total_count": 2,
        "notes": [
            {
                "id": 1,
                "title": "Note Title",
                "description": "Note Description",
                "upvote_count": 5,
                "downvote_count": 1,
                "created_at": "2024-03-20T10:00:00"
            },
            ...
        ]
    }
    """
    token_data = request.token_data
    
    # Check if user is requesting their own notes or if admin is requesting
    if token_data['user_id'] != user_id and token_data['role'] != 'admin':
        return jsonify({"success": False, "message": "Unauthorized access"}), 403
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT id, title, description, upvote_count, downvote_count, created_at
            FROM notes
            WHERE user_id = ?
            ORDER BY created_at DESC
        ''', (user_id,))
        notes = cursor.fetchall()
        
        return jsonify({
            "success": True,
            "total_count": len(notes),
            "notes": [dict(note) for note in notes]
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch notes: {str(e)}"}), 500
    finally:
        conn.close()

@notes.route('/all', methods=['GET'])
@token_required
def get_all_notes():
    """
    Get all notes with their basic information.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "total_count": 2,
        "notes": [
            {
                "id": 1,
                "user_id": 1,
                "username": "johndoe",
                "title": "Note Title",
                "description": "Note Description",
                "upvote_count": 5,
                "downvote_count": 1,
                "created_at": "2024-03-20T10:00:00"
            },
            ...
        ]
    }
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT n.id, n.user_id, u.username, n.title, n.description, 
                   n.upvote_count, n.downvote_count, n.created_at
            FROM notes n
            JOIN users u ON n.user_id = u.id
            ORDER BY n.created_at DESC
        ''')
        notes = cursor.fetchall()
        
        return jsonify({
            "success": True,
            "total_count": len(notes),
            "notes": [dict(note) for note in notes]
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch notes: {str(e)}"}), 500
    finally:
        conn.close()

@notes.route('/download/<int:note_id>', methods=['GET'])
@token_required
def download_note(note_id):
    """
    Download a specific note's PDF content.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response:
    PDF file download
    
    Error Response (404):
    {
        "success": false,
        "message": "Note not found"
    }
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT title, pdf_content
            FROM notes
            WHERE id = ?
        ''', (note_id,))
        note = cursor.fetchone()
        
        if not note:
            return jsonify({"success": False, "message": "Note not found"}), 404
        
        return send_file(
            io.BytesIO(note['pdf_content']),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"{note['title']}.pdf"
        )
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Download failed: {str(e)}"}), 500
    finally:
        conn.close()

@notes.route('/<int:note_id>', methods=['DELETE'])
@token_required
def delete_note(note_id):
    """
    Delete a specific note.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "message": "Note deleted successfully"
    }
    
    Error Response (403):
    {
        "success": false,
        "message": "Unauthorized to delete this note"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if user owns the note or is admin
        cursor.execute('SELECT user_id FROM notes WHERE id = ?', (note_id,))
        note = cursor.fetchone()
        
        if not note:
            return jsonify({"success": False, "message": "Note not found"}), 404
            
        if note['user_id'] != user_id and token_data['role'] != 'admin':
            return jsonify({"success": False, "message": "Unauthorized to delete this note"}), 403
        
        cursor.execute('DELETE FROM notes WHERE id = ?', (note_id,))
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Note deleted successfully"
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Delete failed: {str(e)}"}), 500
    finally:
        conn.close()

@notes.route('/<int:note_id>/vote', methods=['POST'])
@token_required
def vote_note(note_id):
    """
    Upvote or downvote a note.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format:
    {
        "vote_type": "up" or "down"
    }
    
    Success Response (200):
    {
        "success": true,
        "message": "Vote recorded successfully",
        "upvote_count": 6,
        "downvote_count": 1
    }
    
    Error Response (400):
    {
        "success": false,
        "message": "Invalid vote type"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    vote_type = request.json.get('vote_type')
    if vote_type not in ['up', 'down']:
        return jsonify({"success": False, "message": "Invalid vote type"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if note exists
        cursor.execute('SELECT * FROM notes WHERE id = ?', (note_id,))
        note = cursor.fetchone()
        
        if not note:
            return jsonify({"success": False, "message": "Note not found"}), 404
        
        # Update vote count
        if vote_type == 'up':
            cursor.execute('''
                UPDATE notes
                SET upvote_count = upvote_count + 1
                WHERE id = ?
            ''', (note_id,))
        else:
            cursor.execute('''
                UPDATE notes
                SET downvote_count = downvote_count + 1
                WHERE id = ?
            ''', (note_id,))
        
        # Get updated vote counts
        cursor.execute('''
            SELECT upvote_count, downvote_count
            FROM notes
            WHERE id = ?
        ''', (note_id,))
        updated_note = cursor.fetchone()
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Vote recorded successfully",
            "upvote_count": updated_note['upvote_count'],
            "downvote_count": updated_note['downvote_count']
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Voting failed: {str(e)}"}), 500
    finally:
        conn.close()

@notes.route('/generate_quiz/<int:note_id>', methods=['GET'])
@token_required
def generate_quiz_from_pdf(note_id):
    """
    Generate a quiz from a PDF note using Google Gemini API.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "quiz": {
            "questions": [
                {
                    "question": "What is the capital of France?",
                    "options": ["Paris", "London", "Berlin", "Madrid"],
                    "correctAnswer": "Paris",
                    "explanation": "Paris is the capital and largest city of France."
                },
                ...
            ]
        }
    }
    
    Error Response (404):
    {
        "success": false,
        "message": "Note not found"
    }
    """
    try:
        API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyBOgemmbrwEhox1rEasakp38dsbjSPxLvk")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get the PDF content from the database
        cursor.execute('''
            SELECT title, pdf_content
            FROM notes
            WHERE id = ?
        ''', (note_id,))
        note = cursor.fetchone()
        
        if not note:
            return jsonify({"success": False, "message": "Note not found"}), 404
        
        pdf_content = note['pdf_content']
        
        # Prepare the request to Gemini API
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key={API_KEY}"
        
        prompt = """Convert this PDF into a quiz JSON format: 10 MCQs with answers.
Return the result in the following JSON structure:

{
  "questions": [
    {
      "question": "What is the capital of France?",
      "options": ["Paris", "London", "Berlin", "Madrid"],
      "correctAnswer": "Paris",
      "explanation": "Paris is the capital and largest city of France."
    },
    {
      "question": "Which gas do plants absorb from the atmosphere?",
      "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      "correctAnswer": "Carbon Dioxide",
      "explanation": "Plants absorb carbon dioxide for photosynthesis."
    }
  ]
}

Important: Ensure all questions are directly related to the content of the PDF. 
Make sure each question has exactly 4 options, and the correct answer is one of these options.
Return only valid JSON with properly formatted text. Do not include any explanatory text outside the JSON structure.
"""

        # Prepare the request
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
        
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": prompt},
                        {
                            "inlineData": {
                                "mimeType": "application/pdf",
                                "data": pdf_base64
                            }
                        }
                    ]
                }
            ]
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        # Make the request to Gemini API
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code != 200:
            return jsonify({"success": False, "message": f"Error from Gemini API: {response.text}"}), 500
        
        response_data = response.json()
        
        # Extract the text response
        text_response = response_data['candidates'][0]['content']['parts'][0]['text']
        
        # Try to parse the JSON response
        try:
            # Find the JSON part in the response (in case there's any additional text)
            json_start = text_response.find('{')
            json_end = text_response.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                json_string = text_response[json_start:json_end]
                quiz_data = json.loads(json_string)
            else:
                quiz_data = json.loads(text_response)
                
            # Update the note record to include the quiz
            cursor.execute('''
                UPDATE notes
                SET has_quiz = 1
                WHERE id = ?
            ''', (note_id,))
            conn.commit()
            
            return jsonify({
                "success": True,
                "quiz": quiz_data
            }), 200
            
        except json.JSONDecodeError as e:
            return jsonify({
                "success": False,
                "message": f"Failed to parse quiz from Gemini response: {str(e)}",
                "raw_response": text_response
            }), 500
            
    except Exception as e:
        return jsonify({"success": False, "message": f"Quiz generation failed: {str(e)}"}), 500
    finally:
        conn.close()
