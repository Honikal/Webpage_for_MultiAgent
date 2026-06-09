"""Script para construir la base vectorial desde los PDFs."""

from __future__ import annotations

from src.chunking import split_documents
from src.config import settings
from src.embeddings import create_embedding_model
from src.pdf_loader import list_pdf_files, load_pdfs
from src.vector_store import create_vector_db


def build_index(reset: bool = True):
    """Carga PDFs, genera chunks y crea la base Chroma."""
    pdf_files = list_pdf_files(settings.pdf_folder)
    documents = load_pdfs(pdf_files)
    chunks = split_documents(documents)
    embedding_model = create_embedding_model(settings.embedding_model_name)

    vector_db = create_vector_db(
        chunks=chunks,
        embedding_model=embedding_model,
        persist_directory=settings.vector_db_dir,
        reset=reset,
    )

    print(f"PDFs cargados: {len(pdf_files)}")
    print(f"Documentos cargados: {len(documents)}")
    print(f"Chunks creados: {len(chunks)}")
    print("Base vectorial creada correctamente")

    return vector_db


if __name__ == "__main__":
    build_index(reset=True)
