from qdrant_client import QdrantClient
from app.embeddings.embedding import EmbeddingGenerator
from app.qdrant_client.client import get_client
client=get_client()
collection="documents"
def sementic_search(query,limit=5):
    embedding_generator = EmbeddingGenerator()
    query_embedding = embedding_generator.generate_embeddings([{"text": query}])[0]["embedding"]
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
