# from qdrant_client import QdrantClient
# from app.embeddings.embedding import EmbeddingGenerator
# from app.qdrant_client.client import get_client
# client=get_client()
# collection="documents"
# def sementic_search(query,limit=5):
#     embedding_generator = EmbeddingGenerator()
#     query_embedding = embedding_generator.generate_embeddings([{"text": query}])[0]["embedding"]
#     results=client.query_points(
#         collection_name=collection,
#         query=query_embedding,
#         limit=limit
#     )
#     output=[]
#     for result in results.points:
#         print(result)
#         output.append({
#             "score":result.score,
#             "document_id":result.payload.get("document_id"),
#             "page":result.payload.get("page"),
#             "text":result.payload.get("text")
#             })
           

        
       
#     return output


from app.vector_store.vector_store import client, COLLECTION_NAME
from qdrant_client.models import Filter, FieldCondition, MatchValue
from app.embeddings.embedding import EmbeddingGenerator

embedding_generator = EmbeddingGenerator()

def sementic_search(query, company_id, top_k=5):
    query_vector = embedding_generator.generate_embeddings([{"text": query}])[0]

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="company_id",
                    match=MatchValue(value=company_id)
                )
            ]
        ),
        limit=top_k
    )

    return [
        {
            "text": r.payload["text"],
            "document_id": r.payload["document_id"],
            "document_name": r.payload["document_name"],
            "page": r.payload["page"],
            "chunk_index": r.payload["chunk_index"],
            "score": r.score
        }
        for r in results
    ]