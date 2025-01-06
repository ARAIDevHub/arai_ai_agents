# ARAI AI Agents ⚡

<p align="center">
  <img src="docs/assets/images/ARAI_LOG_BASE_GREY.png" alt="ARAI AI Agents Logo" width="100">
</p>

Welcome to **ARAI AI Agents** – a Python-based system for managing AI agents, their interactions, and associated connectors. This project is designed to streamline the setup of multi-agent workflows and help developers easily integrate different language models, connectors, and prompt-chaining strategies.

> **Highlights**  
> 🚀 **Multiple AI Models**: Connect to OpenAI, Anthropic, or other LLMs.  
> ⚙️ **Modular Architecture**: Plug and play new connectors (Discord, Twitter, Telegram, etc.) with minimal effort.  
> 🔗 **Prompt Chaining**: Build, modify, and chain prompts to accomplish complex tasks.  
> 🧠 **Memory & Templates**: Store persistent context and quickly adapt to different use cases. [WIP]  
> 📊 **CLI**: Monitor and manage agent interactions in real-time.

---

## Table of Contents

1. [Quick Start](#quick-start)  
2. [Installation](#installation)  
3. [Usage](#usage)  
4. [Project Structure](#project-structure)  
5. [Key Concepts](#key-concepts)  
6. [Environment Variables](#environment-variables)  
7. [Contributing](#contributing)  
8. [Code of Conduct](#code-of-conduct)  
9. [License](#license)

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/arai-ai/arai_ai_agents.git

# 2. Move into the project directory
cd arai_ai_agents

# 3. Create a virtual environment (conda example)
conda create --name arai_ai_agents python=3.11
conda activate arai_ai_agents

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run the main script
cd arai_ai_agents
python main.py
```

This will launch the **main** application, which initializes your agents, connectors, and any configured prompt-chaining logic.

---

## Installation

1. **Clone** the repository:
   ```bash
   git clone https://github.com/arai-ai/arai_ai_agents.git
   ```
2. **Navigate** to the project folder:
   ```bash
   cd arai_ai_agents
   ```
3. **Create** a virtual environment (e.g., using `conda`):
   ```bash
   conda create --name arai_ai_agents python=3.11
   conda activate arai_ai_agents
   ```
4. **Install** dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. **Run** the main script:
   ```bash
   cd arai_ai_agents
   python main.py
   ```
6. You should see a welcome prompt similar to:

   ```plaintext
   === Main Menu ===
   Welcome to ARAI Agents.
   Please select an option:

   Current Agent: None

   = Agent Management =
   1. Select an existing Agent
   2. Create a new Agent

   = Media Management =
   3. Create a new Season
   4. Create Season posts

   = Scheduler Management =
   5. Start Scheduler
   6. Check posting status
   7. Force post now
   8. Pause/Resume posting

   = Miscellaneous =
   9. Exit

   Enter your choice (1-9):
   ```

7. See the [CLI Guide](docs/cli-guide.md) for more information on how to use the CLI.

---

## Usage

You can programmatically work with the **ARAI AI Agents** from within your own Python scripts. For example:

```python
from arai_ai_agents.models.gemini_model import GeminiModel
from arai_ai_agents.connectors.twitter_connector import TwitterConnector

# 1. Initialize an AI model
model = GeminiModel()

# 2. Generate a response
response = model.generate_response("What is the weather in San Francisco?")

# 3. Print the response
print(response)

# 4. (Optional) Initialize a connector
twitter_conn = TwitterConnector()

# 5. (Optional) Post the response to Twitter
twitter_conn.post_to_twitter(response)

```

Depending on your project design, you might:
- Create or load multiple agents.
- Manage different connectors (Discord, Slack, Telegram, etc.).
- Use a prompt-chaining manager to orchestrate complex LLM calls.

For Prompt Chaining:
 - Look at the Prompt Chaining folder for python files that implement ARAI unique prompt chaining logic.
 - Step 1: Creates a new agent with a character background..
 - Step 2: Creates the seasons and episodes for the agent, this is how unique content is created.
 - Step 3: Creates the posts based off the agent and season/episode that the agent will post to the connector.

---

## Project Structure

Here’s how your folders and files are organized inside `arai_ai_agents/`. The main entry point is **`main.py`**, and each folder handles a different piece of functionality:

```bash
arai_ai_agents/
├─ __pycache__/          # Compiled Python files (ignore in version control)
├─ auth/                 # Authentication or credential management for connectors
├─ configs/              # GeneratedYAML/JSON config files for agents for posting content to connectors.
├─ connectors/           # Modules to connect with external services (Twitter, Discord, Slack, etc.)
├─ models/               # Model interfaces (Gemini, OpenAI, Anthropic, etc.)
├─ prompt_chaining/      # Logic and utilities for chaining prompts together
├─ prompts/              # Collections of prompt templates for the agents to use.
├─ templates/            # Templates used for the AI to fill in for the based on prompts chaining  .
├─ utils/                # Utility/helper functions shared across modules
├─ __init__.py           # Makes `arai_ai_agents` a Python package
└─ main.py               # Entry point to initialize and run the system
```

> **Tip**: You might place environment variables or secrets in `.env` files (not shown here). This keeps secret keys and tokens out of your codebase.

### Visual Overview

```             
               ┌───────────────────────────┐
               │         Connectors        │
               │(Discord, Slack, etc.)     │
               └──────────────▲────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │   Prompt Chaining                          │
        │ (chains of prompts, dynamic logic)         │
        └─────────────────────▲─────────────────────┘
                              │
  ┌───────────────────────────┼──────────────────────────┐
  │        Models             │          Auth            │
  │(OpenAI, Anthropic, etc.)  │(API keys, credentials)   │
  └───────────────────────────┴──────────────────────────┘
                              │
                              │
                      ┌───────▼────────┐
                      │   main.py       │
                      │ (Entry point)   │
                      └─────────────────┘
```

---

## Key Concepts

| Concept             | Description                                                                                 |
|---------------------|---------------------------------------------------------------------------------------------|
| **Connectors**      | Integrations with external services (Discord, Slack, Telegram, etc.) to provide AI responses. |
| **Models**          | Unified interface for various large language models (OpenAI, Anthropic, Gemini, etc.).      |
| **Auth**            | Handles storage or retrieval of API credentials and tokens.                                 |
| **Prompt Chaining** | Logic for composing and chaining prompts in complex sequences.                              |
| **Prompts**         | Reusable yaml prompt files for LLM queries that are used to create non repeitive content.   |
| **Configs**         | Generated YAML configurations for agents from prompt chaining flows. Used by PostManager   |
| **Templates**       | Reusable text prompts or templates for LLM queries.                                         |

---

## Environment Variables

Many components require environment variables. For example, your Google Gemini API key, Twitter API keys, or other service credentials. A typical `.env` file could look like:

```bash
GOOGLE_GEMINI_API_KEY=...
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_BEARER_TOKEN=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_TOKEN_SECRET=...
```

> **Remember**: Don’t commit your `.env` file to source control if it contains secrets!

---

## Contributing

We ❤️ contributions! If you have suggestions or improvements, please:

1. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) the repository  
2. Create a new branch (`feature/add-new-connector`)  
3. Commit and push your changes  
4. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.  
Check out the [`HOW_TO_CONTRIBUTE`](./HOW_TO_CONTRIBUTE) guide for more details.

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT). By participating, you are expected to uphold this code. Please report any unacceptable behavior to the project team.

---

## License

This project is licensed under the terms of the [MIT License](./LICENSE). Feel free to use, distribute, and modify at your own convenience.

---

> **Happy coding!** 🎉  
> We hope this framework accelerates your AI-driven projects. If you have questions, feel free to [open an issue](https://github.com/arai-ai/arai_ai_agents/issues) or start a discussion.

*Made with ❤️ by the ARAI AI Agents Devs.*