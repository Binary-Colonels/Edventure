from flask import Blueprint, Flask, jsonify, make_response
from .users import user_management
from .areas_of_interest import areas_of_interest
from .courses import courses
from .enrollments import enrollments
from .lessons import lessons
from .questions import questions
from .quests import quests
from .notes import notes

from flask_cors import CORS
from itsdangerous import URLSafeTimedSerializer


def create_app():
    app = Flask(__name__)

    SECRET_KEY = 'SUPER_SECRET_KEY'
    app.secret_key = SECRET_KEY  # Required for flashing messages
    app.config['SECRET_KEY'] = SECRET_KEY

    # Apply CORS to the app with the specific origin
    CORS(app, resources={r"/*": {"origins": ["*"], "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})


    # Serializer setup
    s = URLSafeTimedSerializer(SECRET_KEY)

    # Handle preflight requests globally (this can be customized per route)
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    # Register the blueprints
    app.register_blueprint(user_management, url_prefix='/users')
    app.register_blueprint(areas_of_interest, url_prefix='/areas_of_interest')
    app.register_blueprint(courses, url_prefix='/courses')
    app.register_blueprint(enrollments, url_prefix='/enrollments')
    app.register_blueprint(lessons, url_prefix='/lessons')
    app.register_blueprint(questions, url_prefix='/questions')
    app.register_blueprint(quests, url_prefix='/quests')
    app.register_blueprint(notes, url_prefix='/notes')
    


    return app

