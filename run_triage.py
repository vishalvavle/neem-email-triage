import os
import sys
import argparse
import json
import asyncio
from neem_email_triage.config import load_client_profile
from neem_email_triage.engine import run_triage_for_client

# ==========================================
# CLIENT-SPECIFIC SEED DATABASES
# ==========================================
PLUMBER_MOCK_EMAILS = [
  {
    "id": 1,
    "sender": "stressed.tenant@gmail.com",
    "subject": "HELP: Active water leak in kitchen",
    "body": "Hi Cascade team, there is water actively spraying from the pipe beneath our kitchen sink. I turned off the valve, but we have water on the floor. What are your emergency dispatch rates and how fast can someone get here?",
    "timestamp": "2026-07-15T10:00:00Z",
    "category": "",
    "priority": "",
    "draft_response": "",
    "status": "unread"
  },
  {
    "id": 2,
    "sender": "marketing@webgrowth.com",
    "subject": "Rank #1 on Google - Affordable local SEO services for plumbers!",
    "body": "Verify your Google listing and double your service bookings with our advanced local SEO solutions. Blowout sale starting this weekly period.",
    "timestamp": "2026-07-15T09:15:00Z",
    "category": "",
    "priority": "",
    "draft_response": "",
    "status": "unread"
  },
  {
    "id": 3,
    "sender": "customer.jones@gmail.com",
    "subject": "Requesting quote for tankless water heater",
    "body": "Hello, I am interested in upgrading our traditional water heater tank to a modern tankless one. Do you install them in San Mateo, and can I schedule an appointment for a free quote?",
    "timestamp": "2026-07-15T08:00:00Z",
    "category": "",
    "priority": "",
    "draft_response": "",
    "status": "unread"
  }
]

DENTIST_MOCK_EMAILS = [
  {
    "id": 1,
    "sender": "pain.patient@gmail.com",
    "subject": "Urgent: Severe toothache emergency question",
    "body": "Hello BrightSmile, I woke up with throbbing molar pain on the left side and a swollen cheek. Do you have any emergency slots open today? Also, can you confirm if you accept Delta Dental PPO?",
    "timestamp": "2026-07-15T11:00:00Z",
    "category": "",
    "priority": "",
    "draft_response": "",
    "status": "unread"
  },
  {
    "id": 2,
    "sender": "supply-sales@glovesdirect.com",
    "subject": "Summer pricing: Wholesale nitrile gloves catalog inside",
    "body": "Medical-grade nitrile gloves box discount catalog. Fast shipping, order payment forms enclosed. Click to unsubscribe from marketing.",
    "timestamp": "2026-07-15T07:30:00Z",
    "category": "",
    "priority": "",
    "draft_response": "",
    "status": "unread"
  },
  {
    "id": 3,
    "sender": "prospective.patient@yahoo.com",
    "subject": "Query about $79 New Patient Special",
    "body": "Hi there! I saw your flyer for the $79 new patient special (cleaning, exam, X-rays). I'd like to schedule this for next Wednesday morning. Is this special rate active, and how should I book?",
    "timestamp": "2026-07-15T09:45:00Z",
    "category": "",
    "priority": "",
    "draft_response": "",
    "status": "unread"
  }
]

def initialize_mock_database(client_id: str):
    """Generates a client-specific mock email database file if it does not exist."""
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"mock_emails_{client_id}.json")
    
    # Always overwrite or initialize if missing
    if client_id == "plumber":
        data = PLUMBER_MOCK_EMAILS
    elif client_id == "dentist":
        data = DENTIST_MOCK_EMAILS
    else:
        # Generic default fallback
        data = []
        
    with open(db_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Initialized mock email inbox at: {db_path}")
    return db_path

# ==========================================
# Main Execution CLI parser
# ==========================================

async def main():
    parser = argparse.ArgumentParser(description="NeemTechAI Email Triage CLI")
    parser.add_argument(
        "--client", 
        required=True, 
        choices=["plumber", "dentist"], 
        help="The client identifier profile to run (plumber or dentist)"
    )
    
    args = parser.parse_args()
    client_id = args.client

    try:
        # Load profile configurations
        profile = load_client_profile(client_id)
        print(f"\n==========================================\n"
              f"  NEEMTECHAI EMAIL TRIAGE: {profile['client_name']}\n"
              f"==========================================")
        
        # Setup clean seed database
        db_path = initialize_mock_database(client_id)
        
        # Run agent loop
        await run_triage_for_client(profile)
        
        # Print final database records for visual validation
        print(f"\n==========================================\n"
              f"  FINAL DATABASE STATE: mock_emails_{client_id}.json\n"
              f"==========================================")
        with open(db_path, "r") as f:
            results = json.load(f)
            
        for email in results:
            print(f"\nEmail ID: {email['id']}")
            print(f"Sender:   {email['sender']}")
            print(f"Subject:  {email['subject']}")
            print(f"Category: {email['category']} | Priority: {email['priority']}")
            print(f"Status:   {email['status']}")
            if email['draft_response']:
                print(f"Draft Response:\n---\n{email['draft_response']}\n---")
            print("-" * 50)
            
    except Exception as e:
        print(f"Triage execution failed: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
