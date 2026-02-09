# Domain Echo - Setup Guide

Domain Echo is a Chrome extension that creates anonymous, real-time chat rooms for every domain you visit.

## Prerequisites

1. A Supabase account and project
2. Chrome or any Chromium-based browser

## Setup Steps

### 1. Configure Supabase

The database schema has already been created with the following tables:
- `messages` - Stores chat messages for each domain
- `presence` - Tracks active users in each domain

### 2. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - Project URL (SUPABASE_URL)
   - Anon/Public Key (SUPABASE_ANON_KEY)

### 3. Update Configuration

Edit `extension/config.js` and replace the placeholders:

```javascript
const CONFIG = {
  SUPABASE_URL: 'your-project-url.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key-here'
};
```

### 4. Create Extension Icons

You need to create three icon files (16x16, 48x48, and 128x128 pixels):
- `icon16.png`
- `icon48.png`
- `icon128.png`

You can use any design tool or even screenshot a chat bubble icon. Place these files in the `extension/` directory.

Quick option: Use an online favicon generator with a chat bubble emoji or icon.

### 5. Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `extension/` folder
5. The Domain Echo icon should now appear in your extensions toolbar

## Usage

1. Click the Domain Echo icon in your browser toolbar
2. The extension will automatically detect the current domain
3. You'll see:
   - The current domain name
   - Number of users online
   - Recent messages in the room
4. Type a message and press Enter or click Send
5. Switch to a different domain to join that domain's chat room

## Features

- **Anonymous**: No login required, random usernames generated
- **Real-time**: Messages appear instantly for all users
- **Domain-based**: Each domain has its own isolated chat room
- **Ephemeral**: Messages persist but users come and go
- **Presence tracking**: See who's online in the current domain

## Security Notes

- All messages are public within their domain room
- Row Level Security (RLS) is enabled with anonymous access
- No personal data is collected
- Usernames are randomly generated and stored locally

## Troubleshooting

**Extension doesn't load:**
- Make sure all icon files are present
- Check that config.js has valid Supabase credentials

**Messages not appearing:**
- Check browser console for errors
- Verify Supabase credentials are correct
- Ensure RLS policies are properly set up

**Can't send messages:**
- Check that you're on a valid domain (not chrome:// or extension pages)
- Verify Supabase connection in the console

## Privacy

Domain Echo does not collect or store any personal information. All chat is anonymous and tied to the domain you're visiting. The extension only tracks:
- Random usernames (stored locally)
- Message content
- Domain names
- Timestamps

Enjoy chatting!
