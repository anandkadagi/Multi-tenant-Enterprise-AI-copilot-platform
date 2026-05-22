from app.retrieval.hybrid_search import hybrid_search
from app.re_ranking.rerank import re_rank
def final_retrival(query):
    hybrid_results=hybrid_search(query)
    final_results=re_rank(query,hybrid_results,top_k=5)
    return final_results