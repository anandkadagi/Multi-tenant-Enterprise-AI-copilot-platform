import os
import requests
from dotenv import load_dotenv

load_dotenv()

response = requests.get(
    "https://api.groq.com/openai/v1/models",
    headers={"Authorization": f"Bearer {os.getenv('LLM_api_key')}"}
)
print(response.json())