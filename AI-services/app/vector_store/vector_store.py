# from qdrant_client import QdrantClient
# from app.qdrant_client.client import get_client
# from qdrant_client.models import (
#     Distance,
#     VectorParams,
#     PointStruct
# )

# # Local embedded DB
# client = get_client()

# COLLECTION = "documents"


# def create_collection():

#     existing = [
#         c.name
#         for c in client.get_collections().collections
#     ]

#     if COLLECTION not in existing:

#         client.create_collection(
#             collection_name=COLLECTION,

#             vectors_config=VectorParams(
#                 size=384,
#                 distance=Distance.COSINE
#             )
#         )

#         print("Collection created")

#     else:
#         print("Collection exists")


# def store_embeddings(
#     chunks,
#     embeddings
# ):

#     points = []

#     for idx in range(
#         len(chunks)
#     ):

#         embedding_data = embeddings[idx]
#         vector = (
#             embedding_data["embedding"]
#             if isinstance(
#                 embedding_data,
#                 dict
#             )
#             else embedding_data
#         )

#         point = PointStruct(

#             id=idx,

#             vector=vector,

#             payload={

#                 "document_id":
#                 chunks[idx]["document_id"],

#                 "page":
#                 chunks[idx]["page"],

#                 "chunk_index":
#                 chunks[idx]["chunk_index"],

#                 "text":
#                 chunks[idx]["text"]

#             }

#         )

#         points.append(point)

#     client.upsert(

#         collection_name=COLLECTION,

#         points=points

#     )

#     print(
#         f"{len(points)} vectors stored"
#     )


# def get_collection_info():

#     return client.get_collection(
#         COLLECTION
#     )




from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct,
    Filter, FieldCondition, MatchValue,
    PayloadSchemaType
)
import uuid

client = QdrantClient(host="localhost", port=6333)  # adjust to your setup
COLLECTION_NAME = "documents"

def create_collection():
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION_NAME not in existing:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE)  # match your embedding dim
        )
        
        client.create_payload_index(
            collection_name=COLLECTION_NAME,
            field_name="company_id",
            field_schema=PayloadSchemaType.KEYWORD
        )
        print("Collection created")

    else:
        print("Collection exists")


def store_embeddings(chunks, embeddings, company_id):
    points = []

    for idx in range(len(chunks)):
        embedding_data = embeddings[idx]
        vector = (
            embedding_data["embedding"]
            if isinstance(embedding_data, dict)
            else embedding_data
        )

        point = PointStruct(
            id=str(uuid.uuid4()),          
            vector=vector,
            payload={
                "document_id": chunks[idx]["document_id"],
                "company_id": company_id,   
                "page": chunks[idx]["page"],
                "chunk_index": chunks[idx]["chunk_index"],
                "text": chunks[idx]["text"]
            }
        )

        points.append(point)

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )

    print(f"{len(points)} vectors stored")