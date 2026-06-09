"""Configuración del modelo de embeddings."""

from __future__ import annotations

from langchain_community.embeddings import HuggingFaceEmbeddings


def create_embedding_model(model_name: str):
    """Crea el modelo de embeddings usado por Chroma."""
    return HuggingFaceEmbeddings(model_name=model_name)
