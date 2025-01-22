from typing import Optional
from .base import ClientBase
from ..logger import eliza_logger

class TwitterPostClient:
    def __init__(self, client: ClientBase, runtime):
        self.client = client
        self.runtime = runtime

    async def start(self):
        """Start the posting loop"""
        eliza_logger.info("Starting Twitter post client")
        # Implement posting logic here 