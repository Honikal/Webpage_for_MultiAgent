"""Configuración central del proyecto."""

from __future__ import annotations

import os
from pathlib import Path
from dataclasses import dataclass
from dotenv import load_dotenv

# Primero, buscamos el directorio raíz para extraer el .env
# Este archivo se encuentra en //pythonbackend/src/
# De modo que ocuparemos bajar 2 niveles para llegar a raíz
current_file = Path(__file__).resolve()  #Conseguimos el path absoluto a este archivo
project_root = current_file.parent.parent.parent  #Bajamos 3 niveles

#Cargamos el archivo .env desde el project_root
env_path = project_root / ".env"
load_dotenv(dotenv_path=env_path)

# Resolver rutas relativas al project_root
def get_absolute_path(relative_path: str) -> str:
    """Convierte una ruta relativa en absoluta desde project_root."""
    path_obj = Path(relative_path)
    if path_obj.is_absolute():
        return str(path_obj)
    else:
        return str(project_root / path_obj)

# Obtener valores raw del .env y las convertimos en valores absolutos
pdf_folder_raw = os.getenv("PDF_FOLDER")
pdf_folder = get_absolute_path(pdf_folder_raw)

@dataclass(frozen=True)
class Settings:
    """Variables de configuración usadas por la aplicación."""

    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
    pdf_folder: str = pdf_folder
    vector_db_dir: str = os.getenv("VECTOR_DB_DIR")
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

