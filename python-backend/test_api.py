"""Simple test script to verify the API works."""

import requests
import json
import time

def test_health():
    """Test the health endpoint."""
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"Health check status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            return True
    except Exception as e:
        print(f"Health check failed: {e}")
        return False
    return False

def test_ask():
    """Test the ask endpoint."""
    question = "¿Qué es el descenso de gradiente?"
    
    try:
        print(f"\nSending question: {question}")
        response = requests.post(
            "http://localhost:8000/ask",
            json={"question": question, "use_langfuse": False},
            timeout=60  # 60 second timeout for LLM response
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success!")
            print(f"Answer: {data['answer'][:300]}...")
            print(f"Sources found: {len(data['sources'])}")
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
            return False
    except requests.exceptions.Timeout:
        print("❌ Request timed out. The LLM might be taking too long.")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Testing AI-MA RAG Agent API")
    print("=" * 50)
    
    # Wait a bit for the server to start if running
    time.sleep(2)
    
    if test_health():
        print("\n✅ Server is running!")
    else:
        print("\n❌ Server is not responding. Make sure it's running.")
        exit(1)
    
    if test_ask():
        print("\n✅ Ask endpoint works!")
    else:
        print("\n❌ Ask endpoint failed.")
        exit(1)