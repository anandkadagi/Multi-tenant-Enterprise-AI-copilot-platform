import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.injection.chunker import chunk_pdf
from app.injection.parser import parse_pdf

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

    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    with open(file_path,"wb") as buffer:
        buffer.write(content)

    extracted_pages=parse_pdf(file_path)
    processed_chunks=[]
    for page in extracted_pages:
        chunks=chunk_pdf(page["text"])
        for chunk_index,chunk in enumerate(chunks):
            processed_chunks.append({
                "page":page["page_number"],
                "chunk_index":chunk_index,
                "text":chunk
            })
    return {
        "document_name": file.filename,
        "total_pages": len(extracted_pages),
        "total_chunks": len(processed_chunks),
        "chunks": processed_chunks[:5]
    }