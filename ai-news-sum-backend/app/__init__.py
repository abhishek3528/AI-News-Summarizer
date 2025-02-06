from flask import Flask
from flask_cors import CORS
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    # Initialize services
    from app.services.summarizer import init_summarizer
    init_summarizer()

    # Register blueprints
    from app.routes import main
    CORS(main)
    app.register_blueprint(main)

    return app 