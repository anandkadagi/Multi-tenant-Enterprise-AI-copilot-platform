
# def chunk_pdf(text:str,chunk_size:int=800, overLap:int =100):
#     chunks=[]
#     start=0
#     while(start<len(text)):
#         end=start+chunk_size
#         chunk=text[start:end]
#         chunks.append(chunk)
#         start+=chunk_size-overLap
#     return chunks    
from typing import List, Dict


def chunk_text(
    text: str,
    chunk_size: int = 800,
    overlap: int = 100,
    preserve_words: bool = True
) -> List[Dict]:

    if not text:
        return []

    if chunk_size <= 0:
        raise ValueError(
            "chunk_size must be > 0"
        )

    if overlap < 0:
        raise ValueError(
            "overlap cannot be negative"
        )

    if overlap >= chunk_size:
        raise ValueError(
            "overlap must be smaller than chunk_size"
        )

    chunks = []

    start = 0
    chunk_id = 0

    text = text.strip()

    while start < len(text):

        end = min(
            start + chunk_size,
            len(text)
        )

        if (
            preserve_words
            and end < len(text)
        ):

            while (
                end > start
                and not text[end].isspace()
            ):
                end -= 1

            if end == start:
                end = min(
                    start + chunk_size,
                    len(text)
                )

        chunk = text[
            start:end
        ].strip()

        if chunk:

            chunks.append(
                {
                    "chunk_id":
                    chunk_id,

                    "text":
                    chunk,

                    "char_start":
                    start,

                    "char_end":
                    end,

                    "length":
                    len(chunk)
                }
            )

            chunk_id += 1

        start = (
            end - overlap
        )

    return chunks