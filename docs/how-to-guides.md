# How-To Guide: Setting up ARIA AI, Google Gemini, and Twitter

This guide walks you through the essential steps for installing **ARIA AI Agents** in a conda environment, configuring the Google Gemini API key, and authenticating a Twitter account for agent interactions.

---

## Table of Contents

1. [Set Up a Conda Environment](#1-set-up-a-conda-environment)  
2. [Install ARIA AI Agents](#2-install-aria-ai-agents)  
3. [Obtain a Google Gemini API Key](#3-obtain-a-google-gemini-api-key)  
4. [Get a Twitter API Key](#4-get-a-twitter-api-key)  
5. [Authenticate Your Twitter Account](#5-authenticate-your-twitter-account)  

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
     conda create --name aria_ai_agents python=3.11
     ```
   - Activate your new environment:
     ```bash
     conda activate aria_ai_agents
     ```

You now have an isolated environment ready for ARIA AI Agents.

---

## 2. Install ARIA AI Agents

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/aria-ai/aria_ai_agents.git
   ```
2. **Navigate to the Project Directory**  
   ```bash
   cd aria_ai_agents
   ```
3. **Install Dependencies**  
   Within your `aria_ai_agents` folder, install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the Main Script**  
   ```bash
   python main.py
   ```
   This starts the primary ARIA AI Agents application, which includes agent configurations, connectors, and any prompt-chaining logic.

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
5. **Set the Environment Variable** (or place it in your `.env`):
   ```bash
   export GEMINI_API_KEY="AIzaSyD..."
   ```
   > **Tip**: Place the key in your `.env` file at the root of the project:
   > ```bash
   > GOOGLE_GEMINI_API_KEY=AIzaSyD...
   > ```

---

## 4. Get a Twitter API Key

To allow ARIA AI Agents to interact with Twitter, you need developer credentials.

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

ARIA AI Agents includes modules or scripts (e.g., `twitter_app_auth.py`) to handle Twitter OAuth or token-based authentication. Below is a typical approach:

1. **Locate the Auth File**  
   - In `aria_ai_agents/auth/twitter_app_auth.py` (or a similar file in the `auth/` folder):
     ```python
     # Example snippet
     import os
     
     TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
     TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET")
     TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
     
     # Additional OAuth logic, if needed
     ```
2. **Set Your Credentials**  
   - Store your credentials in a `.env` file or environment variables. The code snippet above automatically pulls from your environment.
3. **Run the App**  
   - When you run `python main.py`, the application will attempt to initialize the `TwitterConnector` (if configured), using your environment variables.
4. **Test Connectivity**  
   - Use the connector or a test script to verify you can post or retrieve tweets.  
   - Example:
     ```python
     from aria_ai_agents.connectors.twitter_connector import TwitterConnector
     
     connector = TwitterConnector(
         api_key=TWITTER_API_KEY,
         api_secret=TWITTER_API_SECRET,
         bearer_token=TWITTER_BEARER_TOKEN
     )
     connector.test_connection()
     ```

5. **Twitter access tokens**
   - You will need to get the access tokens for the account you want to post to twitter.
   - The twitter_app_auth.py file has a function to get the access tokens for the account you want to post to twitter.
   - Save your access tokens in the .env file at the root of the project.
   - Example:

   ```python
   TWITTER_ACCESS_TOKEN=
   TWITTER_ACCESS_TOKEN_SECRET=
   ```

6. **Enable Twitter Live Mode**  

   - Set `twitter_live = True` in the `main.py` file so you can post to twitter live.   

   ```bash
   twitter_live = True
   ```
Once successfully authenticated, your ARIA agents can interact with Twitter—posting tweets, reading mentions, or replying to DMs, depending on your configuration.

## 6. Debug Mode

   By default the posting to twitter is disabled. You do not have to authenticate your twitter account to see the tweets in the log file for your agent in the config folder/agent_folder/agentName_post_log.yaml. This is by design so that people can test the ai without the need to setup twitter api right away. Doing a a trial run before posting to twitter live is a good idea and helps see any issues that the ai might have overlooked.

---

## Next Steps

- **Using ARIA with Other Models**: Check out the [API Reference Documentation](api/main.md) for integrating additional LLMs like OpenAI or Anthropic.
- **Setting Up Additional Connectors**: See our [How-To Guides](how-to-guides.md) for adding Discord, Slack, or Telegram connectors.
- **Managing Prompts & Templates**: Explore the [Prompt Reference](yaml/prompts/prompt_chaining.md) for advanced usage of prompt chaining and template customization.

---

### Troubleshooting

- **Conda Environment Not Found**: Ensure you spelled the environment name correctly or re-run `conda activate aria_ai_agents`.
- **Credential Errors**: Double-check environment variables are set in your `.env` or system variables. Make sure you restart the shell if you updated `.env`.
- **Authentication Failures**: Validate your **Google** or **Twitter** keys/tokens in their respective developer dashboards.

---

**That’s it!** You’ve now set up your environment, installed ARIA AI Agents, obtained the necessary API keys, and authenticated your Twitter account. If you run into any issues, feel free to open an [Issue](https://github.com/aria-ai/aria_ai_agents/issues) or check the project’s [FAQ](./faq.md) (if available).

*Happy building with ARIA AI Agents!*