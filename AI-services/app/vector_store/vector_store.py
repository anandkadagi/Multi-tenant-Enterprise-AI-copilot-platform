from qdrant_client import QdrantClient
from app.qdrant_client.client import get_client
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct
)

# Local embedded DB
client = get_client()

COLLECTION = "documents"


def create_collection():

    existing = [
        c.name
        for c in client.get_collections().collections
    ]

    if COLLECTION not in existing:

        client.create_collection(
            collection_name=COLLECTION,

            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )

        print("Collection created")

    else:
        print("Collection exists")


def store_embeddings(
    chunks,
    embeddings
):

    points = []

    for idx in range(
        len(chunks)
    ):

        point = PointStruct(

            id=idx,

            vector=embeddings[idx],

            payload={

                "document_id":
                chunks[idx]["document_id"],

                "page":
                chunks[idx]["page"],

                "chunk_index":
                chunks[idx]["chunk_index"],

                "text":
                chunks[idx]["text"]

            }

        )

        points.append(point)

    client.upsert(

        collection_name=COLLECTION,

        points=points

    )

    print(
        f"{len(points)} vectors stored"
    )


def get_collection_info():

    return client.get_collection(
        COLLECTION
    )