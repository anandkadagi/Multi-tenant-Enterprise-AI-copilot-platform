from qdrant_client import QdrantClient
client=None
def get_client():
    global client
    if client is None:
        client=QdrantClient(
            path="./qdrant_data"
        )
    return client    