import os
import json

# Global reference to the database file of the currently triaged client
_active_db_path = None

def set_active_database(client_id: str):
    """Sets the active email database path for the tools at runtime."""
    global _active_db_path
    # Email DB will be stored in the root workspace folder as mock_emails_[client_id].json
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    _active_db_path = os.path.join(parent_dir, f"mock_emails_{client_id}.json")


def _read_db() -> list:
    if not _active_db_path or not os.path.exists(_active_db_path):
        raise FileNotFoundError(f"Active email database not configured or missing at: {_active_db_path}")
    with open(_active_db_path, "r") as f:
        return json.load(f)


def _write_db(data: list):
    if not _active_db_path:
        raise ValueError("Active email database path is not set.")
    with open(_active_db_path, "w") as f:
        json.dump(data, f, indent=2)


# ==========================================
# Agent Tools
# ==========================================

def list_unread_emails() -> str:
    """Lists all unread emails in the client's inbox.

    Returns:
        A JSON string containing the list of unread emails. Each email contains:
        - id: Unique integer ID of the email
        - sender: Email address of the sender
        - subject: Email subject line
        - body: Text body content of the email
        - timestamp: ISO timestamp of when it was received
    """
    try:
        emails = _read_db()
        unread = [e for e in emails if e.get("status") == "unread"]
        return json.dumps(unread, indent=2)
    except Exception as e:
        return json.dumps({"error": f"Failed to list unread emails: {str(e)}"})


def update_email_classification(email_id: int, category: str, priority: str) -> str:
    """Classifies an email by setting its category and priority level.

    Args:
        email_id: The unique integer ID of the email.
        category: The category label, e.g., 'Work', 'Billing', 'Promo', 'Spam', 'Personal', 'Newsletter'.
        priority: The priority rating, must be either: 'important', 'normal', or 'unimportant'.
    """
    try:
        emails = _read_db()
        found = False
        for e in emails:
            if e.get("id") == email_id:
                e["category"] = category
                e["priority"] = priority
                found = True
                break

        if not found:
            return f"Error: Email with ID {email_id} not found."

        _write_db(emails)
        return f"Successfully updated email {email_id}: category='{category}', priority='{priority}'."
    except Exception as e:
        return f"Error updating email classification: {str(e)}"


def save_draft_reply(email_id: int, reply_text: str) -> str:
    """Saves a draft reply for a specific email and marks it as read.

    Args:
        email_id: The unique integer ID of the email.
        reply_text: The drafted email body response text to save.
    """
    try:
        emails = _read_db()
        found = False
        for e in emails:
            if e.get("id") == email_id:
                e["draft_response"] = reply_text
                e["status"] = "read"  # Update status to read as a reply is drafted
                found = True
                break

        if not found:
            return f"Error: Email with ID {email_id} not found."

        _write_db(emails)
        return f"Successfully saved draft reply for email {email_id} and marked as read."
    except Exception as e:
        return f"Error saving draft reply: {str(e)}"


def archive_email(email_id: int) -> str:
    """Archives an email by updating its status to 'archived'.

    Args:
        email_id: The unique integer ID of the email.
    """
    try:
        emails = _read_db()
        found = False
        for e in emails:
            if e.get("id") == email_id:
                e["status"] = "archived"
                found = True
                break

        if not found:
            return f"Error: Email with ID {email_id} not found."

        _write_db(emails)
        return f"Successfully archived email {email_id}."
    except Exception as e:
        return f"Error archiving email: {str(e)}"
