"""
API Server Module

This module implements the Flask REST API server that handles agent creation,
chat interactions, content generation and other core functionality.

Key Features:
- Agent creation and management 
- Chat interactions with agents
- Season and episode content generation
- Chat history tracking
"""

from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
import glob
from pprint import pprint
from prompt_chaining.step_1_create_agent import create_agent as generateAgent
from models.gemini_model import GeminiModel
from prompt_chaining.step_5_agent_chat import agent_chat
from prompt_chaining.step_2_create_content import create_seasons_and_episodes
from prompt_chaining.step_3_create_posts import create_episode_posts
from utils.post_manager import PostManager
from utils.scheduler import AgentScheduler
from models.openai_model import OpenAIModel

# Load environment variables
load_dotenv()

#Global Post Manager - Will be instantiated when a user logs in to Twitter
global post_manager_twitter

# Initialize Flask app with 20MB max content size
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20 MB

# Configure CORS for frontend origin
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:5173"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type"]
}})

# Create global AI model instance
try:
    ai_model = OpenAIModel()
    print(f"OpenAIModel created successfully: {ai_model}")
except Exception as e:
    print(f"Error creating OpenAIModel: {str(e)}")
    print("Using GeminiModel instead")
    ai_model = GeminiModel()

# Post reques to create a random agent with no prompt
@app.route('/api/agents/random', methods=['POST'])
def create_random_agent():
    """
    Creates a new random agent with optional concept.
    
    Request Body:
        concept (str, optional): Initial concept for the agent
        
    Returns:
        JSON: Generated agent data
        int: HTTP status code
    """
    # Get concept from request body if provided
    data = request.get_json() if request.is_json else {}
    concept = data.get('concept', '')  # Default to empty string if no concept provided
    
    print("[create_random_agent] - Creating a random agent", f"concept: {concept}" if concept else "")
    
    # Remove the local instantiation and use global ai_model
    print("Using global Gemini Model instance", ai_model)
    
    # Create RandomAgents directory if it doesn't exist
    random_agents_dir = os.path.join('configs', 'RandomAgents')
    os.makedirs(random_agents_dir, exist_ok=True)
    
    # Call the generateAgent function with the concept
    generated_master_file_path = generateAgent(ai_model, concept)
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
    """
    Handles CORS preflight requests by adding required headers.
    
    Returns:
        Response: Flask response with CORS headers
    """
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add("Access-Control-Allow-Methods", "*")
        return response

# Your existing routes...
@app.route('/api/agents', methods=['GET'])
def get_agents():
    """
    Retrieves list of all agents.
    
    Returns:
        JSON: List of agent data
    """
    return jsonify(agents)

@app.route('/api/agents/', methods=['POST'])
def create_agent():
    """
    Creates a new agent from provided configuration. If an agent with the same name exists,
    it will be replaced.
    
    Request Body:
        agent_details (dict): Agent configuration including name, personality, etc.
        concept (str): Initial concept for the agent
        
    Returns:
        JSON: Created agent data
        int: HTTP status code
    """
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

    # Generate filename - always use _master.json
    filename = f"{character_name}_master.json"
    file_path = os.path.normpath(os.path.join(character_dir, filename))

    # Create the new character structure based on the incoming data structure
    new_character_data = {
        "agent": {
            "agent_details": {
                "name": character_name.replace('_', ' '),
                "personality": data.get('agent_details', {}).get('personality', []),
                "communication_style": data.get('agent_details', {}).get('communication_style', []),
                "backstory": data.get('agent_details', {}).get('backstory', ''),
                "universe": data.get('agent_details', {}).get('universe', ''),
                "topic_expertise": data.get('agent_details', {}).get('topic_expertise', []),
                "hashtags": data.get('agent_details', {}).get('hashtags', []),
                "emojis": data.get('agent_details', {}).get('emojis', [])            },
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
            "concept": data.get('concept', ''),
            "profile_image": data.get('profile_image', []),
            "profile_image_options": data.get('profile_image_options', []),
            "tracker": {
                "current_season_number": 0,
                "current_episode_number": 0,
                "current_post_number": 0,
                "post_every_x_minutes": 0
            },
            "seasons": data.get('seasons', [])
        }
    }

    # Write data to the JSON file, overwriting if it exists
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(new_character_data, f, ensure_ascii=False, indent=4)

    return jsonify(new_character_data), 201

@app.route('/api/characters', methods=['GET'])
def get_characters():
    """
    Retrieves all character configurations from the configs directory.
    
    Returns:
        JSON: List of character configurations
        int: HTTP status code
    """
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

@app.route('/api/agents/chat', methods=['POST'])
def chat_with_agent():
    """
    Handles chat interactions with an agent.
    
    Request Body:
        prompt (str): User message to the agent
        master_file_path (str): Path to agent's master configuration file
        chat_history (dict): Previous chat history
        
    Returns:
        JSON: Agent response and updated chat history
        int: HTTP status code
    """
    data = request.get_json()
    prompt = data.get('prompt')

    master_file_path = data.get('master_file_path')
    print(f"[chat_with_agent] - master_file_path: {master_file_path}")
    print("\n\n\n")
    
    chat_history = data.get('chat_history', {'chat_history': []})
    
    
    if not master_file_path:
        return jsonify({"error": "Master file path is required"}), 400
    
    if not os.path.exists(master_file_path):
        return jsonify({"error": "Agent master file not found"}), 404
        
    try:
        # Initialize AI model
        ai_model = GeminiModel()
        
        # Call the agent_chat function from step_5
        agent_response, updated_chat_history = agent_chat(
            ai_model=ai_model,
            master_file_path=master_file_path,
            prompt=prompt,
            chat_history=chat_history
        )
        
        return jsonify({
            "response": agent_response,
            "chat_history": updated_chat_history
        })
    except Exception as e:
        print(f"Error in chat_with_agent: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/agents/chat-history', methods=['GET'])
def get_chat_history():
    """
    Retrieves chat history for a specific agent.
    
    Query Parameters:
        master_file_path (str): Path to agent's master configuration file
        
    Returns:
        JSON: Agent's chat history
        int: HTTP status code
    """
    master_file_path = request.args.get('master_file_path')
    print(f"[get_chat_history] - master_file_path: {master_file_path}")
    if not master_file_path:
        return jsonify({"error": "Master file path is required"}), 400
    
    # Extract agent name from master file path
    agent_name = os.path.basename(master_file_path).replace('_master.json', '')
    
    # Create the chat history file path using the same format as in step_5_agent_chat.py
    chat_file_path = os.path.join(os.path.dirname(master_file_path), f"{agent_name}_chat_log.json")
    print(f"[get_chat_history] - chat_file_path: {chat_file_path}")
    print("\n\n\n")
    # If chat history doesn't exist, return empty history with agent name
    if not os.path.exists(chat_file_path):
        return jsonify({
            "agent_name": agent_name,
            "chat_history": []
        })
    
    # Load and return the chat history
    with open(chat_file_path, 'r', encoding='utf-8') as file:
        chat_history = json.load(file)
    
    return jsonify(chat_history)

@app.route('/api/agents/seasons', methods=['POST'])
def create_season():
    """
    Generates a new season of content for an agent.
    
    Request Body:
        master_file_path (str): Path to agent's master configuration file
        number_of_episodes (int): Number of episodes to generate
        
    Returns:
        JSON: Updated agent data with new season
        int: HTTP status code
    """
    try:
        data = request.get_json()
        master_file_path = data.get('master_file_path')
        number_of_episodes = data.get('number_of_episodes', 3)  # Default to 3 episodes

        if not master_file_path:
            return jsonify({"error": "Master file path is required"}), 400

        # Create a new season using the global AI model
        result = create_seasons_and_episodes(
            ai_model=ai_model,
            master_file_path=master_file_path,
            number_of_episodes=number_of_episodes
        )

        # Load and return the updated agent data
        with open(master_file_path, 'r', encoding='utf-8') as f:
            updated_agent = json.load(f)
            
        return jsonify(updated_agent), 200

    except Exception as e:
        print(f"Error creating season: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/agents/episodes/posts', methods=['POST'])
def create_episode_content():
    """
    Generates posts for an agent's episodes.
    
    Request Body:
        master_file_path (str): Path to agent's master configuration file
        number_of_posts (int): Number of posts to generate per episode
        
    Returns:
        JSON: Updated agent data with new posts
        int: HTTP status code
    """
    try:
        data = request.get_json()
        master_file_path = data.get('master_file_path')
        number_of_posts = data.get('number_of_posts')  # Default to 6 posts

        if not master_file_path:
            return jsonify({"error": "Master file path is required"}), 400

        # Create posts for the episodes using the global AI model
        result = create_episode_posts(
            ai_model=ai_model,
            master_file_path=master_file_path,
            number_of_posts=number_of_posts
        )

        # Load and return the updated agent data
        with open(master_file_path, 'r', encoding='utf-8') as f:
            updated_agent = json.load(f)
            
        return jsonify(updated_agent), 200

    except Exception as e:
        print(f"Error creating episode posts: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Twitter Posting 
# Twitter Posting 
@app.route('/api/start-post-manager/twitter', methods=['POST'])
def start_post_manager_twitter():
    global post_manager_twitter

    data = request.json
    agent_name = data.get('agent_name')
    
    print("\n")
    if not agent_name:
        print("[start_post_manager_twitter] - Agent name is required")
        return jsonify({'error': 'Agent name is required'}), 400

    try:
        # Create PostManager instance with the agent name
        post_manager_twitter = PostManager(agent_name=agent_name)
        print(f"[start_post_manager_twitter] - post_manager created: {post_manager_twitter}")

        # Check if the PostManager is logged in
        if post_manager_twitter and post_manager_twitter.is_logged_in:
            return jsonify({'success': True, 'message': f'Post manager started for {agent_name}'}), 200
        else:
            return jsonify({'error': 'Failed to start post manager or login to Twitter'}), 500
            
    except Exception as e:
        print(f"[start_post_manager] - Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/post-to-twitter', methods=['POST'])
def post_to_twitter():
    global post_manager_twitter
    
    try:
        data = request.json
        master_data = data.get('master_data')
        post_content = data.get('content')
        
        if not master_data or not post_content:
            return jsonify({'error': 'Master data or post content is required'}), 400

        if post_manager_twitter:
            post_success = post_manager_twitter.post_single_tweet(post_content)
            if post_success:
                return jsonify({'success': True}), 200
            else:
                return jsonify({'error': 'Failed to post to Twitter'}), 500
        else:
            return jsonify({'error': 'Post manager not initialized'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/agents/update-seasons', methods=['PUT'])
def update_seasons():
    """
    Updates the seasons array for a specific agent using the agent's name.
    
    Request Body:
        agent_name (str): Name of the agent
        seasons (list): New seasons data to update
        
    Returns:
        JSON: Updated agent data
        int: HTTP status code
    """
    try:
        data = request.get_json()
        agent_name = data.get('agent_name')
        new_seasons = data.get('seasons')

        if not agent_name or not new_seasons:
            return jsonify({"error": "Agent name and seasons data are required"}), 400

        # Construct the master file path using the agent's name
        master_file_path = os.path.join('configs', agent_name, f"{agent_name}_master.json")

        if not os.path.exists(master_file_path):
            return jsonify({"error": "Agent master file not found"}), 404

        # Load the existing agent data
        with open(master_file_path, 'r', encoding='utf-8') as f:
            agent_data = json.load(f)

        # Update the seasons array
        agent_data['agent']['seasons'] = new_seasons

        # Save the updated agent data back to the file
        with open(master_file_path, 'w', encoding='utf-8') as f:
            json.dump(agent_data, f, ensure_ascii=False, indent=4)

        return jsonify(agent_data), 200

    except Exception as e:
        print(f"Error updating seasons: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/agents/seasons', methods=['DELETE'])
def delete_season():
    """
    Deletes a specific season and all its posts for an agent.
    
    Request Body:
        master_file_path (str): Path to agent's master configuration file
        season_number (int): The season number to delete
        
    Returns:
        JSON: Updated agent data
        int: HTTP status code
    """
    try:
        data = request.get_json()
        master_file_path = data.get('master_file_path')
        season_number = data.get('season_number')

        if not master_file_path or season_number is None:
            return jsonify({"error": "Master file path and season number are required"}), 400

        if not os.path.exists(master_file_path):
            return jsonify({"error": "Agent master file not found"}), 404

        # Load the existing agent data
        with open(master_file_path, 'r', encoding='utf-8') as f:
            agent_data = json.load(f)

        # Filter out the season to delete
        agent_data['agent']['seasons'] = [
            season for season in agent_data['agent']['seasons']
            if season['season_number'] != season_number
        ]

        # Save the updated agent data back to the file
        with open(master_file_path, 'w', encoding='utf-8') as f:
            json.dump(agent_data, f, ensure_ascii=False, indent=4)

        return jsonify(agent_data), 200

    except Exception as e:
        print(f"Error deleting season: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/agents/update-backstory', methods=['PUT'])
def update_backstory():
    """
    Updates the backstory for a specific agent.
    
    Request Body:
        master_file_path (str): Path to agent's master configuration file
        backstory (str): New backstory to update
        
    Returns:
        JSON: Updated agent data
        int: HTTP status code
    """
    try:
        data = request.get_json()
        master_file_path = data.get('master_file_path')
        new_backstory = data.get('backstory')

        print(f"Received request to update backstory. Master file path: {master_file_path}, New backstory: {new_backstory}") # Log the request data

        if not master_file_path or new_backstory is None:
            print("Error: Master file path and backstory are required") # Log missing data
            return jsonify({"error": "Master file path and backstory are required"}), 400

        if not os.path.exists(master_file_path):
            print("Error: Agent master file not found") # Log file not found
            return jsonify({"error": "Agent master file not found"}), 404

        # Load the existing agent data
        with open(master_file_path, 'r', encoding='utf-8') as f:
            agent_data = json.load(f)

        # Update the backstory
        agent_data['agent']['agent_details']['backstory'] = new_backstory

        # Save the updated agent data back to the file
        with open(master_file_path, 'w', encoding='utf-8') as f:
            json.dump(agent_data, f, ensure_ascii=False, indent=4)

        print("Backstory updated successfully") # Log success
        return jsonify(agent_data), 200

    except Exception as e:
        print(f"Error updating backstory: {str(e)}") # Log any exceptions
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("API Server starting on port 8080...")
    app.run(debug=True, host='0.0.0.0', port=8080)  # Correct
    # INCORRECT: app.run(debug=True, port=8080)  # Defaults to 127.0.0.1