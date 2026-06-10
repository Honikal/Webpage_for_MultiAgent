"""Funciones principales de RAG."""

from __future__ import annotations

from langchain_community.vectorstores import Chroma


def build_context(docs) -> str:
    """Une el contenido de los documentos recuperados."""
    return "\n\n".join(doc.page_content for doc in docs)


def build_rag_prompt(question: str, context: str) -> str:
    """Construye el prompt usado para responder con base en los apuntes."""
    return f"""
Responde únicamente utilizando la información proporcionada.

Contexto:
{context}

Pregunta:
{question}
"""


def rag_answer(
    question: str,
    vector_db: Chroma,
    llm,
    k: int = 4,
    callbacks: list | None = None,
) -> tuple[str, list]:
    """Responde una pregunta usando recuperación semántica + LLM."""
    docs = vector_db.similarity_search(question, k=k)
    print_sources(docs)
    context = build_context(docs)
    prompt = build_rag_prompt(question, context)

    config = {"callbacks": callbacks} if callbacks else None
    response = llm.invoke(prompt, config=config)

    return response.content, docs


def print_sources(docs) -> None:
    """Imprime las fuentes usadas para la respuesta."""
    for doc in docs:
        print(doc.metadata.get("file_name", "Fuente desconocida"))
