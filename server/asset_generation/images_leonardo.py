import requests
import os
import dotenv

dotenv.load_dotenv()

#--------------------------------
# Generate an image from a prompt
#--------------------------------
def generated_image(prompt):
    url = "https://cloud.leonardo.ai/api/rest/v1/generations"

    payload = {
        "alchemy": True,
        "height": 768,
        "modelId": "b24e16ff-06e3-43eb-8d33-4416c2d75876",
        "num_images": 4,
        "presetStyle": "DYNAMIC",
        "prompt": prompt,
        "width": 1024
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    response = requests.post(url, json=payload, headers=headers)

    return response.json()

#--------------------------------
# Get the image URL from a generation ID
#--------------------------------
def get_image_url(generation_id):
    url = "https://cloud.leonardo.ai/api/rest/v1/generations/" + generation_id

    headers = {
        "accept": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    response = requests.get(url, headers=headers)

    return response.json()

#--------------------------------
# Main
#--------------------------------
if __name__ == "__main__":
    print(generated_image("A majestic cat in the snow"))

