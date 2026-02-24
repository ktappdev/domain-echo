# Domain Echo

An anonymous, real-time chat extension for Chrome that creates a unique chat room for every domain you visit.

## Overview

Domain Echo transforms web browsing into a social experience by providing instant, anonymous chat rooms tied to the domain you're currently viewing. When you visit `example.com`, you automatically join the "example.com" chat room where you can see other active users and engage in real-time conversations.

## Features

### Core Functionality
- **Domain-Based Rooms**: Each domain gets its own isolated chat room
- **Real-Time Communication**: Messages appear instantly using Convex real-time functions
- **Anonymous by Default**: No accounts, no logins—just chat
- **Live Presence**: See who else is currently viewing the same domain
- **Ephemeral Identity**: Random usernames generated for each browser session
- **Message History**: Recent messages are preserved for context

### Technical Highlights
- Built with vanilla JavaScript for minimal footprint
- Powered by Convex for real-time database and subscriptions
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
│   ├── config.js          # Convex configuration
│   ├── background.js      # Background service worker
│   ├── icon-generator.html # Tool to generate extension icons
│   └── SETUP.md           # Detailed setup instructions
└── Database Schema
    ├── messages table     # Stores chat messages
    └── presence table     # Tracks active users
```

## Quick Start

### 1. Database Setup
The Convex schema is already configured with:
- Real-time functions for chat messaging
- Presence tracking for active users

### 2. Configure Extension
1. Get your Convex deployment URL
2. Update `extension/config.js` with your Convex URL
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
- Messages are stored in Convex and broadcast instantly to all users in the same domain room
- Convex real-time subscriptions ensure zero-latency updates

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
- Convex authentication and authorization built-in
- Anonymous access only (no authentication required)
- Messages are public within their domain scope
- No cross-domain data sharing

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Convex (real-time database)
- **Extension**: Chrome Extension Manifest V3
- **Database**: Convex real-time database
- **Real-Time**: Convex subscriptions

## Development

### Prerequisites
- Node.js and npm (for the main project)
- Chrome browser
- Convex account

### Local Development
The extension runs entirely in the browser. To make changes:

1. Edit files in `extension/`
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Domain Echo extension
4. Click the extension icon to test changes

### Database Schema
Convex schema defines the data structure with proper validators and indexes. See `convex/schema.ts` for full schema details.

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
