from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
import glob
from pprint import pprint
from prompt_chaining.step_1_json import step_1 as generateAgent
from models.gemini_model import GeminiModel


load_dotenv()

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20 MB

# Configure CORS for your frontend origin
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:5173"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type"]
}})

# Create a single global instance of GeminiModel
ai_model = GeminiModel()

# Post reques to create a random agent with no prompt
@app.route('/api/agents/random', methods=['POST'])
def create_random_agent():
    # Remove the local instantiation and use global ai_model
    print("Using global Gemini Model instance", ai_model)
    print("[create_random_agent] - Creating a random agent")
    
    # Create RandomAgents directory if it doesn't exist
    random_agents_dir = os.path.join('configs', 'RandomAgents')
    os.makedirs(random_agents_dir, exist_ok=True)
    
    # Call the generateAgent function with no prompt to create a random agent
    generated_master_file_path = generateAgent(ai_model, "")
    print(f"[create_random_agent] - generatedMasterFilePath for generatedAgent: {generated_master_file_path}")

    try:
        if not generated_master_file_path:
            return jsonify({"error": "No file path generated"}), 500

        # Get just the filename without path and extension
        base_filename = os.path.basename(generated_master_file_path)
        name_without_ext = os.path.splitext(base_filename)[0]
        
        # Replace _master with _random in the filename
        name_without_ext = name_without_ext.replace('_master', '_random')
        
        # Generate unique filename in the RandomAgents directory
        counter = 1
        final_path = os.path.join(random_agents_dir, f"{name_without_ext}.json")
        while os.path.exists(final_path):
            filename = f"{name_without_ext}_{counter}.json"
            final_path = os.path.join(random_agents_dir, filename)
            counter += 1

        # Move the generated file to the RandomAgents directory
        if os.path.exists(generated_master_file_path):
            os.rename(generated_master_file_path, final_path)
            print(f"[create_random_agent] - Moved file to: {final_path}")
            
            # Clean up any empty character directory that might have been created
            char_dir = os.path.dirname(generated_master_file_path)
            if os.path.exists(char_dir) and not os.listdir(char_dir):
                os.rmdir(char_dir)
        
        # Read the JSON data from the file
        with open(final_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"[create_random_agent] - Loaded data from file: {data}")
        
        return jsonify(data), 200

    except Exception as e:
        print(f"[create_random_agent] - Error: {str(e)}")
        return jsonify({"error": "Failed to load agent data"}), 500

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

    # Replace spaces with underscores in the character name
    character_name = character_name.replace(' ', '_')

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