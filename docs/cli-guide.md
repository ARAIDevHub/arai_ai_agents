# ARAI CLI Usage Guide

The **ARAI AI Agents** command-line interface (CLI) offers a straightforward way to manage your AI agents, create media content (seasons/episodes), and schedule or force posts. This guide will walk you through the main menu options and typical use cases.

---

## Table of Contents

1. [Launching the CLI](#1-launching-the-cli)
2. [Main Menu Overview](#2-main-menu-overview)
3. [CLI Tips & Tricks](#3-cli-tips--tricks)
4. [Common Workflows](#4-common-workflows)
5. [Exiting the CLI](#5-exiting-the-cli)
6. [Troubleshooting](#6-troubleshooting)
7. [Conclusion](#7-conclusion)

---

## 1. Launching the CLI

1. **Activate your Conda environment** (if using conda):
   ```bash
   conda activate arai_ai_agents
   ```
2. **Navigate** to your `arai_ai_agents` folder:
   ```bash
   cd arai_ai_agents
   ```
3. **Run** the CLI script:
   ```bash
   python main.py
   ```
4. You should see a welcome prompt similar to:

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
   
---

## 2. Main Menu Overview

Below is a breakdown of each **main menu** option and what it does:

### 1. Select an Existing Agent
If you have previously created AI agents, you can pick which one you want to work with. After you select an agent, the **Current Agent** will change from `None` to the chosen agent’s name.  
- **Why**: This allows you to isolate tasks (creating posts, scheduling, etc.) for a specific agent.

### 2. Create a New Agent
This option launches a short wizard to build a new AI agent from scratch:
- **Steps**:  
  1. Provide a **name** or handle for the agent.  
  2. Supply any extra info (e.g., personality traits, brand guidelines).  
  3. Confirm creation.  
- Once complete, the new agent appears in the list of available agents.

---

### 3. Create a New Season
Seasons act like **story arcs** or **thematic campaigns** for your agent’s content. Selecting this option:
1. Prompts you for a **season name** (e.g., “Season 1: The Great Launch”).  
2. Optionally requests a **description** or theme.  
3. Creates a basic YAML or JSON entry to track this season’s details.

### 4. Create Season Posts
After you have a season in place (or multiple), this option helps you **generate posts** (or “episodes”) related to that season. You may be asked:
1. Which **season** you want to create posts for.  
2. How many posts (scenes/episodes) you need.  
3. Any special context or prompts.  
The CLI will then process prompts and **batch-generate** content (e.g., social media posts) for that season.

---

### 5. Start Scheduler
ARAI includes a **scheduler** that can automatically post content at set intervals:
1. When you start the scheduler, you’ll see logs or debug info showing if posting is live or in “test mode.”  
2. The system will queue up any scheduled posts from the currently selected agent (or all agents, depending on your config).

### 6. Check Posting Status
Use this to see **which posts** are scheduled, how many have gone out, and whether any are **pending** or **on hold**. It helps confirm that your agent is indeed posting or waiting to post.

### 7. Force Post Now
If you don’t want to wait for the next scheduled slot, you can **force** the system to post immediately. This can be handy if:
- You need to push out an urgent update.  
- You want to test how the post looks on your platform right away.

### 8. Pause/Resume Posting
Allows you to **temporarily halt** the scheduler without losing its state. When paused:
- No new posts are sent to Twitter (or other connectors).  
- You can safely resume posting later when you’re ready.

---

### 9. Exit
Closes the CLI. Any running background jobs or schedulers (if not paused or stopped) may continue operating until their next iteration, but the main interactive session ends.

---

## 3. CLI Tips & Tricks

- **Switching Agents**: You can always go back to option `1` to select another agent at any time.
- **Inspecting Logs**: If something goes wrong (e.g., an error connecting to Twitter), check the CLI output or your log files in `configs/agent_folder/agentName_post_log.yaml` for debug information.
- **Using the .env**: Make sure your environment variables (Twitter keys, Gemini API key, etc.) are properly set in your `.env` file or system environment so the CLI can access them.
- **In-Depth Configuration**: If you prefer custom intervals, advanced scheduling, or specialized post flows, you can modify the relevant `.yaml` or `.json` config files in the `configs/` directory. The CLI reads from and writes to these files to maintain state.

---

## 4. Common Workflows

1. **Create & Configure a New Agent**  
   1. Select option **2** at the main menu.  
   2. Provide agent details.  
   3. Optionally, create a season (option **3**) and season posts (option **4**).  

2. **Schedule Posts for Automated Publishing**  
   1. Start the scheduler with option **5**.  
   2. Check the status with option **6**.  
   3. If you want immediate posting, option **7** triggers it right away.  
   4. Pause/Resume with option **8**.

3. **Batch Generate Contextual Posts**  
   1. Select or create an agent.  
   2. Use option **3** to define a thematic “season.”  
   3. Then option **4** to generate multiple posts in one go.  
   4. Let the scheduler handle posting times, or force them out (option **7**).

---

## 5. Exiting the CLI

When you’re done:
1. Select **9** at the main menu or press `Ctrl + C` to exit the application.
2. Any unsaved changes in memory will typically be written out to config/log files when you exit.

---

## 6. Troubleshooting

- **CLI Not Launching**: Double-check you’ve activated your conda environment or installed the dependencies with `pip install -r requirements.txt`.
- **Agent Not Appearing in Menu**: The agent creation process may have failed or you forgot to confirm. Check your `/configs/agent_folder/` for a new `.yaml` or `.json`.
- **No Posting**: Confirm `twitter_live = True` in your main settings if you want real posts. Otherwise, they’re logged to a local file.
- **Crashes or Errors**: Review the CLI output or logs for stack traces. If the system can’t find your API keys, ensure your `.env` or environment variables are correctly set.

---

## Conclusion

That’s the basics of using the **ARAI AI Agents** CLI. From selecting or creating new agents, to generating multi-episode story arcs, to scheduling or forcing posts, the menu-based system keeps everything at your fingertips. If you have questions or encounter issues, check out the official [GitHub repository](https://github.com/arai-ai/arai_ai_agents) or submit an Issue for assistance.

**Happy creating and scheduling with ARAI!**