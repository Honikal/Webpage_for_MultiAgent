"""Debug script to check PDF loading process."""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.config import settings

print("=" * 60)
print("Debugging PDF Loading")
print("=" * 60)

print(f"\nPDF Folder from settings: {settings.pdf_folder}")
print(f"Does folder exist? {Path(settings.pdf_folder).exists()}")

if Path(settings.pdf_folder).exists():
    print(f"\nFiles in folder:")
    for file in Path(settings.pdf_folder).iterdir():
        if file.suffix.lower() == '.pdf':
            print(f"{file.name}")
        else:
            print(f"{file.name} (not PDF)")

# Try to list PDF files
try:
    from src.pdf_loader import list_pdf_files
    pdf_files = list_pdf_files(settings.pdf_folder)
    print(f"\nPDF files found: {len(pdf_files)}")
    for pdf in pdf_files:
        print(f"   - {Path(pdf).name}")
except Exception as e:
    print(f"\nError listing PDFs: {e}")

# Try to load PDFs
if pdf_files:
    try:
        from src.pdf_loader import load_pdfs
        documents = load_pdfs(pdf_files)
        print(f"\nDocuments loaded: {len(documents)} pages")
        
        # Try chunking
        from src.chunking import split_documents
        chunks = split_documents(documents)
        print(f"Chunks created: {len(chunks)}")
        
    except Exception as e:
        print(f"\nError loading PDFs: {e}")
else:
    print("\nNo PDF files found to load!")
    print(f"\nPlease add PDF files to: {Path(settings.pdf_folder).absolute()}")