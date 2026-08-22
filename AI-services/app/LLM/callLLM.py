def call_LLM(client,prompt):
    response = client.chat.completions.create(
    # model="llama-3.3-70b-versatile",
    model="openai/gpt-oss-120b",
    temperature=0,
    messages=[
        {
            "role": "system",
            "content": "Answer only from the provided enterprise documents. If the answer is not present, say you don't know."
        },
        {
            "role": "user",
            "content": prompt
        }
        ],
        stream=True 
    )

    
    for chunk in response:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta

