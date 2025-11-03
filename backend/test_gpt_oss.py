import asyncio
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from backend.llm_coordinator import LLMCoordinator, ModelType

async def test_gpt_oss():
    print("Initializing LLM Coordinator...")
    
    # Debug: Check if API key is loaded
    import os
    api_key = os.getenv('OPENAI_API_KEY')
    print(f"DEBUG: API Key loaded: {'Yes' if api_key else 'No'}")
    if api_key:
        print(f"DEBUG: API Key starts with: {api_key[:5]}...{api_key[-4:] if len(api_key) > 9 else ''}")
    
    coordinator = LLMCoordinator()
    
    # Test queries
    test_queries = [
        "What is the recommended first-line treatment for HER2-positive breast cancer?",
        "Explain the mechanism of action of trastuzumab",
        "What are the common side effects of chemotherapy?"
    ]
    
    for query in test_queries:
        print(f"\n{'='*80}")
        print(f"TESTING QUERY: {query}")
        print(f"{'='*80}")
        
        try:
            # Test routing
            print("\n[1/3] Testing model routing...")
            routing = await coordinator.route_query(query)
            print(f"✅ Model selected: {routing['model'].value}")
            print(f"   Reason: {routing['reason']}")
            print(f"   Complexity: {routing['complexity'].model_dump()}")
            
            # Test execution
            print("\n[2/3] Executing query...")
            response = await coordinator.execute_query(query)
            
            # Print results
            print("\n[3/3] Response received:")
            if isinstance(response, dict):
                print(f"✅ Model used: {response.get('model', 'Unknown')}")
                print("\nResponse content:")
                print("-" * 40)
                print(response.get('content', 'No content'))
                print("-" * 40)
                
                if 'error' in response:
                    print(f"\n❌ Error: {response['error']}")
            else:
                print(f"⚠️ Unexpected response format: {type(response)}")
                print(response)
                
        except Exception as e:
            print(f"\n❌ Error processing query: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    print("Starting GPT-OSS 20B Integration Test")
    print("=" * 60)
    asyncio.run(test_gpt_oss())
    print("\nTest completed.")
