def call_LLM(client,prompt):
    response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
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
        ]
    )

    answer = response.choices[0].message.content
    return answer


