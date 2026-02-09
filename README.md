# Domain Echo

An anonymous, real-time chat extension for Chrome that creates a unique chat room for every domain you visit.

## Overview

Domain Echo transforms web browsing into a social experience by providing instant, anonymous chat rooms tied to the domain you're currently viewing. When you visit `example.com`, you automatically join the "example.com" chat room where you can see other active users and engage in real-time conversations.

## Features

### Core Functionality
- **Domain-Based Rooms**: Each domain gets its own isolated chat room
- **Real-Time Communication**: Messages appear instantly using Supabase Realtime
- **Anonymous by Default**: No accounts, no logins—just chat
- **Live Presence**: See who else is currently viewing the same domain
- **Ephemeral Identity**: Random usernames generated for each browser session
- **Message History**: Recent messages are preserved for context

### Technical Highlights
- Built with vanilla JavaScript for minimal footprint
- Powered by Supabase for real-time database and subscriptions
- Row Level Security (RLS) enabled for data protection
- Responsive and modern UI with smooth animations
- Automatic cleanup of stale presence data

## Project Structure

```
domain-echo/
├── extension/              # Chrome extension files
│   ├── manifest.json      # Extension configuration
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # Main application logic
│   ├── styles.css         # Styling
│   ├── config.js          # Supabase configuration
│   ├── background.js      # Background service worker
│   ├── icon-generator.html # Tool to generate extension icons
│   └── SETUP.md           # Detailed setup instructions
└── Database Schema
    ├── messages table     # Stores chat messages
    └── presence table     # Tracks active users
```

## Quick Start

### 1. Database Setup
The Supabase database schema is already configured with:
- `messages` table for chat history
- `presence` table for user tracking
- RLS policies for anonymous access

### 2. Configure Extension
1. Get your Supabase credentials (URL and Anon Key)
2. Update `extension/config.js` with your credentials
3. Generate icons using `extension/icon-generator.html`

### 3. Install Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension/` folder
4. Start chatting!

For detailed setup instructions, see `extension/SETUP.md`.

## How It Works

### Domain Detection
When you click the extension icon, it automatically detects the current tab's domain using Chrome's tabs API.

### Anonymous Identity
Each user gets a randomly generated username (e.g., "SwiftFox742") stored locally in browser storage.

### Real-Time Chat
- Messages are stored in Supabase and broadcast instantly to all users in the same domain room
- Supabase Realtime subscriptions ensure zero-latency updates

### Presence Tracking
- Users "check in" when they open the extension
- Heartbeat updates every 30 seconds
- Automatic cleanup removes inactive users after 60 seconds
- Real-time presence subscriptions show live user counts

## Use Cases

- **Content Discussion**: Discuss articles, videos, or content you're viewing
- **Community Building**: Create spontaneous communities around shared interests
- **Live Events**: Chat during live streams or events
- **Product Feedback**: Discuss products with other viewers on e-commerce sites
- **Learning Together**: Connect with others reading the same educational content

## Privacy & Security

### What's Collected
- Random usernames (stored locally only)
- Message content and timestamps
- Domain names
- Presence data (online/offline status)

### What's NOT Collected
- No email addresses
- No passwords
- No browsing history
- No personal information
- No tracking across domains

### Security Features
- Row Level Security (RLS) enabled on all tables
- Anonymous access only (no authentication required)
- Messages are public within their domain scope
- No cross-domain data sharing

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Extension**: Chrome Extension Manifest V3
- **Database**: PostgreSQL with RLS
- **Real-Time**: Supabase Realtime (WebSocket-based)

## Development

### Prerequisites
- Node.js and npm (for the main project)
- Chrome browser
- Supabase account

### Local Development
The extension runs entirely in the browser. To make changes:

1. Edit files in `extension/`
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Domain Echo extension
4. Click the extension icon to test changes

### Database Schema
Tables are created via Supabase migrations with proper indexes and RLS policies. See the migration file for full schema details.

## Limitations

- Only works on standard web pages (not chrome:// or extension pages)
- Requires active internet connection
- Message history limited to recent messages
- Presence requires periodic updates

## Future Enhancements

Potential features for future versions:
- Message reactions and threading
- User blocking and moderation tools
- Domain-specific settings and preferences
- Message formatting (markdown support)
- Notification system for popular rooms
- Statistics and analytics dashboard

## Contributing

Domain Echo is built as a demonstration project. Feel free to fork and modify for your own use cases.

## License

This project is provided as-is for educational and personal use.

## Support

For setup issues, refer to `extension/SETUP.md` for detailed troubleshooting steps.

---

**Happy chatting across the web!**
# domain-echo
