# Getting Started with the Gemini API using Python

This tutorial will guide you through the process of setting up and making your first request to the Gemini API using the Google's Generative AI Python library.

## Prerequisites

Before you begin, make sure you have the following:

*   **Python 3.11+ installed:** You can check your Python version by running `python --version` or `python3 --version` in your terminal.
*   **A Google Cloud Project:** If you don't have one, create a new project in the [Google Cloud Console](https://console.cloud.google.com/).
*   **A Gemini API Key:**  
    1.  Go to [Google AI Studio](https://ai.google.dev/).
    2.  Click on **"Get API Key"**
    3.  Select your Google Cloud Project where you want to enable the API.
    4.  Click on **"Create API Key"**. Copy this key; you'll need it later.
*   **The `google-generativeai` Python library:** You can install it using pip:

    ```bash
    pip install google-generativeai
    ```

## Step 1: Configure Your API Key

The `google-generativeai` library needs your API key to authenticate your requests to the Gemini API. There are a couple of ways to provide it:

**Method 1: Environment Variable (Recommended)**

1.  Set an environment variable named `GOOGLE_API_KEY` with your API key as the value.

    *   **Linux/macOS:**
        ```bash
        export GOOGLE_API_KEY="YOUR_API_KEY" 
        ```

    *   **Windows:**
        ```bash
        setx GOOGLE_API_KEY "YOUR_API_KEY"
        ```
      (you might need to restart your console or IDE for it to take effect)

2.  Then in your python code you can configure like this:
    ```python
    import google.generativeai as genai
    import os
    
    genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
    ```

**Method 2: Directly in your code (Less Secure)**

You can set your api key directly in your Python code. **However, this is less secure, especially if you are sharing or versioning your code.**

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY") # Replace "YOUR_API_KEY" with your actual key

Step 2: Initialize the Model

Now, let's initialize the GenerativeModel with the gemini-pro model:
Python

import google.generativeai as genai

# ... API key configuration (see Step 1) ...

model = genai.GenerativeModel("gemini-pro") 

Step 3: Make Your First Request

Let's send a simple prompt to the Gemini API and get a response:
Python

import google.generativeai as genai

# ... API key configuration and model initialization (see Steps 1 & 2) ...

prompt = "What is the capital of France?"

response = model.generate_content(prompt)

print(response.text)

Expected Output:

The capital of France is Paris.

(or a similar, more elaborate response)

Explanation:

    prompt: This variable holds the text prompt you are sending to the model.
    model.generate_content(prompt): This calls the API, sending the prompt and receiving the generated content.
    response.text: This accesses the text part of the response from the model.

Step 4: Using the Chat Interface (Conversational AI)

The Gemini API also supports a chat interface where you can have back-and-forth conversations.
Python

import google.generativeai as genai

# ... API key configuration (see Step 1) ...

model = genai.GenerativeModel("gemini-pro")

messages = []

messages.append({
    "role": "user",
    "parts": ["What is the capital of France?"]
})

response = model.generate_content(messages)
print(response.text)

messages.append({
    "role": "model",
    "parts": [response.text]
})

messages.append({
    "role": "user",
    "parts": ["And what is its population?"]
})

response = model.generate_content(messages)
print(response.text)

Explanation:

    messages: This list stores the history of your conversation.
    Adding messages: Each message in the messages list is a dictionary with:
        role: Either "user" (for your prompts) or "model" (for the AI's responses).
        parts: A list of strings or other content parts, representing the content of the message.
    model.generate_content(messages): The generate_content method now takes the entire message history to provide context for the model.
    Appending the model's response to the chat history: To maintain the conversation flow, you append the model's response to messages so that it remembers the previous turns.

Step 5: Exploring Further

    More Model Parameters: Check out the Google AI for Developers documentation to learn about other parameters you can use to control the model's generation (e.g., temperature, top_k, top_p).
    Safety Settings: You can configure safety settings to control what type of content the model generates. See the Safety Settings documentation.
    Other Models: Explore other available models, such as gemini-pro-vision for multimodal input (text and images).

Troubleshooting

    API key not found error: Make sure your API key is correctly configured as an environment variable or in your code.
    PermissionDenied error: Verify that the API key is associated with a Google Cloud project that has the Gemini API enabled.
    Other errors: Refer to the Gemini API documentation for more detailed error messages and troubleshooting steps.

Conclusion

Congratulations! You've now successfully made your first request to the Gemini API and even tried out a simple conversation. This is just the beginning of what you can do with this powerful API. Explore the documentation and experiment with different prompts and model parameters to unlock the full potential of Google's Generative AI models.