import fitz

def chunkPdf(file_path:str):
    doc=fitz.open(file_path)
    pages=[]
    for page_number,pages in enumerate(doc):
        pages.append(
            {
                "page_number":page_number,
                "text":pages.get_text()
            }
        )
    return pages    