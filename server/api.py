from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
import glob
from pprint import pprint

load_dotenv()

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20 MB

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
    print(f"[create_agent] - Received data: {data}")

    # Extract character name from the agent_details
    character_name = data.get('agent_details', {}).get('name')
    if not character_name:
        return jsonify({"error": "Character name is required"}), 400

    # Create a directory for the character
    character_dir = os.path.join('configs', character_name)
    os.makedirs(character_dir, exist_ok=True)

    # Generate filename
    base_filename = f"{character_name}_master"
    filename = base_filename + ".json"
    counter = 1

    # Check for duplicates and increment if necessary
    while os.path.exists(os.path.normpath(os.path.join(character_dir, filename))):
        filename = f"{base_filename}_{counter}.json"
        counter += 1

    # Create the new character structure based on the incoming data structure
    new_character_data = {
        "agent": {
            "agent_details": {
                "name": character_name,
                "personality": data.get('agent_details', {}).get('personality', []),
                "communication_style": data.get('agent_details', {}).get('communication_style', []),
                "backstory": data.get('agent_details', {}).get('backstory', ''),
                "universe": data.get('agent_details', {}).get('universe', ''),
                "topic_expertise": data.get('agent_details', {}).get('topic_expertise', []),
                "hashtags": data.get('agent_details', {}).get('hashtags', []),
                "emojis": data.get('agent_details', {}).get('emojis', []),
                "concept": data.get('agent_details', {}).get('concept', '')
            },
            "ai_model": {
                "model_type": "",
                "model_name": "",
                "memory_store": ""
            },
            "connectors": {
                "twitter": False,
                "telegram": False,
                "discord": False
            },
            "profile_image": data.get('profile_image', []),
            "profile_image_options": data.get('profile_image_options', []),
            "tracker": {
                "current_season_number": 0,
                "current_episode_number": 0,
                "current_post_number": 0,
                "post_every_x_minutes": 0
            },
            "seasons": data.get('seasons', [])
        },
        "concept": data.get('agent_details', {}).get('concept', '')
    }

    # Write data to the new JSON file within the character's directory
    with open(os.path.join(character_dir, filename), 'w', encoding='utf-8') as f:
        json.dump(new_character_data, f, ensure_ascii=False, indent=4)

    return jsonify(new_character_data), 201




@app.route('/api/characters', methods=['GET'])
def get_characters():
    try:
        # Use os.path.join for cross-platform path handling
        config_dir = 'configs'
        pattern = os.path.join(config_dir, '**', '*master*.json')
        # Use os.path.normpath to normalize path separators
        files = [os.path.normpath(f) for f in glob.glob(pattern, recursive=True)]
        print(f"[get_characters] - Found {len(files)} files: {files}")

        if not files:
            print("[get_characters] - No files found in configs directory or subdirectories")
            return jsonify({"error": "No character files found"}), 404

        characters = []
        for file in files:
            try:
                with open(file, 'r', encoding='utf-8') as f:
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