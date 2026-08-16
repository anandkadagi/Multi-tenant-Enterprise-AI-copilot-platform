from pydantic import BaseModel

class Message(BaseModel):
    role: str
    content: str

class SearchRequest(BaseModel):
    query: str
    tenantId: str
    userId: str | None = None 
    history: list[Message] = []