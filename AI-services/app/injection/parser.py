import fitz

def parse_pdf(file_path:str):
    doc=fitz.open(file_path)
    pages=[]
    for i in range(len(doc)):
        page=doc.load_page(i)
        page_number=i+1
        pages.append(
            {
                "page_number":page_number,
                "text":page.get_text()
            }
        )
    doc.close()    
    return pages    