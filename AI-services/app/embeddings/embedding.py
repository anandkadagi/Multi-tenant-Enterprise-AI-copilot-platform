from sentence_transformers import SentenceTransformer
model=SentenceTransformer("BAAI/bge-small-en-v1.5")
def generate_embeddings(chunks):
    text=[chunk['text'] for chunk in chunks]
    embeddings=model.encode(text,normalize_embeddings=True)
    return embeddings.tolist()