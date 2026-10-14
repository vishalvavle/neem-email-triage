import json
import os
import asyncio
from google.antigravity import Agent, LocalAgentConfig

# File path for the mock email database
EMAIL_DB_PATH = os.path.join(os.path.dirname(__file__), "mock_emails.json")

# ==========================================
# CUSTOM Python Tools for the Agent
# ==========================================

def list_unread_emails() -> str:
    """Lists all unread emails in the mock inbox.

    Returns:
        A JSON string containing the list of unread emails. Each email has:
        - id: Unique integer ID
        - sender: Sender's email address
        - subject: Email subject line
        - body: Content of the email
        - timestamp: Date and time received
    """
    if not os.path.exists(EMAIL_DB_PATH):
        return json.dumps({"error": "Email database not found."})
        
    try:
        with open(EMAIL_DB_PATH, "r") as f:
            emails = json.load(f)
        
        unread_emails = [e for e in emails if e.get("status") == "unread"]
        return json.dumps(unread_emails, indent=2)
    except Exception as e:
        return json.dumps({"error": f"Failed to read emails: {str(e)}"})


def update_email_classification(email_id: int, category: str, priority: str) -> str:
    """Classifies an email by setting its category and priority level.

    Args:
        email_id: The unique integer ID of the email.
        category: The category label, e.g., "Work", "Billing", "Spam", "Personal", "Newsletter".
        priority: The priority rating, must be either: "important", "normal", or "unimportant".
    """
    if not os.path.exists(EMAIL_DB_PATH):
        return f"Error: Email database at {EMAIL_DB_PATH} not found."

    try:
        with open(EMAIL_DB_PATH, "r") as f:
            emails = json.load(f)

        found = False
        for e in emails:
            if e.get("id") == email_id:
                e["category"] = category
                e["priority"] = priority
                found = True
                break

        if not found:
            return f"Error: Email with ID {email_id} not found."

        with open(EMAIL_DB_PATH, "w") as f:
            json.dump(emails, f, indent=2)

        return f"Successfully updated email {email_id}: category='{category}', priority='{priority}'."
    except Exception as e:
        return f"Error updating classification: {str(e)}"


def save_draft_reply(email_id: int, reply_text: str) -> str:
    """Saves a draft response for a specific email and marks it as read.

    Args:
        email_id: The unique integer ID of the email.
        reply_text: The drafted email body response text to save.
    """
    if not os.path.exists(EMAIL_DB_PATH):
        return "Error: Email database not found."

    try:
        with open(EMAIL_DB_PATH, "r") as f:
            emails = json.load(f)

        found = False
        for e in emails:
            if e.get("id") == email_id:
                e["draft_response"] = reply_text
                e["status"] = "read"  # Mark as read since we processed it
                found = True
                break

        if not found:
            return f"Error: Email with ID {email_id} not found."

        with open(EMAIL_DB_PATH, "w") as f:
            json.dump(emails, f, indent=2)

        return f"Successfully saved draft response for email {email_id} and marked as read."
    except Exception as e:
        return f"Error saving draft response: {str(e)}"


def archive_email(email_id: int) -> str:
    """Archives an email by updating its status to 'archived'.

    Args:
        email_id: The unique integer ID of the email.
    """
    if not os.path.exists(EMAIL_DB_PATH):
        return "Error: Email database not found."

    try:
        with open(EMAIL_DB_PATH, "r") as f:
            emails = json.load(f)

        found = False
        for e in emails:
            if e.get("id") == email_id:
                e["status"] = "archived"
                found = True
                break

        if not found:
            return f"Error: Email with ID {email_id} not found."

        with open(EMAIL_DB_PATH, "w") as f:
            json.dump(emails, f, indent=2)

        return f"Successfully archived email {email_id}."
    except Exception as e:
        return f"Error archiving email: {str(e)}"


# ==========================================
# Main Execution Loop
# ==========================================

async def main():
    print("Initializing Email Triage Agent...")

    # Configure the agent with custom tools and logic instructions
    system_instructions = (
        "You are an automated Email Triage Assistant.\n"
        "Your job is to read all unread emails in the inbox and process them one by one using the provided tools:\n"
        "1. Fetch the unread emails using 'list_unread_emails'.\n"
        "2. For each unread email, analyze its sender, subject, and content to classify it:\n"
        "   - Set its category (e.g. 'Work', 'Billing', 'Promo', 'Spam', 'Personal') and priority ('important', 'normal', 'unimportant') using 'update_email_classification'.\n"
        "   - If priority is 'unimportant' (such as marketing spams, low-value circulars, newsletter updates), immediately call 'archive_email' to archive it.\n"
        "   - If priority is 'important' (such as urgent client requests, critical complaints, server crashes, key billing actions), compose a polite, helpful, contextually appropriate draft response and save it using 'save_draft_reply'.\n"
        "   - If priority is 'normal', classify it and mark it as read by saving a simple acknowledgement or leaving it for manual review.\n"
        "Be diligent, process every single unread email, and output a summary of your actions."
    )

    config = LocalAgentConfig(
        tools=[
            list_unread_emails,
            update_email_classification,
            save_draft_reply,
            archive_email
        ],
        system_instructions=system_instructions
    )

    # Instantiate and execute the Agent
    async with Agent(config) as agent:
        print("\n--- Starting Email Processing Turn ---")
        response = await agent.chat(
            "Review all unread emails in the inbox. Categorize them, flag their priority, "
            "archive any unimportant ones, and draft replies for any important ones."
        )

        # Stream the reasoning thoughts and execution progress of the agent
        async for chunk in response:
            print(chunk, end="", flush=True)
        print()
        
    # Read the final state of the mock database for confirmation
    print("\n--- Final State of mock_emails.json ---")
    try:
        with open(EMAIL_DB_PATH, "r") as f:
            final_emails = json.load(f)
            print(json.dumps(final_emails, indent=2))
    except Exception as e:
        print(f"Error reading final database: {e}")

if __name__ == "__main__":
    asyncio.run(main())
