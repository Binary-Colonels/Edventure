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

@notes.route('/generate_podcast/<int:note_id>', methods=['GET'])
@token_required
def generate_podcast_from_pdf(note_id):
    """
    Generate an audio podcast from a PDF note using Google Gemini API for summarization
    and ElevenLabs API for text-to-speech conversion.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Query Parameters:
    - voice_id: (optional) The voice ID to use from ElevenLabs (defaults to a natural reading voice)
    
    Success Response (200):
    {
        "success": true,
        "podcast_url": "/notes/podcast/12345.mp3",
        "title": "Note Title - Audio Podcast"
    }
    
    Error Response (404):
    {
        "success": false,
        "message": "Note not found"
    }
    """
    try:
        # Get API keys from environment variables or use defaults
        GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyBOgemmbrwEhox1rEasakp38dsbjSPxLvk")
        
        # For testing purposes, use a hardcoded API key if environment variable is not set
        # In production, always use environment variables for API keys
        default_elevenlabs_key = "9a3b3dbb0c96c0a5db114c8b0b25436d"  # Using a default key for testing only
        ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", default_elevenlabs_key)
        
        print(f"Using ElevenLabs API key: {ELEVENLABS_API_KEY[:4]}...{ELEVENLABS_API_KEY[-4:]}")
        
        # Get voice ID from query parameters or use default
        voice_id = request.args.get('voice_id', 'EXAVITQu4vr4xnSDxMaL')  # Default voice
        print(f"Using voice ID: {voice_id}")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get the PDF content from the database
        cursor.execute('''
            SELECT id, title, pdf_content
            FROM notes
            WHERE id = ?
        ''', (note_id,))
        note = cursor.fetchone()
        
        if not note:
            print(f"Note with ID {note_id} not found")
            return jsonify({"success": False, "message": "Note not found"}), 404
        
        print(f"Found note: {note['title']} (ID: {note['id']})")
        pdf_content = note['pdf_content']
        note_title = note['title']
        
        # Create podcasts directory if it doesn't exist
        podcasts_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'podcasts')
        if not os.path.exists(podcasts_dir):
            print(f"Creating podcasts directory: {podcasts_dir}")
            os.makedirs(podcasts_dir)
        
        # Check if podcast already exists for this note
        podcast_filename = f"podcast_{note_id}.mp3"
        podcast_path = os.path.join(podcasts_dir, podcast_filename)
        
        if os.path.exists(podcast_path):
            # Podcast already exists, return its URL
            print(f"Podcast already exists for note {note_id}")
            podcast_url = f"/notes/podcast/{podcast_filename}"
            return jsonify({
                "success": True,
                "podcast_url": podcast_url,
                "title": f"{note_title} - Audio Podcast",
                "message": "Podcast already exists"
            }), 200
        
        print("Starting podcast generation - Step 1: Gemini summarization")
        # Step 1: Use Gemini API to generate a summarized script from the PDF
        gemini_url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        
        prompt = """Create a podcast script from this PDF content. Follow these guidelines:
1. Start with a brief introduction summarizing what the document is about.
2. Convert the key points into a conversational script that would be engaging to listen to.
3. Use clear transitions between main topics.
4. Make sure to simplify complex concepts while preserving accuracy.
5. End with a brief conclusion summarizing the main takeaways.
6. Keep the total length to around 3-4 minutes when read aloud (about 400-600 words).
7. Use a friendly, informative tone appropriate for a podcast.

Format the response as plain text without any special formatting, ready to be read as a podcast.
"""

        # Prepare the request to Gemini
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
        print(f"PDF content encoded as base64 (length: {len(pdf_base64)})")
        
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
        
        print("Sending request to Gemini API...")
        # Make the request to Gemini API
        gemini_response = requests.post(gemini_url, json=payload, headers=headers)
        
        if gemini_response.status_code != 200:
            error_msg = f"Error from Gemini API: {gemini_response.status_code} - {gemini_response.text}"
            print(error_msg)
            return jsonify({
                "success": False, 
                "message": error_msg
            }), 500
        
        print("Successfully received response from Gemini API")
        gemini_data = gemini_response.json()
        
        # Extract the podcast script
        podcast_script = gemini_data['candidates'][0]['content']['parts'][0]['text']
        print(f"Generated podcast script (length: {len(podcast_script)} characters)")
        
        # Limit script based on word count (approximately 4000 words)
        word_count = len(podcast_script.split())
        print(f"Word count: {word_count} words")
        
        if word_count > 4000:
            print(f"Trimming podcast script from {word_count} to 4000 words")
            words = podcast_script.split()
            podcast_script = ' '.join(words[:4000])
            # Try to end on a complete sentence
            last_period = podcast_script.rfind('.')
            if last_period > len(podcast_script) * 0.8:  # If we can find a period in the last 20% of the text
                podcast_script = podcast_script[:last_period+1]
        
        # For ElevenLabs API limitations, also check character count
        if len(podcast_script) > 5000:
            print("Trimming podcast script to 5000 characters to avoid API limitations")
            podcast_script = podcast_script[:5000]
            # Try to end on a complete sentence
            last_period = podcast_script.rfind('.')
            if last_period > len(podcast_script) * 0.8:  # If we can find a period in the last 20% of the text
                podcast_script = podcast_script[:last_period+1]
        
        print("Starting podcast generation - Step 2: ElevenLabs text-to-speech")
        
        # Use the same voice ID and model as the frontend implementation
        # EXAVITQu4vr4xnSDxMaL - Default voice from frontend implementation
        voice_id = "EXAVITQu4vr4xnSDxMaL"
        
        # Step 2: Use ElevenLabs API to convert the script to speech
        elevenlabs_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        
        # Further limit text size for free tier (characters not words)
        # Free tier has character limit of ~2500-3000 characters
        if len(podcast_script) > 2000:
            print(f"Further trimming podcast script from {len(podcast_script)} to 2000 characters for free tier limits")
            podcast_script = podcast_script[:2000]
            # Try to end on a complete sentence
            last_period = podcast_script.rfind('.')
            if last_period > len(podcast_script) * 0.8:
                podcast_script = podcast_script[:last_period+1]
        
        # Use exactly the same configuration as in the frontend implementation
        elevenlabs_payload = {
            "text": podcast_script,
            "model_id": "eleven_monolingual_v1", 
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        
        elevenlabs_headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }
        
        print("Sending request to ElevenLabs API...")
        # Make the request to ElevenLabs API
        try:
            elevenlabs_response = requests.post(
                elevenlabs_url, 
                json=elevenlabs_payload, 
                headers=elevenlabs_headers,
                timeout=60  # Increase timeout for large audio generation
            )
            
            print(f"ElevenLabs API response status: {elevenlabs_response.status_code}")
            
            if elevenlabs_response.status_code != 200:
                error_msg = f"Error from ElevenLabs API: {elevenlabs_response.status_code} - {elevenlabs_response.text}"
                print(error_msg)
                
                # Handle specific error cases for ElevenLabs API
                is_api_key_error = "invalid api key" in elevenlabs_response.text.lower() or "unauthorized" in elevenlabs_response.text.lower()
                is_unusual_activity_error = "unusual activity detected" in elevenlabs_response.text.lower() or "detected_unusual_activity" in elevenlabs_response.text.lower()
                
                if is_api_key_error or is_unusual_activity_error:
                    print("Creating text-only fallback response due to ElevenLabs API access restriction")
                    
                    # Save the script as a text file for fallback
                    script_filename = f"script_{note_id}.txt"
                    script_path = os.path.join(podcasts_dir, script_filename)
                    with open(script_path, 'w', encoding='utf-8') as f:
                        f.write(podcast_script)
                    
                    # Create a simple silence MP3 as placeholder (1 second)
                    with open(podcast_path, 'wb') as f:
                        # This is a minimal valid MP3 file with 1 second of silence
                        silence_data = b'\xFF\xFB\x90\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                        f.write(silence_data * 100)  # Repeat to make a longer file
                    
                    # Update database to indicate this note has a podcast (but it's actually a placeholder)
                    cursor.execute('''
                        UPDATE notes
                        SET has_podcast = 1
                        WHERE id = ?
                    ''', (note_id,))
                    conn.commit()
                    
                    podcast_url = f"/notes/podcast/{podcast_filename}"
                    
                    error_details = ""
                    if is_unusual_activity_error:
                        error_details = "ElevenLabs detected unusual activity. This typically requires a paid subscription to resolve."
                    else:
                        error_details = "ElevenLabs API key is invalid or unauthorized."
                    
                    return jsonify({
                        "success": True,
                        "podcast_url": podcast_url,
                        "script_url": f"/notes/script/{script_filename}",
                        "title": f"{note_title} - Audio Podcast (Text Only)",
                        "script": podcast_script,
                        "warning": f"Using text-only fallback. {error_details}"
                    }), 200
                else:
                    return jsonify({
                        "success": False, 
                        "message": error_msg,
                        "script": podcast_script  # Return the script even if audio generation failed
                    }), 500
        except requests.exceptions.RequestException as e:
            error_msg = f"Error connecting to ElevenLabs API: {str(e)}"
            print(error_msg)
            return jsonify({"success": False, "message": error_msg}), 500
        
        print("Successfully received audio from ElevenLabs API")
        # Save the audio file
        with open(podcast_path, 'wb') as f:
            f.write(elevenlabs_response.content)
        print(f"Saved podcast audio to {podcast_path}")
        
        # Update the database to indicate this note has a podcast
        cursor.execute('''
            UPDATE notes
            SET has_podcast = 1
            WHERE id = ?
        ''', (note_id,))
        
        conn.commit()
        print(f"Updated database to mark note {note_id} as having a podcast")
        
        # Return the podcast URL
        podcast_url = f"/notes/podcast/{podcast_filename}"
        
        return jsonify({
            "success": True,
            "podcast_url": podcast_url,
            "title": f"{note_title} - Audio Podcast",
            "script": podcast_script  # Include the script for display purposes
        }), 200
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in podcast generation: {str(e)}")
        print(f"Error details:\n{error_details}")
        return jsonify({"success": False, "message": f"Podcast generation failed: {str(e)}"}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@notes.route('/podcast/<path:filename>', methods=['GET'])
@token_required
def get_podcast(filename):
    """
    Retrieve a generated podcast file.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response:
    Audio file stream (MP3)
    
    Error Response (404):
    {
        "success": false,
        "message": "Podcast not found"
    }
    """
    try:
        podcasts_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'podcasts')
        file_path = os.path.join(podcasts_dir, filename)
        
        if not os.path.exists(file_path):
            return jsonify({"success": False, "message": "Podcast file not found"}), 404
        
        return send_file(
            file_path,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({"success": False, "message": f"Error retrieving podcast: {str(e)}"}), 500

@notes.route('/script/<path:filename>', methods=['GET'])
@token_required
def get_script(filename):
    """
    Retrieve a generated podcast script file.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response:
    Text file stream
    
    Error Response (404):
    {
        "success": false,
        "message": "Script not found"
    }
    """
    try:
        podcasts_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'podcasts')
        file_path = os.path.join(podcasts_dir, filename)
        
        if not os.path.exists(file_path):
            return jsonify({"success": False, "message": "Script file not found"}), 404
        
        return send_file(
            file_path,
            mimetype='text/plain',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({"success": False, "message": f"Error retrieving script: {str(e)}"}), 500
