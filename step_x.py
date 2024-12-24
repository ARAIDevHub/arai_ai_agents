
'''
    agent = manager.add_agent_data_to_template(new_agent_data=agent_data, current_agent_data=agent)
    print(agent)

    config_path = agent_data["name"]
    manager.save_agent_yaml(agent_data=agent, config_path=config_path)

    # prompt 2 Character Backstory: 
    # Generate new agents background, and personality with the prompt_2 template
    prompt_2_vars = {
        "agent_name": agent["name"],
        "agent_background": None,
        "agent_yaml": yaml.dump(agent)
    }
    agent_data = manager.run_prompt(prompt_key="prompt_2", template_vars=prompt_2_vars, ai_model=ai_model)
    print(agent_data)

    # Update agent with new data from prompt 2
    agent = manager.add_agent_data_to_template(new_agent_data=agent_data, current_agent_data=agent)
    print(agent)

    # Save updated agent data
    manager.save_agent_yaml(agent_data=agent)

    # prompt 3 Universe: 
    # Generate a new universe for the agent with the prompt_3 template
    prompt_3_vars = {
        "agent_name": agent["name"],
        "agent_yaml": yaml.dump(agent)
    }
    agent_data = manager.run_prompt(prompt_key="prompt_3", template_vars=prompt_3_vars, ai_model=ai_model)
    print(agent_data)

    # Update agent with new data from prompt 3
    agent = manager.add_agent_data_to_template(new_agent_data=agent_data, current_agent_data=agent)
    print(agent)

    # Save updated agent data
    manager.save_agent_yaml(agent_data=agent)

    # prompt 4 Hashtags and Emojis: 
    # Generate new hashtags and emojis for the agent with the prompt_4 template
    prompt_4_vars = {
        "agent_name": agent["name"],
        "agent_yaml": yaml.dump(agent)
    }
    agent_data = manager.run_prompt(prompt_key="prompt_4", template_vars=prompt_4_vars, ai_model=ai_model)
    print(agent_data)

    # Update agent with new data from prompt 4
    agent = manager.add_agent_data_to_template(new_agent_data=agent_data, current_agent_data=agent)
    print(agent)

    # Save updated agent data
    manager.save_agent_yaml(agent_data=agent)

    # prompt 5 Season Creation: 
    # Generate a new season for the agent with the prompt_5 template
    prompt_5_vars = {
        "agent_name": agent["name"],
        "agent_yaml": yaml.dump(agent),
        "number_of_episodes": 3  # Example: create 3 episodes
    }
    agent_data = manager.run_prompt(prompt_key="prompt_5", template_vars=prompt_5_vars, ai_model=ai_model)
    print(agent_data)

    # Update agent with new data from prompt 5
    agent = manager.add_agent_data_to_template(new_agent_data=agent_data, current_agent_data=agent)
    print(agent)

    # Save updated agent data
    manager.save_agent_yaml(agent_data=agent)

    # prompt 6 Episode Posts Creation:
    # Generate new episode posts for the agent with the prompt_6 template
    # Assuming you want to generate posts for the first episode of the first season
    season_number = agent['season']['season_number']
    episode_number = agent['season']['episodes'][0]['episode_number']
    episode_overview = agent['season']['episodes'][0]['episode_overview']
    season_overview = agent['season']['season_overview']

    prompt_6_vars = {
        "agent_name": agent["name"],
        "agent_yaml": yaml.dump(agent),
        "season_number": season_number,
        "episode_number": episode_number,
        "number_of_posts": 3,  # Example: create 3 posts
        "post_length": 280,  # Example: maximum post length of 280 characters
        "emojis": agent["emojis"],
        "hashtags": agent["hashtags"],
        "episode_overview": episode_overview,
        "season_overview": season_overview
    }
    agent_data = manager.run_prompt(prompt_key="prompt_6", template_vars=prompt_6_vars, ai_model=ai_model)
    print(agent_data)

    # Update agent with new data from prompt 6
    # This step depends on how the posts are structured in agent_data
    # You might need to adjust the logic here
    if 'posts' in agent_data:
        agent['season']['episodes'][0]['posts'] = agent_data['posts']
    print(agent)

    # Save updated agent data
    manager.save_agent_yaml(agent_data=agent)

    # prompt 7 Episode Summary Creation:
    # Generate a new episode summary for the agent with the prompt_7 template
    # Assuming you want to generate a summary for the first episode
    posts = agent['season']['episodes'][0]['posts']
    episode_name = agent['season']['episodes'][0]['episode_name']

    prompt_7_vars = {
        "agent_name": agent["name"],
        "agent_yaml": yaml.dump(agent),
        "season_number": season_number,
        "episode_number": episode_number,
        "number_of_posts": len(posts),
        "posts": "\n".join(posts),
        "episode_overview": episode_overview,
        "episode_name": episode_name
    }
    agent_data = manager.run_prompt(prompt_key="prompt_7", template_vars=prompt_7_vars, ai_model=ai_model)
    print(agent_data)

    # Update agent with new data from prompt 7
    # This step depends on how the episode summary is structured in agent_data
    # You might need to adjust the logic here
    if 'episode_summary' in agent_data:
        agent['season']['episodes'][0]['episode_summary'] = agent_data['episode_summary']
    print(agent)

    # Save updated agent data
    manager.save_agent_yaml(agent_data=agent)

    # prompt 8 Next Episode Posts Creation:
    # Generate new episode posts for the next episode with the prompt_8 template
    # Assuming you want to generate posts for the second episode
    next_episode_number = agent['season']['episodes'][1]['episode_number']
    episode_summary = agent['season']['episodes'][0]['episode_summary']

    prompt_8_vars = {
        "agent_name": agent["name"],
        "agent_yaml": yaml.dump(agent),
        "episode_number": episode_number,
        "next_episode_number": next_episode_number,
        "number_of_posts": 3,  # Example: create 3 posts
        "post_length": 280,  # Example: maximum post length of 280 characters
        "emojis": agent["emojis"],
        "hashtags": agent["hashtags"],
        "episode_summary": episode_summary
    }
    agent_data = manager.run_prompt(prompt_key="prompt_8", template_vars=prompt_8_vars, ai_model=ai_model)
    print(agent_data)

    # Update agent with new data from prompt 8
    # This step depends on how the posts are structured in agent_data
    # You might need to adjust the logic here
    if 'posts' in agent_data:
        agent['season']['episodes'][1]['posts'] = agent_data['posts']
    print(agent)

    # Save updated agent data
    manager.save_agent_yaml(agent_data=agent)

    # prompt 9 Season Summary Creation:
    # Generate a new season summary for the agent with the prompt_9 template
    # Assuming you have summaries for all episodes in the season
    episode_summaries = [episode['episode_summary'] for episode in agent['season']['episodes']]
    season_name = agent['season']['season_name']

    prompt_9_vars = {
        "agent_name": agent["name"],
        "agent_yaml": yaml.dump(agent),
        "season_number": season_number,
        "episode_summaries": "\n".join(episode_summaries),
        "season_overview": season_overview,
        "season_name": season_name
    }
    agent_data = manager.run_prompt(prompt_key="prompt_9", template_vars=prompt_9_vars, ai_model=ai_model)
    print(agent_data)

    # Update agent with new data from prompt 9
    # This step depends on how the season summary is structured in agent_data
    # You might need to adjust the logic here
    if 'season_summary' in agent_data:
        agent['season']['season_summary'] = agent_data['season_summary']
    print(agent)

    # Save updated agent data
    manager.save_agent_yaml(agent_data=agent)

'''