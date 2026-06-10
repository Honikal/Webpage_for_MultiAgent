"""FastAPI server for AI-MA RAG Agent - Bridge between Next.js and Python backend."""

import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Add the parent directory to path so Python can find the 'src' module
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import from your partner's main.py (which is in the src folder)
from src.main import load_app, ask_rag, ask_orchestrator
from src.rag import rag_answer, print_sources

load_dotenv()

# Use lifespan instead of on_event (fixes the deprecation warning)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global vector_db, llm, orchestrator, callbacks
    print("Loading AI-MA RAG system...")
    try:
        vector_db, llm, orchestrator, callbacks = load_app(use_langfuse=False)
        print("✅ Sistema RAG cargado exitosamente!")
    except Exception as e:
        print(f"❌ Error cargando el sistema RAG: {e}")
    
    yield
    
    # Shutdown (if needed)
    print("Shutting down...")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="AI-MA RAG Agent API",
    description="API for interacting with the RAG orchestrator",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class QuestionRequest(BaseModel):
    question: str
    use_langfuse: Optional[bool] = False

class AnswerResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]
    success: bool

class HealthResponse(BaseModel):
    status: str
    vector_db_loaded: bool
    llm_configured: bool

# Global variables
vector_db = None
llm = None
orchestrator = None
callbacks = None

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint."""
    return {
        "message": "AI-MA RAG Agent API",
        "status": "running",
        "endpoints": "/ask, /health, /docs"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy" if orchestrator is not None else "loading",
        vector_db_loaded=vector_db is not None,
        llm_configured=llm is not None
    )

@app.post("/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest):
    """Ask a question to the RAG orchestrator."""
    if orchestrator is None:
        raise HTTPException(
            status_code=503, 
            detail="El sistema RAG no se ha inicializado. Por favor espere."
        )
    
    try:
        result = orchestrator.invoke({"question": request.question})
        
        sources = []
        if "sources" in result:
            for doc in result.get("sources", []):
                sources.append({
                    "content": doc.page_content[:300] + "..." if len(doc.page_content) > 300 else doc.page_content,
                    "metadata": doc.metadata
                })
        
        return AnswerResponse(
            answer=result["answer"],
            sources=sources,
            success=True
        )
        
    except Exception as e:
        print(f"Error processing question: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing question: {str(e)}"
        )

@app.post("/ask-rag", response_model=AnswerResponse)
async def ask_rag_only(request: QuestionRequest):
    """Force using only RAG (no direct LLM answer)."""
    if vector_db is None or llm is None:
        print("No se ha inicializado RAG System")
        raise HTTPException(
            status_code=503,
            detail="RAG system not initialized yet."
        )
    
    try:
        answer, docs = rag_answer(
            request.question, 
            vector_db, 
            llm, 
            callbacks=callbacks if request.use_langfuse else None
        )

        sources = []
        for doc in docs:
            sources.append({
                "content": doc.page_content[:300] + "..." if len(doc.page_content) > 300 else doc.page_content,
                "metadata": doc.metadata
            })
        
        return AnswerResponse(
            answer=answer,
            sources=sources,
            success=True
        )
        
    except Exception as e:
        print(f"Error in RAG-only endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing question: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run(
        "backend_caller:app",  # Changed from "main:app" to "backend_caller:app"
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )