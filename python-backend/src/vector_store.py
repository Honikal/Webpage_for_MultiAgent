"""Creación, carga y consulta de la base vectorial Chroma."""

from __future__ import annotations

import os
import shutil
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document


def create_vector_db(
    chunks: list[Document],
    embedding_model,
    persist_directory: str,
    reset: bool = False,
) -> Chroma:
    """Crea una base vectorial Chroma a partir de chunks."""
    if reset and os.path.exists(persist_directory):
        shutil.rmtree(persist_directory)

    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory=persist_directory,
    )
    vector_db.persist()
    return vector_db


def load_vector_db(embedding_model, persist_directory: str) -> Chroma:
    """Carga una base vectorial Chroma ya creada."""
    return Chroma(
        persist_directory=persist_directory,
        embedding_function=embedding_model,
    )


def similarity_search(vector_db: Chroma, query: str, k: int = 3) -> list[Document]:
    """Busca documentos similares a una consulta."""
    return vector_db.similarity_search(query, k=k)
