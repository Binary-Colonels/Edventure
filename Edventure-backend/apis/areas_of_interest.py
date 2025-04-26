from flask import Blueprint, jsonify
from utils import get_db_connection

areas_of_interest = Blueprint('areas_of_interest', __name__)

@areas_of_interest.route('/get_all_aoi', methods=['GET'])
def get_all_interests():
    """
    Fetch all available areas of interest.
    
    Success Response (200):
    {
        "success": true,
        "interests": [
            {
                "id": 1,
                "name": "AIML",
                "description": "Artificial Intelligence and Machine Learning"
            },
            {
                "id": 2,
                "name": "Blockchain",
                "description": "Blockchain Technology"
            },
            // ... more interests
        ]
    }
    
    Error Response (500):
    {
        "success": false,
        "message": "Failed to fetch interests: <error details>"
    }
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Fetch all interest tags
        cursor.execute('''
            SELECT id, name, description
            FROM interest_tags
            ORDER BY name ASC
        ''')
        interests = cursor.fetchall()

        return jsonify({
            "success": True,
            "interests": [dict(interest) for interest in interests]
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to fetch interests: {str(e)}"
        }), 500
    finally:
        conn.close()
