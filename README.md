# ARIA AI Agents ⚡

<p align="center">
  <img src="docs/images/ARIA_AI_Agents_Logo.png" alt="ARIA AI Agents Logo" width="400">
</p>

Welcome to **ARIA AI Agents** – a Python-based system for managing AI agents, their interactions, and associated connectors. This project is designed to streamline the setup of multi-agent workflows and help developers easily integrate different language models, connectors, and prompt-chaining strategies.

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
git clone https://github.com/aria-ai/aria_ai_agents.git

# 2. Move into the project directory
cd aria_ai_agents

# 3. Create a virtual environment (conda example)
conda create --name aria_ai_agents python=3.11
conda activate aria_ai_agents

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run the main script
cd aria_ai_agents
python main.py
```

This will launch the **main** application, which initializes your agents, connectors, and any configured prompt-chaining logic.

---

## Installation

1. **Clone** the repository:
   ```bash
   git clone https://github.com/aria-ai/aria_ai_agents.git
   ```
2. **Navigate** to the project folder:
   ```bash
   cd aria_ai_agents
   ```
3. **Create** a virtual environment (e.g., using `conda`):
   ```bash
   conda create --name aria_ai_agents python=3.11
   conda activate aria_ai_agents
   ```
4. **Install** dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. **Run** the main script:
   ```bash
   cd aria_ai_agents
   python main.py
   ```

---

## Usage

You can programmatically work with the **ARIA AI Agents** from within your own Python scripts. For example:

```python
from aria_ai_agents.models.openai_model import OpenAIModel
from aria_ai_agents.connectors.discord_connector import DiscordConnector
from aria_ai_agents.prompt_chaining.chain_manager import ChainManager

# 1. Initialize an AI model
model = OpenAIModel(api_key="YOUR_OPENAI_KEY")

# 2. (Optional) Initialize a connector
discord_conn = DiscordConnector(
    bot_token="YOUR_DISCORD_BOT_TOKEN",
    channel_id="DISCORD_CHANNEL_ID"
)

# 3. Work with prompts or chain managers
chain_manager = ChainManager(config_path="configs/chains.yaml")
response = chain_manager.run_chain("my_chain_identifier", input_data="Hello AI Agents!")
print(response)
```

Depending on your project design, you might:
- Create or load multiple agents.
- Manage different connectors (Discord, Slack, Telegram, etc.).
- Use a prompt-chaining manager to orchestrate complex LLM calls.

---

## Project Structure

Here’s how your folders and files are organized inside `aria_ai_agents/`. The main entry point is **`main.py`**, and each folder handles a different piece of functionality:

```bash
aria_ai_agents/
├─ __pycache__/          # Compiled Python files (ignore in version control)
├─ auth/                 # Authentication or credential management
├─ configs/              # YAML/JSON config files for agents, prompt-chaining, etc.
├─ connectors/           # Modules to connect with external services (Discord, Slack, etc.)
├─ models/               # Model interfaces (OpenAI, Anthropic, etc.)
├─ prompt_chaining/      # Logic and utilities for chaining prompts together
├─ prompts/              # Collections of prompt templates or specialized strings
├─ templates/            # Potential HTML/Jinja templates for a dashboard or web interface
├─ utils/                # Utility/helper functions shared across modules
├─ __init__.py           # Makes `aria_ai_agents` a Python package
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
| **Models**          | Unified interface for various large language models (OpenAI, Anthropic, etc.).              |
| **Auth**            | Handles storage or retrieval of API credentials and tokens.                                 |
| **Prompt Chaining** | Logic for composing and chaining prompts in complex sequences.                              |
| **Prompts**         | Reusable yaml prompt files for LLM queries that are used to create non repeitive content.   |
| **Configs**         | Generated YAML configurations for agents from prompt chaining flows. Used by PostManager   |
| **Templates**       | Reusable text prompts or templates for LLM queries.                                         |

---

## Environment Variables

Many components require environment variables. For example, your OpenAI API key, Discord bot token, or other service credentials. A typical `.env` file could look like:

```bash
OPENAI_API_KEY=sk-123abc...
DISCORD_BOT_TOKEN=MzQ2OT...
ANTHROPIC_API_KEY=anth-xyz
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
> We hope this framework accelerates your AI-driven projects. If you have questions, feel free to [open an issue](https://github.com/aria-ai/aria_ai_agents/issues) or start a discussion.

*Made with ❤️ by the ARIA AI Agents Devs.*