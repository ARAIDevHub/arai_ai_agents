#
# Module: template_types
#
# This module implements the TemplateType class for defining the type of template.
#
# Title: Template Types
# Summary: Template types implementation.
# Authors:
#     - @TheBlockRhino
# Created: 2024-12-31
# Last edited by: @TheBlockRhino
# Last edited date: 2025-01-04
# URLs:
#     - https://arai-ai.io
#     - https://github.com/ARAI-DevHub/arai-ai-agents
#     - https://x.com/TheBlockRhino

class TemplateType:
    """This class is used to define the type of template.

    Attributes:
        AGENT (str): the type of template for an agent
        SEASON (str): the type of template for a season
        EPISODE (str): the type of template for an episode
        PROFILE_PICTURE (str): the type of template for a profile picture
    """
    MASTER = "master"
    TRACKER = "tracker"
    AGENT = "agent"
    SEASON = "season"
    EPISODE = "episode"
    PROFILE_PICTURE = "profile_picture"