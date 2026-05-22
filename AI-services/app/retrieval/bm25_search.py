from rank_bm25 import BM25Okapi
bm25=None
documents=[]
def build_bm25(chunks):
    global bm25,documents
    documents=chunks
    corpus=[chunk["text"].split() for chunk in chunks]
    bm25=BM25Okapi(corpus)
def bm25_Search(query,limit=5):
    if bm25 is None:
        return[]
    query_token=query.split()
    scores=bm25.get_scores(query_token)
    ranked=sorted(zip(documents,scores),key=lambda x:x[1],reverse=True)   
    output=[] 
    for chunk,score in ranked[:limit]:
        output.append({
            "score":float(score),
            "page":chunk["page"],
            "text":chunk["text"]
        })
    return output
