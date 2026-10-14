import sys
from google.antigravity import Agent, LocalAgentConfig
from .tools import (
    set_active_database,
    list_unread_emails,
    update_email_classification,
    save_draft_reply,
    archive_email
)

async def run_triage_for_client(client_profile: dict):
    """Compiles system instructions and executes the email triage agent loop

    Args:
        client_profile: A compiled dictionary containing client config settings and FAQ text.
    """
    client_name = client_profile["client_name"]
    business_type = client_profile["business_type"]
    tone = client_profile["tone"]
    calendar_link = client_profile["calendar_link"]
    urgency_kws = ", ".join(client_profile.get("urgency_keywords", []))
    archive_kws = ", ".join(client_profile.get("archive_keywords", []))
    faq = client_profile["faq_content"]

    # 1. Dynamically build client-specific system instructions
    system_instructions = (
        f"You are the virtual Email Triage Assistant for '{client_name}', a '{business_type}' business.\n\n"
        f"YOUR TONE: You must compose all communications in a {tone} tone.\n\n"
        f"YOUR KNOWLEDGE BASE:\n"
        f"Use the following business details to answer questions, check rates, and draft replies. DO NOT make up rates, locations, or details outside this text:\n"
        f"\"\"\"\n{faq}\n\"\"\"\n\n"
        f"YOUR TRIAGE PROCESS:\n"
        f"Read all unread emails in the inbox using the provided tools, processing them step-by-step:\n"
        f"1. Call 'list_unread_emails' to retrieve unread messages.\n"
        f"2. For each email:\n"
        f"   - Classify its category and priority level using 'update_email_classification'.\n"
        f"     - PRIORITY GUIDELINES:\n"
        f"       - Mark as 'important' if the content matches any of these urgency topics: [{urgency_kws}], or is a customer service query requiring a callback.\n"
        f"       - Mark as 'unimportant' if it matches archive topics: [{archive_kws}], or is a clear marketing promo/junk email.\n"
        f"       - Otherwise, mark as 'normal'.\n"
        f"   - ACTIONS BY PRIORITY:\n"
        f"     - If 'unimportant': call 'archive_email' immediately to clean the inbox.\n"
        f"     - If 'important': compose a polite, helpful, contextually correct draft reply (including the scheduling link '{calendar_link}' if they are asking to book a service) and save it using 'save_draft_reply'.\n"
        f"     - If 'normal': classify it and mark it as read by saving an acknowledgment draft or leaving it based on context.\n\n"
        f"Execute your steps clearly and output a summary of your actions."
    )

    # 2. Configure the database file route for tools
    set_active_database(client_profile["client_id"])

    # 3. Initialize Agent Configuration
    config = LocalAgentConfig(
        tools=[
            list_unread_emails,
            update_email_classification,
            save_draft_reply,
            archive_email
        ],
        system_instructions=system_instructions
    )

    # 4. Start the Agent session and process the turn
    print(f"Loading Agent config for {client_name}...")
    async with Agent(config) as agent:
        print(f"Triage agent is analyzing {client_name}'s inbox...")
        response = await agent.chat(
            "Read all unread emails, classify them, archive the unimportant ones, "
            "and draft responses for the important ones."
        )

        async for chunk in response:
            print(chunk, end="", flush=True)
        print()
