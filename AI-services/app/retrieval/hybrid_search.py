from app.retrieval.search import sementic_search
from app.retrieval.bm25_search import bm25_search

def hybrid_search(query, company_id, top_k=5, alpha=0.5):
    semantic_results = sementic_search(query, company_id, top_k)
    keyword_results = bm25_search(query, company_id, top_k)

    # simple merge by document_id+chunk_index, weighted score combo
    combined = {}

    for r in semantic_results:
        key = (r["document_id"], r["chunk_index"])
        combined[key] = {**r, "final_score": alpha * r["score"]}

    for r in keyword_results:
        key = (r["document_id"], r["chunk_index"])
        if key in combined:
            combined[key]["final_score"] += (1 - alpha) * r["score"]
        else:
            combined[key] = {**r, "final_score": (1 - alpha) * r["score"]}

    ranked = sorted(combined.values(), key=lambda x: x["final_score"], reverse=True)
    return ranked[:top_k]