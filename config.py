import os

# Base paths relative to the project root
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Common directory paths
CONFIGS_DIR = os.path.join(BASE_DIR, "configs")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
PROMPTS_DIR = os.path.join(BASE_DIR, "prompts")

# Common file paths
CHAIN_PROMPTS_PATH = os.path.join(PROMPTS_DIR, "chain_prompts_v2.yaml")
AGENT_TEMPLATE_PATH = os.path.join(TEMPLATES_DIR, "agent_template.yaml")
SEASON_TEMPLATE_PATH = os.path.join(TEMPLATES_DIR, "season_template.yaml")
EPISODE_TEMPLATE_PATH = os.path.join(TEMPLATES_DIR, "episode_template.yaml")
