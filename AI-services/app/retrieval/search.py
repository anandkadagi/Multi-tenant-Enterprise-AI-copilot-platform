
from app.vector_store.vector_store import client, COLLECTION_NAME
from qdrant_client.models import Filter, FieldCondition, MatchValue
from app.embeddings.embedding import EmbeddingGenerator

embedding_generator = EmbeddingGenerator()

def sementic_search(query, company_id, top_k):
    # query_vector = embedding_generator.generate_embeddings([{"text": query}])[0]
    query_vector = embedding_generator.generate_embeddings([{"text": query}])[0]["embedding"]
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
            "page": r.payload["page"],
            "chunk_index": r.payload["chunk_index"],
            "score": r.score
        }
        for r in results.points
    ]