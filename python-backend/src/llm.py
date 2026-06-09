"""Configuración del modelo de lenguaje."""

from __future__ import annotations

from langchain_openai import ChatOpenAI


def create_llm(model: str, api_key: str | None, temperature: float = 0):
    """Crea el LLM de OpenAI usado por el sistema."""
    if not api_key:
        raise ValueError("Falta OPENAI_API_KEY en las variables de entorno.")

    return ChatOpenAI(
        model=model,
        api_key=api_key,
        temperature=temperature,
    )
