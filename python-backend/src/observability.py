"""Integración opcional con Langfuse."""

from __future__ import annotations

import os


def configure_langfuse(public_key: str | None, secret_key: str | None, host: str) -> None:
    """Configura variables de entorno para Langfuse."""
    if public_key:
        os.environ["LANGFUSE_PUBLIC_KEY"] = public_key
    if secret_key:
        os.environ["LANGFUSE_SECRET_KEY"] = secret_key
    if host:
        os.environ["LANGFUSE_HOST"] = host


def create_langfuse_handler():
    """Crea el CallbackHandler de Langfuse si la librería está disponible."""
    try:
        from langfuse.langchain import CallbackHandler
    except ImportError as exc:
        raise ImportError(
            "No se pudo importar CallbackHandler. Revisa la versión de langfuse instalada."
        ) from exc

    return CallbackHandler()
