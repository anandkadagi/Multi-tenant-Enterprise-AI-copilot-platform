def createContext(chunks):
    context=""
    for i,chunk in enumerate(chunks,start=1):
        context+=f"""
Document:{i},
Content:{chunk['text']},
Page:{chunk['page']}
"""
    return context