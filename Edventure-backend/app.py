from functools import wraps
import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, session, send_file
from apis import create_app
from flask_cors import CORS
from itsdangerous import URLSafeTimedSerializer
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
SECRET_KEY = os.getenv('SECRET_KEY', 'SUPER_SECRET_KEY')
app.secret_key = SECRET_KEY
app.config['SECRET_KEY'] = SECRET_KEY
CORS(app, resources={r"/*": {"origins": "*"}})
s = URLSafeTimedSerializer(SECRET_KEY)

# The create_app function handles blueprint registration

@app.route('/')
@app.route('/home')
def index():
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def api_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        filename = file.filename
        file.save(os.path.join('uploads', filename))
        return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 200

# Error handler for 404 - Not Found
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 404,
        'message': 'Resource not found'
    }), 404

# Error handler for 400 - Bad Request
@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        'success': False,
        'error': 400,
        'message': 'Bad request'
    }), 400

# Error handler for 500 - Internal Server Error
@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({
        'success': False,
        'error': 500,
        'message': 'Internal server error'
    }), 500

app = create_app()
if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'False').lower() == 'true') 