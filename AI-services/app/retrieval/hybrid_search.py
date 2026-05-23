from app.retrieval.search import sementic_search
from app.retrieval.bm25_search import bm25_Search
def hybrid_search(query,limit=5):
    sementic=sementic_search(query,limit=5)
    keyword=bm25_Search(query,limit=5)
    combined=[]
    seen=set()
    for item in (sementic+keyword):
        text=item["text"]
        if text not in seen:
            combined.append(item)
            seen.add(text)
    return combined[:limit]        