from qdrant_client import QdrantClient
from app.embeddings.embedding import model
from app.qdrant_client.client import get_client
client=get_client()
collection="documents"
def sementic_search(query,limit=5):
    query_embedding=model.encode(query,normalize_embeddings=True).tolist()
    results=client.query_points(
        collection_name=collection,
        query=query_embedding,
        limit=limit
    )
    output=[]
    for result in results.points:
        print(result)
        output.append({
            "score":result.score,
            "document_id":result.payload.get("document_id"),
            "page":result.payload.get("page"),
            "text":result.payload.get("text")
            })
           

        
       
    return output
