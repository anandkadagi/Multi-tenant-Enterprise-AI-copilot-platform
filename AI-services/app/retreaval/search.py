from qdrant_client import QdrantClient
from app.embeddings.embedding import model
client=QdrantClient(
    path="./qdrant_data"
)
collection="documents"
def search(query,limit=5):
    query_embedding=model.encode(query,normalize_embeddings=True).tolist()
    results=client.search(
        collection_name=collection,
        query_vector=query_embedding,
        limit=limit
    )
    output=[]
    for result in results:
        output.append({
            "score":result.score,
            "document_id":result.payload.get("document_id"),
            "page":result.payload.get("page"),
            "text":result.payload.get("text")
        })
    return output
