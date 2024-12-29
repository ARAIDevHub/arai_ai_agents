from models.gemini_model import GeminiModel
# import step_1 as next_step
# import step_2 as next_step
import step_3 as next_step


if __name__ == "__main__":
    model = GeminiModel()

    # step_1 = next_step.step_1(model)
    # step_2 = next_step.step_2(model)
    step_3 = next_step.step_3(model, "configs/@PapaPunMaster/@PapaPunMaster.yaml", "configs/@PapaPunMaster/season_1/season_1.yaml")


