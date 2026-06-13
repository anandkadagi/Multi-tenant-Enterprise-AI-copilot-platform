import os
from dotenv import load_dotenv
from openai import OpenAI

def LLM_config():
    load_dotenv()

    client = OpenAI(
    api_key=os.getenv("LLM_api_key"),
    base_url="https://api.groq.com/openai/v1"
    )
    return client


