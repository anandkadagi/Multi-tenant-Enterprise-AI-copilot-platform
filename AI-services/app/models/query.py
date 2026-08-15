from pydantic import BaseModel


class SearchRequest(BaseModel):
    query: str
    tenantId: str
    userId: str | None = None 