from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
import glob

# Import modules from your existing codebase (if needed)
# Example:
# from .connectors.twitter_connector import TwitterConnector
# from .models import get_agent_config

load_dotenv()

app = Flask(__name__)

print("API Connection Starting...")

# Configure CORS to allow requests from multiple origins
cors = CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:3000"]}})

# Example data (you'll integrate with your agent logic later)
agents = []

# --- API Endpoints ---
# Route to GET Agent data from the client side 
@app.route('/api/agents', methods=['GET'])
def get_agents():
    # Here, you might fetch agent data using your existing modules
    # Example:
    # agent_configs = get_agent_config()
    # agents = [process_agent_data(config) for config in agent_configs]
    return jsonify(agents)

# Route to POST data to the client side 
@app.route('/api/agents', methods=['POST'])
def create_agent():
    data = request.get_json()

    # Basic validation
    required_fields = ['name', 'personality', 'communication_style', 'backstory', 'universe', 'topic_expertise', 'hashtags', 'emojis']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Add a unique ID (you'll likely use a database to generate IDs in a real app)
    data['id'] = len(agents) + 1
    data['level'] = 1
    data['experience'] = 0
    data['selectedImage'] = 0

    agents.append(data)
    return jsonify(data), 201

# Route to GET all characters from the configs folder
@app.route('/api/characters', methods=['GET'])
def get_characters():
    # Fetch all JSON files in the configs folder with 'master' in the name
    files = glob.glob('configs/*master*.json')
    print("The found files are ", files)
    characters = []

    for file in files:
        with open(file, 'r') as f:
            characters.append(json.load(f))

    return jsonify(characters)

# --- Other potential endpoints ---
# - /api/agents/<id> (GET, PUT, DELETE)
# - /api/agents/<id>/posts (GET, POST)
# - /api/connectors/twitter/auth (POST)
# - ...

if __name__ == '__main__':
    app.run(debug=True, port=5000) 