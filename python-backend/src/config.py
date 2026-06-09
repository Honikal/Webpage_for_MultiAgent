"""Configuración central del proyecto."""

from __future__ import annotations

import os
from dataclasses import dataclass
from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    """Variables de configuración usadas por la aplicación."""

    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
    pdf_folder: str = os.getenv(
        "PDF_FOLDER",
        "/content/drive/MyDrive/IA_TAREA_04_05/Apuntadores",
    )
    vector_db_dir: str = os.getenv("VECTOR_DB_DIR", "vector_db_v2")
    embedding_model_name: str = os.getenv(
        "EMBEDDING_MODEL_NAME",
        "sentence-transformers/all-MiniLM-L6-v2",
    )
    llm_model: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    temperature: float = float(os.getenv("LLM_TEMPERATURE", "0"))
    langfuse_public_key: str | None = os.getenv("LANGFUSE_PUBLIC_KEY")
    langfuse_secret_key: str | None = os.getenv("LANGFUSE_SECRET_KEY")
    langfuse_host: str = os.getenv("LANGFUSE_HOST", "https://us.cloud.langfuse.com")


settings = Settings()
