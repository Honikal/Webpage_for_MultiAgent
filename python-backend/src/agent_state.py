"""Estado compartido del agente LangGraph."""

from __future__ import annotations

from typing import TypedDict


class AgentState(TypedDict):
    question: str
    answer: str
    route: str
