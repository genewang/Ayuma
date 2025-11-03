import sys
import logging
from importlib import import_module

def test_import(module_name, class_name=None):
    try:
        module = import_module(module_name)
        if class_name:
            getattr(module, class_name)
        print(f"✅ Successfully imported {module_name}{'.' + class_name if class_name else ''}")
        return True
    except Exception as e:
        print(f"❌ Failed to import {module_name}{'.' + class_name if class_name else ''}: {e}")
        return False

def main():
    logging.basicConfig(level=logging.INFO)
    
    print("Testing imports...\n")
    
    # Test basic imports
    test_import("numpy")
    test_import("torch")
    test_import("sentence_transformers")
    test_import("chromadb")
    
    print("\nTesting application imports...\n")
    
    # Test application imports
    test_import("llm_coordinator", "LLMCoordinator")
    test_import("medical_rag", "MedicalRAGSystem")
    test_import("evidence_ranker", "EvidenceBasedRanker")
    test_import("main_controller", "MedicalGuidedPathController")
    
    print("\nTesting initialization...\n")
    
    # Test initialization
    try:
        from llm_coordinator import LLMCoordinator
        llm = LLMCoordinator()
        print("✅ Successfully initialized LLMCoordinator")
    except Exception as e:
        print(f"❌ Failed to initialize LLMCoordinator: {e}")
    
    try:
        from medical_rag import MedicalRAGSystem
        rag = MedicalRAGSystem()
        print("✅ Successfully initialized MedicalRAGSystem")
    except Exception as e:
        print(f"❌ Failed to initialize MedicalRAGSystem: {e}")
    
    try:
        from main_controller import MedicalGuidedPathController
        controller = MedicalGuidedPathController()
        print("✅ Successfully initialized MedicalGuidedPathController")
    except Exception as e:
        print(f"❌ Failed to initialize MedicalGuidedPathController: {e}")

if __name__ == "__main__":
    main()
