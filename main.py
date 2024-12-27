from models.gemini_model import GeminiModel
import step_1 as next_step
import yaml

if __name__ == "__main__":

    # Instantiate your AI model
    ai_model = GeminiModel()

    # ai_model.generate_yaml_response()

    # call step 1
    next_step.step_1(ai_model, debug=False)

    # model test
    #print(ai_model.generate_response("What is the capital of France?"))
    
    '''
    with open("configs/Xylar/processed_response.yaml", "r", encoding="utf-8") as file:
        data = yaml.safe_load(file)

    print(data["season"]["season_number"])
    print(data["season"]["season_name"])
    print(data["season"]["episodes"][0]["episode_number"])
    print(data["season"]["episodes"][0]["episode_name"])
    print(data["season"]["episodes"][0]["episode_description"])
    print(data["season"]["episodes"][0]["episode_highlights"])
    print(data["season"]["episodes"][0]["episode_summary"])
    '''