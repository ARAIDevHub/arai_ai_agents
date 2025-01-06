# How-To Guide: Setting up ARAI AI, Google Gemini, and Twitter

This guide walks you through the essential steps for installing **ARAI AI Agents** in a conda environment, configuring the Google Gemini API key, and authenticating a Twitter account for agent interactions. We also detail how environment variables are managed via a `.env` file using `python-dotenv`.

---

## Table of Contents

1. [Set Up a Conda Environment](#1-set-up-a-conda-environment)  
2. [Install ARAI AI Agents](#2-install-arai-ai-agents)  
3. [Obtain a Google Gemini API Key](#3-obtain-a-google-gemini-api-key)  
4. [Get a Twitter API Key](#4-get-a-twitter-api-key)  
5. [Authenticate Your Twitter Account](#5-authenticate-your-twitter-account)  
6. [Debug Mode](#6-debug-mode)  
7. [Processing Speed & Wait Times](#7-processing-speed--wait-times)  
8. [Next Steps](#8-next-steps)  
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Set Up a Conda Environment

Conda environments keep dependencies isolated and help avoid conflicts with other projects on your system.

1. **Install or Update Conda**  
   - Download and install [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or [Anaconda](https://www.anaconda.com/) if you haven’t already.
   - Ensure your conda is up to date:
     ```bash
     conda update conda
     ```

2. **Create a New Environment**  
   - In your terminal or Anaconda Prompt, run:
     ```bash
     conda create --name arai_ai_agents python=3.11
     ```
   - Activate your new environment:
     ```bash
     conda activate arai_ai_agents
     ```

You now have an isolated environment ready for ARAI AI Agents.

---

## 2. Install ARAI AI Agents

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/arai-ai/arai_ai_agents.git
   ```
2. **Navigate to the Project Directory**  
   ```bash
   cd arai_ai_agents
   ```
3. **Install Dependencies**  
   Within your `arai_ai_agents` folder, install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the Main Script**  
   ```bash
   python main.py
   ```
   This starts the primary ARAI AI Agents application, which includes agent configurations, connectors, and any prompt-chaining logic.

---

## 3. Obtain a Google Gemini API Key

*(Note: The steps below are illustrative. Refer to Google’s official documentation for the most up-to-date instructions.)*

1. **Sign Up or Log In**  
   - Go to [Google Cloud Console](https://console.cloud.google.com/).

2. **Create a New Project** (if needed)  
   - Click **Select a project** → **New Project**. Give it a name, then create it.

3. **Enable the Gemini API**  
   - Navigate to **APIs & Services** → **Library**.
   - Search for **Gemini API** (or equivalent) and enable it.

4. **Create Credentials**  
   - Under **APIs & Services** → **Credentials**, click **+ CREATE CREDENTIALS** → **API key**.
   - Copy the **API key** (e.g., `AIzaSyD...`).

5. **Set the Environment Variable**  
   - Either place it in your system environment:
     ```bash
     export GEMINI_API_KEY="AIzaSyD..."
     ```
   - **Or** place the key in your `.env` file at the root of the project:
     ```bash
     GOOGLE_GEMINI_API_KEY=AIzaSyD...
     ```

*(ARAI uses `python-dotenv` to automatically load variables from `.env` if configured.)*

---

## 4. Get a Twitter API Key

To allow ARAI AI Agents to interact with Twitter, you need developer credentials.

1. **Apply for a Twitter Developer Account**  
   - Go to the [Twitter Developer Portal](https://developer.twitter.com/) and apply for a Developer account.

2. **Create a Project & App**  
   - Once approved, create a **Project**, then create an **App** within that project.

3. **Generate Keys & Tokens**  
   - Under **Keys and tokens**, generate an **API Key**, **API Secret Key**, and **Bearer Token** (or OAuth 2.0 Client if required).
   - Copy these values somewhere secure.

Example `.env` variables:

```bash
TWITTER_API_KEY=xxxxxxxxxxxxxxxxxxx
TWITTER_API_SECRET=yyyyyyyyyyyyyyyyyyyyyyyyy
TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAAA
```

---

## 5. Authenticate Your Twitter Account

ARAI AI Agents includes modules or scripts (e.g., `twitter_app_auth.py`) to handle Twitter OAuth or token-based authentication. Below is a typical approach:

1. **Load Environment Variables**  
   Make sure you have `python-dotenv` installed and your `.env` file in the project root. For example:
   ```python
   from dotenv import load_dotenv
   load_dotenv()  # This will load your .env variables
   ```

2. **Locate the Auth File**  
   - In `arai_ai_agents/auth/twitter_app_auth.py` (or a similar file):
     ```python
     import os
     from dotenv import load_dotenv

     load_dotenv()  # ensures environment variables are loaded

     TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
     TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET")
     TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")

     # Additional OAuth logic, if needed
     ```

3. **Set Your Credentials**  
   - Store your credentials in a `.env` file or environment variables. The code snippet above automatically pulls from your environment.

4. **Run the App**  
   - When you run `python main.py`, the application will attempt to initialize the `TwitterConnector` (if configured), using your environment variables.

5. **Test Connectivity**  
   - Use the connector or a test script to verify you can post or retrieve tweets.  
   - Example:
     ```python
     from arai_ai_agents.connectors.twitter_connector import TwitterConnector
     import os

     connector = TwitterConnector(
         api_key=os.getenv("TWITTER_API_KEY"),
         api_secret=os.getenv("TWITTER_API_SECRET"),
         bearer_token=os.getenv("TWITTER_BEARER_TOKEN")
     )
     connector.test_connection()
     ```

6. **Twitter Access Tokens**  
   - To post on behalf of a user, you will need *access tokens* for the specific Twitter account.
   - The `twitter_app_auth.py` file may contain a function to fetch or handle these tokens.
   - Save your access tokens in the `.env` file:
     ```bash
     TWITTER_ACCESS_TOKEN=XXXXXXXX
     TWITTER_ACCESS_TOKEN_SECRET=YYYYYYYY
     ```

7. **Enable Twitter Live Mode**  
   - Set `twitter_live = True` in the `main.py` file so you can post to Twitter live:
     ```python
     twitter_live = True
     ```
   - Once successfully authenticated, your ARAI agents can interact with Twitter—posting tweets, reading mentions, or replying to DMs, depending on your configuration.

---

## 6. Debug Mode

By default, posting to Twitter is **disabled** so you can see generated tweets in log files without actually publishing. This is by design so that you can test AI output before using real APIs:

- **Log-Only Mode**  
  The system logs tweets to a `yaml` file, typically located at `configs/agent_folder/agentName_post_log.yaml`.  
- **Trial Run**  
  Check this file to verify the AI is generating appropriate, non-repetitive content.  
- **Switch to Live**  
  Once you’re satisfied, enable `twitter_live = True` to start posting live.

---

## 7. Processing Speed & Wait Times

Depending on your prompt complexity, **ARAI AI** may take a few minutes to generate a response—especially if the agent is creating **long-form or multiple pieces** of content. The system is waiting for the LLM (e.g., Google Gemini) to process and return a detailed answer.

- **CLI Feedback**  
  Keep an eye on your command-line interface (CLI). You’ll see logging messages that indicate whether the agent is still running or if an error occurs.  
- **Batch Generation**  
  If you’re generating content in batches (e.g., multiple tweets or entire episodes), expect longer wait times as the AI compiles all required context.  
- **Crash Handling**  
  If the CLI exits unexpectedly or logs an error, it’s likely that the model or process has crashed. You can check the logs for details and rerun once you’ve addressed the issue.

*Reminder*: The more context (characters, episodes, story arcs) we include, the more time the model may need to process your request.

---

## 8. Next Steps

- **Using ARAI with Other Models**: Check out the [API Reference Documentation](api/main.md) for integrating additional LLMs like OpenAI or Anthropic.
- **Setting Up Additional Connectors**: See our [How-To Guides](how-to-guides.md) for adding Discord, Slack, or Telegram connectors.
- **Managing Prompts & Templates**: Explore the [Prompt Reference](yaml/prompts/prompt_chaining.md) for advanced usage of prompt chaining and template customization.

---

## 9. Troubleshooting

- **Conda Environment Not Found**  
  Ensure you spelled the environment name correctly or re-run `conda activate arai_ai_agents`.

- **Credential Errors**  
  Double-check environment variables are set in your `.env` or system variables. Make sure you restart the shell if you updated `.env`.

- **Authentication Failures**  
  Validate your **Google** or **Twitter** keys/tokens in their respective developer dashboards.

If you run into any issues, feel free to open an [Issue](https://github.com/arai-ai/arai_ai_agents/issues).

---

**That’s it!** You’ve now set up your environment, installed ARAI AI Agents, obtained the necessary API keys, and authenticated your Twitter account. Remember that **complex or large-scale AI tasks** may take a bit longer to generate responses, so don’t worry if you see some delay—it’s just the model crafting detailed content.  

**Happy building with ARAI AI Agents!**