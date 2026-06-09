"""Carga de documentos PDF desde una carpeta."""

from __future__ import annotations

import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document


def list_pdf_files(pdf_folder: str) -> list[str]:
    """Devuelve todos los archivos PDF de una carpeta."""
    if not os.path.isdir(pdf_folder):
        raise FileNotFoundError(f"No existe la carpeta de PDFs: {pdf_folder}")

    return [
        os.path.join(pdf_folder, file_name)
        for file_name in os.listdir(pdf_folder)
        if file_name.lower().endswith(".pdf")
    ]


def load_pdfs(pdf_files: list[str]) -> list[Document]:
    """Carga el contenido de varios PDFs con PyPDFLoader."""
    documents: list[Document] = []

    for pdf_file in pdf_files:
        loader = PyPDFLoader(pdf_file)
        docs = loader.load()
        documents.extend(docs)

    add_file_name_metadata(documents)
    return documents


def add_file_name_metadata(documents: list[Document]) -> None:
    """Agrega el nombre del archivo al metadata de cada documento."""
    for doc in documents:
        source = doc.metadata.get("source", "")
        doc.metadata["file_name"] = os.path.basename(source)
