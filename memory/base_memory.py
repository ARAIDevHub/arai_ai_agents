# base_memory.py
from abc import ABC, abstractmethod
from typing import List, Dict

class AbstractMemoryStore(ABC):
    @abstractmethod
    def embed_text(self, text: str) -> List[float]:
        """
        Embeds the given text using an embedding model.

        Args:
            text: The text to embed.

        Returns:
            A list of floats representing the embedding vector.
        """
        pass

    @abstractmethod
    def add_memory(self, collection_name: str, memory: Dict):
        """
        Adds a memory to the memory store.

        Args:
            collection_name: The name of the collection.
            memory: The memory to add, expected to have 'document', and optionally 'metadata'.
        """
        pass

    @abstractmethod
    def retrieve_relevant_memories(self, collection_name: str, query: str, k: int = 3) -> List[str]:
        """
        Retrieves the k most relevant memories for a given query.

        Args:
            collection_name: The name of the collection.
            query: The query string.
            k: The number of relevant memories to retrieve.

        Returns:
            A list of relevant memory strings.
        """
        pass