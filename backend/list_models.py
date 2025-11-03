import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the client with your API key
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# List available models
print("Fetching available models...")
models = client.models.list()

# Print model IDs
print("\nAvailable models:")
for model in models.data:
    print(f"- {model.id}")

print("\nTest complete.")
