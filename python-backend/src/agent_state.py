"""Estado compartido del agente LangGraph."""

from __future__ import annotations

from typing import TypedDict
from langchain_core.documents import Document

class AgentState(TypedDict):
    question: str
    answer: str
    route: str
    sources: list[Document]