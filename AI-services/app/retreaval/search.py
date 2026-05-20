from qdrant_client import QdrantClient
from app.embeddings.embedding import model
from app.qdrant_client.client import get_client
client=get_client()
collection="documents"
def search(query,limit=5):
    query_embedding=model.encode(query,normalize_embeddings=True).tolist()
    results=client.query_points(
        collection_name=collection,
        query=query_embedding,
        limit=limit
    )
    output=[]
    for result in results:
        output.append({
            "score":result.points.score,
            "document_id":result.points.payload.get("document_id"),
            "page":result.points.payload.get("page"),
            "text":result.points.payload.get("text")
        })
    return output
