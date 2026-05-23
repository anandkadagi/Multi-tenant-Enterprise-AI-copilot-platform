import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.chunking.chunker import chunk_text
from app.vector_store.vector_store import (store_embeddings,create_collection)
from app.embeddings.embedding import generate_embeddings
from app.retrieval.search import sementic_search
from app.models.query import SearchRequest
from app.retrieval.bm25_search import build_bm25
from app.retrieval.hybrid_search import hybrid_search
from app.retrieval.final_retrival import final_retrival
from app.text_extraction.document_text_extraction import load

router=APIRouter(
    prefix="/injection",
    tags=["injection"]
)
upload_dir="uploaded_docs"
os.makedirs(upload_dir,exist_ok=True)
@router.post("/upload")
async def upload_pdf(file:UploadFile=File(...)):
    id=uuid.uuid4()
    file_path=os.path.join(upload_dir,f"{id}_{file.filename}")
    content=await file.read()

    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    with open(file_path,"wb") as buffer:
        buffer.write(content)

    # extracted_pages=parse_pdf(file_path)
    extracted_pages=load(file_path)
    print(extracted_pages["pages"])
    processed_chunks=[]
    for page in extracted_pages["pages"]:
        chunks=chunk_text(page["text"])
        for chunk_index,chunk in enumerate(chunks):
            processed_chunks.append({
                "document_id": id,

                "document_name": file.filename,

                "page": page["page_number"],

                "chunk_index": chunk_index,

                "text": chunk
            })
    embeddings=generate_embeddings(processed_chunks)
    create_collection()
    store_embeddings(processed_chunks,embeddings)   
    build_bm25(processed_chunks)     
    return {

    "chunks":
    len(processed_chunks),

    "embeddings":
    len(embeddings),

    "stored":
    True
}
@router.post('/search')
async def sementic_search_endpoint(body:SearchRequest):
    results=sementic_search(body.query)
    return{
        "query":body.query,
        "result":results
    }
@router.post('/hybrid_search')
async def hybrid_search_endpoint(body:SearchRequest):
    results=hybrid_search(body.query)
    return{
        "query":body.query,
        "result":results
    }
@router.post('/retrieval')
async def retrieval_endpoint(body:SearchRequest):
    result=final_retrival(body.query)
    return{
        "query":body.query,
        "result":result
    }