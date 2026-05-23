# from sentence_transformers import SentenceTransformer
# model=SentenceTransformer("BAAI/bge-small-en-v1.5")
# def generate_embeddings(chunks):
#     text=[chunk['text'] for chunk in chunks]
#     embeddings=model.encode(text,normalize_embeddings=True)
#     return embeddings.tolist()
from typing import List, Dict
from sentence_transformers import (
    SentenceTransformer
)


class EmbeddingGenerator:

    def __init__(
        self,
        model_name="BAAI/bge-small-en-v1.5"
    ):

        self.model = (
            SentenceTransformer(
                model_name
            )
        )

    def generate_embeddings(
        self,
        chunks: List[Dict],
        batch_size: int = 64
    ) -> List[Dict]:

        if not chunks:
            return []

        texts = []

        valid_chunks = []

        for chunk in chunks:

            text = (
                chunk
                .get(
                    "text",
                    ""
                )
                .strip()
            )

            if text:

                texts.append(
                    text
                )

                valid_chunks.append(
                    chunk
                )

        if not texts:
            return []

        vectors = (
            self.model
            .encode(
                texts,
                batch_size=batch_size,
                convert_to_numpy=True,
                normalize_embeddings=True
            )
        )

        results = []

        for chunk, vector in zip(
            valid_chunks,
            vectors
        ):

            results.append(
                {
                    **chunk,

                    "embedding":
                    vector.tolist(),

                    "embedding_dim":
                    len(
                        vector
                    )
                }
            )

        return results