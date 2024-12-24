import yaml
from jinja2 import Template

# -------------------------------------------------------------------
# Helper to append new agent data to the current agent data in key value pairs
# -------------------------------------------------------------------
def append_agent_data(self, new_agent_data, current_agent_data):
    """
    Recursively merges nested dictionaries and lists from new_agent_data into current_agent_data
    """
    def merge_lists(existing_list, new_list):
        # Create a map of existing items by their identifying fields
        existing_map = {}
        for item in existing_list:
            # Use appropriate identifier based on the data structure
            if 'season_number' in item:
                key = item['season_number']
            elif 'episode_number' in item:
                key = item['episode_number']
            elif 'post_number' in item:
                key = item['post_number']
            else:
                # If no identifier found, append as new item
                continue
            existing_map[key] = item

        # Merge or append new items
        for new_item in new_list:
            key = None
            if 'season_number' in new_item:
                key = new_item['season_number']
            elif 'episode_number' in new_item:
                key = new_item['episode_number']
            elif 'post_number' in new_item:
                key = new_item['post_number']

            if key and key in existing_map:
                # Recursively merge if item exists
                merge_dicts(existing_map[key], new_item)
            else:
                # Append if it's a new item
                existing_list.append(new_item)
        
        return existing_list

    def merge_dicts(current_dict, new_dict):
        for key, value in new_dict.items():
            if key in current_dict:
                if isinstance(value, dict) and isinstance(current_dict[key], dict):
                    merge_dicts(current_dict[key], value)
                elif isinstance(value, list) and isinstance(current_dict[key], list):
                    merge_lists(current_dict[key], value)
                else:
                    current_dict[key] = value
            else:
                current_dict[key] = value
        return current_dict

    return merge_dicts(current_agent_data, new_agent_data)