from sentence_transformers import CrossEncoder
reranker=CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
def re_rank(query,embeded_chunks,top_k=5):
    pairs=[(query,chunk['text']) for chunk in embeded_chunks]
    scores=reranker.predict(pairs)
    ranked_score=[]
    for chunk,score in zip(embeded_chunks,scores):
        ranked_score.append({
            **chunk,
            "rerank_score":float(score)
        })
    ranked_score.sort(
        key=lambda x:x["rerank_score"],
        reverse=True
    )  
    return ranked_score[:top_k]  