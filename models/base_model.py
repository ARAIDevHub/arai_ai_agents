from abc import ABC, abstractmethod # Import the ABC class and abstractmethod from the abc module

class ModelInterface(ABC):
    '''
    Base class for all models.
    '''
    @abstractmethod
    def generate_response(self, prompt: str) -> str:
        '''
        Generate a response to a given prompt.
        '''
        pass