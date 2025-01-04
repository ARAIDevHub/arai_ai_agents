# AI Agent Manager
A Python-based system for managing AI agents and their interactions.
## Installation

```bash
git clone https://github.com/aria-ai/aria_ai_agents.git
conda create --name aria_ai_agents python=3.11
conda activate aria_ai_agents
pip install -r requirements.txt
cd aria_ai_agents
python main.py
```

## Usage
```python
from agents.agent_manager import AgentManager
manager = AgentManager("configs")
response = manager.send_message("AgentName", "Your message here")
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Project Structure

project/
└─ src/
   ├─ agents/
   │  ├─ agent.py            # Agent class with load/save methods
   │  ├─ agent_manager.py    # Loads multiple agents, routes messages
   │  └─ ...
   ├─ models/
   │  ├─ base_model.py       # Abstract base class for models
   │  ├─ openai_model.py     # Implementation for OpenAI
   │  ├─ anthropic_model.py  # Implementation for Anthropic
   │  └─ ...
   ├─ connectors/
   │  ├─ discord_connector.py
   │  ├─ twitter_connector.py
   │  ├─ telegram_connector.py
   │  └─ ...
   ├─ memory/
   │  ├─ memory_store.py     # Logic for storing and retrieving memory
   │  ├─ vector_db.py        # Vector store integration
   │  └─ ...
   ├─ dashboard/
   │  ├─ app.py              # Flask/FastAPI server
   │  ├─ static/             # Frontend files if using a framework
   │  └─ templates/          # HTML templates if using server-side rendering
   ├─ main.py                 # Entry point: start the AgentManager, connectors, dashboard
   └─ ...
