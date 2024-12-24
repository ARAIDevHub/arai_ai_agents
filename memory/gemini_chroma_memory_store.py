# gemini_memory_store.py
import os
import google.generativeai as genai
import chromadb
# from chromadb import Settings
from dotenv import load_dotenv
from typing import Optional, Dict, List
from .base_memory import AbstractMemoryStore
import uuid
import tiktoken

load_dotenv()

class GeminiChromaMemoryStore(AbstractMemoryStore):
    '''
    Memory store for the agent using Gemini for embeddings and ChromaDB for storage.
    '''

    def __init__(self, client_settings: Optional[chromadb.config.Settings] = None):
        '''
        Initialize the memory store with an optional chromadb.Client.

        Args:
            client_settings (Optional[chromadb.config.Settings]): Optional client settings for the chromadb client.
        '''
    def __init__(self, persist_dir: str = None):
        # chromadb setup
        self.client = chromadb.PersistentClient(path=persist_dir) if persist_dir else chromadb.Client()        
        
        # ai model setup
        self.genai = genai
        self.genai.configure(api_key=os.getenv("GOOGLE_GEMINI_API_KEY"))

        # Find a suitable Gemini model for embeddings
        self.model = None
        for m in genai.list_models():
            if 'embed' in m.name:
                self.model = genai.GenerativeModel(m.name)
                break

        if self.model is None:
            raise ValueError("No suitable Gemini embedding model found.")

    def get_collection(self, name: str) -> chromadb.api.models.Collection.Collection:
        '''
        Retrieves or creates a collection by name.

        Args:
            name (str): The name of the collection.

        Returns:
            chromadb.api.models.Collection.Collection: The retrieved or newly created collection.
        '''
        return self.client.get_or_create_collection(name=name)

    def embed_text(self, text: str) -> List[float]:
        '''
        Embed the text using the Gemini embedding model.

        Args:
            text (str): The text to embed.

        Returns:
            List[float]: The embedding of the text.
        '''
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document",
            title="Embedding of agent memory"
        )
        return result["embedding"]

    def add_memory(self, collection_name: str, memory: Dict):
        '''
        Add a memory to the specified collection.

        Args:
            collection_name (str): The name of the collection.
            memory (Dict): The memory to add, expected to have 'document', and optionally 'metadata'.
        '''
        embedding = self.embed_text(memory['document'])
        collection = self.get_collection(collection_name)

        if memory.get('metadata'):
            collection.add(
                documents=[memory['document']],
                embeddings=[embedding],
                metadatas=[memory['metadata']],
                ids=[str(uuid.uuid4())]
            )
        else:
            collection.add(
                documents=[memory['document']],
                embeddings=[embedding],
                ids=[str(uuid.uuid4())]
            )

    def retrieve_relevant_memories(self, collection_name: str, query: str, k: int = 3) -> List[str]:
        '''
        Retrieve the most relevant memories from the memory store.

        Args:
            collection_name (str): The name of the collection.
            query (str): The query string.
            k (int): The number of relevant memories to retrieve.

        Returns:
            List[str]: A list of relevant memory documents.
        '''
        query_embedding = self.embed_text(query)
        results = self.get_collection(collection_name).query(
            query_embeddings=[query_embedding],
            n_results=k
        )

        if results['documents'] and results['documents'][0]:
            return results['documents'][0]
        else:
            return []