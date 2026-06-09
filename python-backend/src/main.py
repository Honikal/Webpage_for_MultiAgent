"""Punto de entrada para probar el sistema RAG/orquestador."""

from __future__ import annotations

from src.config import settings
from src.embeddings import create_embedding_model
from src.llm import create_llm
from src.observability import configure_langfuse, create_langfuse_handler
from src.orchestrator import build_orchestrator
from src.rag import rag_answer, print_sources
from src.vector_store import load_vector_db


def load_app(use_langfuse: bool = False):
    """Carga embeddings, vector DB, LLM y opcionalmente Langfuse."""
    embedding_model = create_embedding_model(settings.embedding_model_name)
    vector_db = load_vector_db(embedding_model, settings.vector_db_dir)
    llm = create_llm(
        model=settings.llm_model,
        api_key=settings.openai_api_key,
        temperature=settings.temperature,
    )

    callbacks = None
    if use_langfuse:
        configure_langfuse(
            settings.langfuse_public_key,
            settings.langfuse_secret_key,
            settings.langfuse_host,
        )
        callbacks = [create_langfuse_handler()]

    orchestrator = build_orchestrator(vector_db, llm, callbacks)
    return vector_db, llm, orchestrator, callbacks


def ask_rag(question: str, use_langfuse: bool = False):
    """Hace una pregunta directamente al flujo RAG."""
    vector_db, llm, _orchestrator, callbacks = load_app(use_langfuse)
    answer, docs = rag_answer(question, vector_db, llm, callbacks=callbacks)
    print(answer)
    print("\nFuentes:")
    print_sources(docs)
    return answer, docs


def ask_orchestrator(question: str, use_langfuse: bool = False):
    """Hace una pregunta usando el router RAG/DIRECT."""
    _vector_db, _llm, orchestrator, _callbacks = load_app(use_langfuse)
    result = orchestrator.invoke({"question": question})
    print(result["answer"])
    return result


#if __name__ == "__main__":
#    ask_orchestrator("¿Qué es descenso de gradiente?")
