# from rank_bm25 import BM25Okapi
# bm25=None
# documents=[]
# def build_bm25(chunks):
#     global bm25,documents
#     documents=chunks
#     corpus=[chunk["text"].split() for chunk in chunks]
#     bm25=BM25Okapi(corpus)
# def bm25_Search(query,limit=5):
#     if bm25 is None:
#         return[]
#     query_token=query.split()
#     scores=bm25.get_scores(query_token)
#     ranked=sorted(zip(documents,scores),key=lambda x:x[1],reverse=True)   
#     output=[] 
#     for chunk,score in ranked[:limit]:
#         output.append({
#             "score":float(score),
#             "page":chunk["page"],
#             "text":chunk["text"]
#         })
#     return output



import pickle
import os
from rank_bm25 import BM25Okapi

BM25_DIR = "bm25_indexes"
os.makedirs(BM25_DIR, exist_ok=True)

def _index_path(company_id):
    return os.path.join(BM25_DIR, f"{company_id}.pkl")

def build_bm25(chunks, company_id):
    path = _index_path(company_id)

    # Load existing index's chunks for this company, if any, and append
    existing_chunks = []
    if os.path.exists(path):
        with open(path, "rb") as f:
            data = pickle.load(f)
            existing_chunks = data["chunks"]

    all_chunks = existing_chunks + chunks
    tokenized = [c["text"].split() for c in all_chunks]
    bm25 = BM25Okapi(tokenized)

    with open(path, "wb") as f:
        pickle.dump({"bm25": bm25, "chunks": all_chunks}, f)

def bm25_search(query, company_id, top_k):
    path = _index_path(company_id)
    if not os.path.exists(path):
        return []  # this company has no documents yet

    with open(path, "rb") as f:
        data = pickle.load(f)

    bm25 = data["bm25"]
    chunks = data["chunks"]

    scores = bm25.get_scores(query.split())
    ranked = sorted(zip(chunks, scores), key=lambda x: x[1], reverse=True)[:top_k]

    return [
        {**chunk, "score": score}
        for chunk, score in ranked
    ]