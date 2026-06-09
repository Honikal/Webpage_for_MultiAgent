# Tarea 4 y 5 - Proyecto modularizado

Este proyecto separa el notebook original en archivos `.py` por responsabilidad.

## Estructura

```text
src/
  config.py          # Variables de configuración
  pdf_loader.py      # Carga de PDFs
  chunking.py        # División en chunks
  embeddings.py      # Modelo de embeddings
  vector_store.py    # Creación/carga de Chroma
  llm.py             # Configuración del LLM
  rag.py             # Funciones RAG
  agent_state.py     # Estado del agente
  orchestrator.py    # Router con LangGraph
  observability.py   # Langfuse opcional
  build_index.py     # Script para crear la base vectorial
  main.py            # Pruebas principales
```

## Creación de entorno virtual
```bash
python -m venv venv
```

### Activate the virtual environment
#### On Windows:
venv\Scripts\activate
#### On Mac/Linux:
source venv/bin/activate

## Instalación

```bash
pip install -r requirements.txt
```

Checamos que estén instalados con:
```bash
pip list
```


## Variables de entorno

Copia `.env.example` como `.env` y coloca tus claves reales:

```bash
cp .env.example .env
```

No coloques claves API directamente en el código.

## Uso en Colab

Primero monta Drive:

```python
from google.colab import drive
drive.mount('/content/drive')
```

Luego instala dependencias y construye la base vectorial:

```bash
python -m src.build_index
```

Para probar el orquestador:

```bash
python -m src.main
```

También puedes usarlo desde una celda:

```python
from src.main import ask_rag, ask_orchestrator

ask_rag("¿Qué es descenso de gradiente?")
ask_orchestrator("¿Qué es una red neuronal?")
```
