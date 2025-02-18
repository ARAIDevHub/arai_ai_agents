# ARAI AI Agents Deployment Instructions

## Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/ChadJeetington/arai_ai_agents_cookie_deFAI_Hackathon.git
cd arai_ai_agents_cookie_deFAI_Hackathon
```

## Setting Up the Python Server

1. **Create a Python Virtual Environment:**

   Using `conda`:
   ```bash
   conda create --name arai_ai_agents python=3.11
   conda activate arai_ai_agents
   ```

   Or using `venv`:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. **Install Python Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**

   Copy the `.env.example` file to `.env` and update it with your API keys and configurations:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file to include your specific API keys:

   ```plaintext
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   ```


4. **Choose the AI Model:**

   > ⚠️ **Note:** **We have added a Google Gemini API key to the .env.example file for the hackathon and set the model to Gemini.**

   If you would like to use a different model, please see below. 

   In `server_python/main.py`, select the AI model you want to use by uncommenting the appropriate line:

   ````python:server_python/main.py
   # Initialize the AI model and scheduler
   ai_model = GeminiModel(model_name="gemini-1.5-flash-latest")
   # ai_model = OpenAIModel()
   # ai_model = ClaudeModel()
   # ai_model = DeepSeekModel()
   ````

   Similarly, in `server_python/api.py`, ensure the correct model is initialized:

   ````python:server_python/api.py
   try:
       ai_model = OpenAIModel()
       print(f"OpenAIModel created successfully: {ai_model}")
   except Exception as e:
       print(f"Error creating OpenAIModel: {str(e)}")
       print("Using GeminiModel instead")
       ai_model = GeminiModel()
   ````

5. **Run the Python Server:**

   Navigate to the server directory and start the server:

   ```bash
   cd server_python
   python api.py
   ```

   The server should start on port 8080 by default.

## Setting Up the Node.js Server

1. **Navigate to the Node.js Server Directory:**

   ```bash
   cd server_node
   ```

2. **Install Node.js Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Node.js Server:**

   ```bash
   npm run dev
   ```

   The server should start on port 3001 by default.

## Setting Up the Client Frontend

1. **Navigate to the Client Directory:**

   ```bash
   cd client
   ```

2. **Install Client Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Client Frontend:**

   ```bash
   npm run dev 
   ```

   The client should be accessible at `http://localhost:3000`.


## You should have three servers running when complete

<div style="text-align: center;">
    <img src="./ui_images//servers_running.png" width="300"/>
</div>
    Make sure your python server has the conda or venv activated.

## Troubleshooting

- Ensure all dependencies are installed correctly.
- Check that the correct versions of Node.js and Python are being used.
- Verify that all environment variables are set correctly in the `.env` file.

## Conclusion

Following these steps should allow you to successfully deploy and run the ARAI AI Agents project. If you encounter any issues, please refer to the project's documentation or open an issue on the GitHub repository.

