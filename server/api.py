from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
import glob

load_dotenv()

app = Flask(__name__)

# Configure CORS for your frontend origin
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:5173"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type"]
}})

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add("Access-Control-Allow-Methods", "*")
        return response

# Your existing routes...
@app.route('/api/agents', methods=['GET'])
def get_agents():
    return jsonify(agents)

@app.route('/api/agents', methods=['POST'])
def create_agent():
    data = request.get_json()
    required_fields = ['name', 'personality', 'communication_style', 'backstory', 
                      'universe', 'topic_expertise', 'hashtags', 'emojis']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    data['id'] = len(agents) + 1
    data['level'] = 1
    data['experience'] = 0
    data['selectedImage'] = 0

    agents.append(data)
    return jsonify(data), 201

@app.route('/api/characters', methods=['GET'])
def get_characters():
    try:
        # Use ** to match any number of subdirectories
        files = glob.glob('configs/**/*master*.json', recursive=True)
        print(f"[get_characters] - Found {len(files)} files: {files}")

        if not files:
            print("[get_characters] - No files found in configs directory or subdirectories")
            return jsonify({"error": "No character files found"}), 404

        characters = []
        for file in files:
            try:
                with open(file, 'r') as f:
                    characters.append(json.load(f))
            except json.JSONDecodeError as e:
                print(f"[get_characters] - Error parsing JSON from {file}: {str(e)}")
                continue
            except Exception as e:
                print(f"[get_characters] - Error reading file {file}: {str(e)}")
                continue

        return jsonify(characters)

    except Exception as e:
        print(f"[get_characters] - Unexpected error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("API Server starting on port 8080...")
    app.run(debug=True, port=8080)