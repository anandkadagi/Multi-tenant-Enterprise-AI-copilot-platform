
def chunk_pdf(text:str,chunk_size:int=800, overLap:int =100):
    chunks=[]
    start=0
    while(start<len(text)):
        end=start+chunk_size
        chunk=text[start:end]
        chunks.append(chunk)
        start+=chunk_size-overLap
    return chunks    