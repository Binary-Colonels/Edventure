#!/usr/bin/env python3
import os
import sys
import secrets
import argparse

"""
Script to create or update the .env file with required environment variables
"""

def create_env_file(custom_values=None):
    if custom_values is None:
        custom_values = {}
    
    # Default values
    env_vars = {
        "GEMINI_API_KEY": custom_values.get("GEMINI_API_KEY", "AIzaSyBOgemmbrwEhox1rEasakp38dsbjSPxLvk"),
        # Using a placeholder that clearly indicates a real key is needed
        # The current key format (9a3b3d...) was causing 401 errors
        "ELEVENLABS_API_KEY": custom_values.get("ELEVENLABS_API_KEY", "YOUR_ELEVENLABS_API_KEY_HERE"),
        "FLASK_DEBUG": custom_values.get("FLASK_DEBUG", "True"),
        "SECRET_KEY": custom_values.get("SECRET_KEY", secrets.token_hex(16)),
        "DATABASE_PATH": custom_values.get("DATABASE_PATH", "database.db")
    }
    
    # Create or overwrite .env file
    with open(".env", "w") as f:
        f.write("# API Keys\n")
        f.write(f"GEMINI_API_KEY={env_vars['GEMINI_API_KEY']}\n")
        f.write(f"ELEVENLABS_API_KEY={env_vars['ELEVENLABS_API_KEY']}\n\n")
        
        f.write("# Application Settings\n")
        f.write(f"FLASK_DEBUG={env_vars['FLASK_DEBUG']}\n")
        f.write(f"SECRET_KEY={env_vars['SECRET_KEY']}\n\n")
        
        f.write("# Database Settings\n")
        f.write(f"DATABASE_PATH={env_vars['DATABASE_PATH']}\n")
    
    print(f".env file created at {os.path.abspath('.env')}")
    print("\nEnvironment variables set up:")
    for key, value in env_vars.items():
        if key == "SECRET_KEY":
            # Don't print the full SECRET_KEY
            print(f"  {key}={value[:6]}..." if value else f"  {key}=<not set>")
        else:
            print(f"  {key}={value}" if value else f"  {key}=<not set>")
    
    print("\nNote: In a production environment, replace the API keys with your own:")
    print("  - Gemini API key: https://ai.google.dev/")
    print("  - ElevenLabs API key: https://elevenlabs.io/")
    print("\nIMPORTANT: The ElevenLabs demo key has been replaced with a placeholder.")
    print("You must obtain a valid API key from https://elevenlabs.io/")
    print("(The previous key was causing 401 Unauthorized errors)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create or update the .env file with required environment variables")
    parser.add_argument("--gemini-key", dest="GEMINI_API_KEY", help="Custom Gemini API key")
    parser.add_argument("--elevenlabs-key", dest="ELEVENLABS_API_KEY", help="Custom ElevenLabs API key")
    parser.add_argument("--database", dest="DATABASE_PATH", help="Custom database path")
    parser.add_argument("--debug", dest="FLASK_DEBUG", choices=["True", "False"], help="Flask debug mode")
    
    args = parser.parse_args()
    
    # Convert args to dict, filtering out None values
    custom_values = {k: v for k, v in vars(args).items() if v is not None}
    
    create_env_file(custom_values)
    print("\nTo apply these changes, restart your Flask application.") 