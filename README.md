# Autotask Helper

**Autotask Helper** is a Chrome Extension designed to improve the daily workflow for Autotask users. It provides tools to quickly generate clean, shareable URLs for tickets and improves navigation by redirecting legacy links.

## Features

### 1. Copy Clean Ticket Links
Autotask URLs often contain session IDs or unnecessary parameters. This extension allows you to generate short, clean URLs (e.g., `https://.../TicketDetail.mvc?ticketId=123`) that are perfect for sharing in emails or chat.

*   **Context Menu**: Right-click anywhere on a Ticket Detail page and select **"Autotask - Copy Clean Link"**.
*   **Grid Button**: A **"Copy Clean Ticket URL"** button is automatically added to the menu within Autotask's ticket grids.

### 2. Smart Redirects
Automatically improves navigation speed by redirecting legacy `ExecuteCommand.aspx` links (often found in email notifications) directly to the modern `TicketDetail.mvc` page, skipping intermediate redirects.

### 3. Non-Intrusive Notifications
Uses subtle "toast" notifications to confirm when actions are successful, keeping your workflow uninterrupted.

## Installation

1.  Download or clone this repository.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Toggle **Developer mode** in the top right corner.
4.  Click **Load unpacked** and select the directory containing this extension.

## Configuration

You can toggle specific features on or off in the Extension Options:
*   Right-click the extension icon and select **Options**.
*   **Enable Redirect Rule**: Toggles the automatic URL redirection.
*   **Enable Grid Button**: Toggles the injected "Copy Clean Ticket URL" button in lists.

## Privacy

This extension respects your privacy and **does not collect any user data**. It runs entirely locally on your machine. See [PRIVACYPOLICY.md](PRIVACYPOLICY.md) for details.
