"""Orquestador con LangGraph para decidir entre RAG y respuesta directa."""

from __future__ import annotations

from langgraph.graph import END, StateGraph

from src.agent_state import AgentState
from src.rag import rag_answer


def router_node_factory(llm):
    """Crea el nodo router que decide si usar RAG o respuesta directa."""

    def router_node(state: AgentState):
        question = state["question"]
        prompt = f"""
Decide si la pregunta necesita consultar los apuntes.

Responde solamente:
RAG
o
DIRECT

Pregunta:
{question}
"""
        decision = llm.invoke(prompt).content.strip().upper()

        if decision not in {"RAG", "DIRECT"}:
            decision = "DIRECT"

        print(f"Orchestrator decidió: {decision}")
        return {"route": decision}

    return router_node


def rag_node_factory(vector_db, llm, callbacks: list | None = None):
    """Crea el nodo que responde usando RAG."""

    def rag_node(state: AgentState):
        answer, _docs = rag_answer(
            question=state["question"],
            vector_db=vector_db,
            llm=llm,
            callbacks=callbacks,
        )
        return {
            "answer": answer,
            "sources": _docs
        }

    return rag_node


def direct_node_factory(llm, callbacks: list | None = None):
    """Crea el nodo que responde directamente con el LLM."""

    def direct_node(state: AgentState):
        config = {"callbacks": callbacks} if callbacks else None
        response = llm.invoke(state["question"], config=config)
        return {
            "answer": response.content,
            "sources": []
        }

    return direct_node


def route_decision(state: AgentState) -> str:
    """Convierte la decisión del router en el nombre de la rama."""
    if state["route"] == "RAG":
        return "rag"
    return "direct"


def build_orchestrator(vector_db, llm, callbacks: list | None = None):
    """Compila el grafo completo del orquestador."""
    graph = StateGraph(AgentState)

    graph.add_node("router", router_node_factory(llm))
    graph.add_node("rag", rag_node_factory(vector_db, llm, callbacks))
    graph.add_node("direct", direct_node_factory(llm, callbacks))

    graph.set_entry_point("router")
    graph.add_conditional_edges(
        "router",
        route_decision,
        {
            "rag": "rag",
            "direct": "direct",
        },
    )
    graph.add_edge("rag", END)
    graph.add_edge("direct", END)

    return graph.compile()
