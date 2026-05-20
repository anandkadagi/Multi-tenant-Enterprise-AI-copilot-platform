from fastapi import FastAPI
from app.routes.routes import router as injection_router
app = FastAPI(
    title="Multi Tanent AI Services",
    version="1.0.0"
)
app.include_router(injection_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}