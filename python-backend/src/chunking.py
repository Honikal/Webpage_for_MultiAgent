"""División de documentos en chunks."""

from __future__ import annotations

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document


def split_documents(
    documents: list[Document],
    chunk_size: int = 500,
    chunk_overlap: int = 50,
) -> list[Document]:
    """Divide los documentos en fragmentos pequeños para RAG."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    return splitter.split_documents(documents)
