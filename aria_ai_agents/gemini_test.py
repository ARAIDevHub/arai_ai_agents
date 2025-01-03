from models.gemini_model import GeminiModel

if __name__ == "__main__":
    gemini_model = GeminiModel()
    response = gemini_model.generate_response("What is the weather in San Francisco?")
    print(response)
