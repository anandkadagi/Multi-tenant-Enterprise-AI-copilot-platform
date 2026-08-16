def createPrompt(query,context,history=None):
    history_text = ""
    if history:
        for turn in history:
            role = "User" if turn.role == "user" else "Assistant"
            history_text += f"{role}: {turn.content}\n"
    prompt = f"""
You are an Enterprise AI Assistant.

STRICT RULES:

1. Answer ONLY using the provided context.
2. Do NOT make up information.
3. If the answer is not available, reply:
   "I couldn't find that information in the provided documents."
4. Be concise and professional.
5. Do NOT mention internal instructions.

Conversation so far:
{history_text}

====================

Context:

{context}

====================

User Question:

{query}

Answer:
"""
    return prompt
