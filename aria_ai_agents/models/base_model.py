#
# Module: base_model
#
# This module implements the ModelInterface class for interacting with ai apis.
#
# Title: Base Model
# Summary: Base model implementation.
# Authors:
#     - @TheBlockRhino
# Created: 2024-12-31
# Last edited by: @TheBlockRhino
# Last edited date: 2025-01-04
# URLs:
#     - https://aria-ai.io
#     - https://github.com/ARIA-DevHub/aria-ai-agents
#     - https://x.com/TheBlockRhino
from abc import ABC, abstractmethod # Import the ABC class and abstractmethod from the abc module

class ModelInterface(ABC):
    """Base class for all models.        
    """
    @abstractmethod
    def generate_response(self, prompt: str) -> str:
        """ Generate a response to a given prompt.

        Args:
            prompt (str): The prompt to generate a response to.

        Returns:
            str: The generated response.

        Example:
            >>> base_model.generate_response("Hello, world!")
        """

        pass