def generate_citations(chunks):

    citations = []

    seen = set()

    for chunk in chunks:

        key = (chunk["document_id"], chunk["page"])

        if key not in seen:
            citations.append({
                "document": chunk["document_id"],
                "page": chunk["page"]
            })

            seen.add(key)

    return citations