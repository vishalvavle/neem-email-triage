import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLIENTS_DIR = os.path.join(BASE_DIR, "clients")
DATA_DIR = os.path.join(BASE_DIR, "client_data")

def load_client_profile(client_id: str) -> dict:
    """Loads and compiles a client configuration profile and FAQ knowledge base.

    Args:
        client_id: The identifier string of the client (e.g. 'plumber', 'dentist').

    Returns:
        A dictionary containing the combined client profile values and the FAQ content.
    """
    # Prevent basic directory traversal
    clean_id = os.path.basename(client_id).replace("..", "")
    
    config_path = os.path.join(CLIENTS_DIR, f"{clean_id}.json")
    faq_path = os.path.join(DATA_DIR, f"{clean_id}_faq.md")

    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Configuration profile not found for client '{clean_id}' at {config_path}")

    # Load JSON Configuration
    with open(config_path, "r") as f:
        profile = json.load(f)

    # Load FAQ Knowledge Base
    if os.path.exists(faq_path):
        with open(faq_path, "r") as f:
            profile["faq_content"] = f.read()
    else:
        profile["faq_content"] = "No additional business knowledge provided."

    profile["client_id"] = clean_id
    return profile
