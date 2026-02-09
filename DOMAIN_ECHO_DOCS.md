# Domain Echo - Complete Setup & Documentation

## Table of Contents
1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Configuration](#configuration)
5. [How It Works](#how-it-works)
6. [Database Schema](#database-schema)
7. [Extension Structure](#extension-structure)
8. [Real-Time Features](#real-time-features)
9. [User Flow](#user-flow)
10. [Troubleshooting](#troubleshooting)
11. [Customization](#customization)
12. [Security & Privacy](#security--privacy)

---

## Quick Start

### For the Impatient
1. Create a Supabase project (free tier works)
2. Get your Supabase URL and Anon Key from project settings
3. Update `extension/config.js` with your credentials
4. Generate extension icons
5. Load unpacked extension in Chrome
6. Start chatting!

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Chrome Browser                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Extension Popup (popup.html)                │  │
│  │  • 400x600px popup when you click the extension icon  │  │
│  │  • Real-time chat interface                           │  │
│  │  • User presence list                                 │  │
│  │  • Message input field                                │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↕                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │    popup.js (Main Application Logic)                  │  │
│  │  • Domain detection                                   │  │
│  │  • Username generation & storage                      │  │
│  │  • Message sending/receiving                          │  │
│  │  • Presence tracking                                  │  │
│  │  • Real-time subscriptions                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↕                                    │
│        chrome.storage.local (Browser Storage)                │
│        • Persisted username                                  │
│                          ↕                                    │
│        Chrome Tabs API                                       │
│        • Get current tab URL                                 │
│        • Extract domain                                      │
└─────────────────────────────────────────────────────────────┘
                          ↕ (HTTPS)
┌─────────────────────────────────────────────────────────────┐
│                  Supabase (Backend)                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │        PostgreSQL Database                          │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │ messages table                             │    │    │
│  │  │ • id, domain, content, username, created_at│   │    │
│  │  └────────────────────────────────────────────┘    │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │ presence table                             │    │    │
│  │  │ • id, domain, username, session_id, last_seen│  │    │
│  │  └────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↕                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │        Realtime (WebSocket)                         │    │
│  │  • Broadcasting new messages to subscribers         │    │
│  │  • Broadcasting presence changes                    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Key Components
- **Extension Popup**: The UI users see (400x600px window)
- **popup.js**: All the logic - handles messaging, presence, subscriptions
- **styles.css**: Dark theme UI with blue accents
- **config.js**: Supabase credentials (YOU must configure this)
- **Supabase Backend**: Stores messages and presence data, broadcasts updates

---

## Step-by-Step Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create an account or sign in
4. Create a new organization (or use default)
5. Create a new project:
   - **Project Name**: `domain-echo` (or any name)
   - **Database Password**: Create a strong password (you won't need it)
   - **Region**: Choose closest to you
   - Click "Create new project" and wait 2-3 minutes for setup

### Step 2: Get Your Supabase Credentials

1. In Supabase dashboard, go to **Project Settings** → **API**
2. You'll see two keys:
   - **Project URL**: Looks like `https://xxxxx.supabase.co`
   - **Anon Key**: A long string of characters
3. Copy both - you'll need them next

**Why two keys?**
- **Project URL**: Tells Supabase which project to connect to
- **Anon Key**: Authenticates anonymous users (with RLS restrictions)

### Step 3: Update config.js

1. Open `extension/config.js`
2. You'll see:
```javascript
const CONFIG = {
  SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE'
};
```

3. Replace the placeholder values with your real credentials:
```javascript
const CONFIG = {
  SUPABASE_URL: 'https://xxxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

4. Save the file

**Important**: These credentials are safe to include in the extension because:
- The Anon Key can only read/write with Row Level Security restrictions
- RLS policies prevent users from accessing other domains' data
- No sensitive operations are possible

### Step 4: Generate Extension Icons

1. Open `extension/icon-generator.html` in Chrome (just drag it to a tab)
2. Click "Download" buttons to save three icons:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
3. Save all three files in the `extension/` folder

**Why three sizes?**
- 16x16: Toolbar icon (what you click)
- 48x48: Extension management page
- 128x128: Chrome Web Store

### Step 5: Install the Extension

1. Open Chrome and type `chrome://extensions/` in the address bar
2. Enable **Developer mode** (toggle in top right)
3. Click **"Load unpacked"**
4. Navigate to and select the `extension/` folder
5. The extension will appear in your list
6. Click the extension icon (blue chat bubble) to test

**You should see:**
- A popup with a title "Domain Echo"
- The current domain name
- "0 online" in the users section
- An empty chat area with welcome text
- A message input field at the bottom

### Step 6: Test It Out

1. Visit any website (e.g., `example.com`)
2. Click the Domain Echo icon
3. Type a message and hit Enter
4. Open the same website in a new tab
5. Click the extension icon in the new tab
6. You should see your message!
7. Switch to a different website
8. You should see a different chat room

---

## Configuration

### config.js

Located at `extension/config.js`, this file contains your Supabase credentials:

```javascript
const CONFIG = {
  SUPABASE_URL: 'https://xxxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

**That's it!** The extension doesn't require any other configuration.

### manifest.json

The `manifest.json` file tells Chrome what permissions the extension needs:

```json
{
  "manifest_version": 3,
  "name": "Domain Echo",
  "version": "1.0.0",
  "description": "Anonymous domain-based chat rooms",
  "permissions": [
    "tabs",
    "storage"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icons": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    }
  },
  "host_permissions": [],
  "background": {
    "service_worker": "background.js"
  }
}
```

**Key permissions:**
- `tabs`: Allows reading current tab URL to extract domain
- `storage`: Allows storing username locally in browser

---

## How It Works

### When You Click the Extension Icon

1. **popup.html loads** → popup.js runs
2. **Get current tab** → Extract domain from URL
3. **Load stored username** → Or generate new random one
4. **Create session ID** → Unique identifier for this session
5. **Connect to Supabase** → Initialize client
6. **Update presence** → Add yourself to the domain's user list
7. **Load past messages** → Fetch last 50 messages for this domain
8. **Subscribe to updates** → Listen for new messages and presence changes
9. **Display UI** → Show chat interface

### When You Send a Message

1. **User types message** → Clicks send or presses Enter
2. **Message validated** → Check it's not empty
3. **Send to Supabase** → Insert into `messages` table
4. **Supabase broadcasts** → All subscribers in that domain get notified
5. **Message appears** → Other users see it immediately (real-time)

### When You Switch Domains

1. **Close popup** → Current subscriptions are cleaned up
2. **Open popup on new domain** → New domain chat room loads
3. **Messages update** → Only messages from the new domain appear
4. **Presence updates** → User list shows only people on this domain

### When You Close the Extension

1. **Popup closes** → cleanup() function runs
2. **Presence removed** → Your user entry is deleted
3. **Subscriptions cancelled** → Stop listening for updates
4. **Browser storage kept** → Your username persists for next time

---

## Database Schema

### messages Table

Stores all chat messages across all domains.

```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL,
  content text NOT NULL,
  username text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

**Columns:**
- `id`: Unique identifier for each message
- `domain`: Which domain room this message belongs to (e.g., "example.com")
- `content`: The actual message text (max length varies)
- `username`: The sender's username (e.g., "SwiftFox742")
- `created_at`: When the message was posted (server time)

**Indexes:**
- `domain`: For fast lookups of all messages in a room
- `created_at`: For sorting messages by time

**Example data:**
```
id: 123e4567-e89b-12d3-a456-426614174000
domain: example.com
content: "Hello everyone!"
username: SwiftFox742
created_at: 2024-02-08T10:30:45.123456+00:00
```

### presence Table

Tracks which users are currently online in each domain.

```sql
CREATE TABLE presence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL,
  username text NOT NULL,
  last_seen timestamptz DEFAULT now(),
  session_id text UNIQUE NOT NULL
);
```

**Columns:**
- `id`: Unique presence record
- `domain`: Which domain room they're in
- `username`: Their username
- `last_seen`: When they last updated their presence (heartbeat)
- `session_id`: Unique per browser session - used to identify "you" vs other users

**How it works:**
1. When you open the popup, a new presence record is created
2. Every 30 seconds, `last_seen` is updated (heartbeat)
3. When popup closes, the presence record is deleted
4. Any record with `last_seen` older than 60 seconds is automatically deleted

**Example data:**
```
id: 234f5678-f89c-23e4-b567-527725285111
domain: example.com
username: SwiftFox742
last_seen: 2024-02-08T10:30:45.123456+00:00
session_id: 1707392445123-abc123def
```

### Row Level Security (RLS)

RLS policies control who can read/write to these tables.

**Current policies:**
- Anyone can READ messages (public)
- Anyone can INSERT messages (anonymous posting)
- Anyone can READ presence (public user list)
- Anyone can INSERT/UPDATE/DELETE presence (manage your own presence)

**Why this is safe:**
- No authentication required (that's the point)
- Anyone CAN post, but messages are only meaningful within a domain
- Domain isolation happens naturally because users only see their current domain
- No user can see/modify other domains

---

## Extension Structure

### File Breakdown

#### manifest.json
Chrome extension configuration. Defines:
- Extension name, version, description
- Required permissions (tabs, storage)
- Icon locations
- Popup file location
- Background service worker

#### popup.html
The HTML structure of the chat interface. Contains:
- Header with domain name
- Users online section
- Messages display area
- Message input field with send button

#### popup.js
**The core application logic** (around 400 lines). Handles:

**Initialization:**
- `initializeSupabase()`: Connect to Supabase
- `loadUsername()`: Load stored username or generate new
- `getCurrentTab()`: Get the current browser tab
- `extractDomain()`: Parse domain from URL
- `initialize()`: Run all setup when popup opens

**Messaging:**
- `loadMessages()`: Fetch last 50 messages from Supabase
- `subscribeToMessages()`: Listen for new messages
- `appendMessage()`: Add message to UI
- `sendMessage()`: Send user's message to Supabase
- `formatTime()`: Convert timestamps to relative time ("2m ago")

**Presence:**
- `loadPresence()`: Fetch current online users
- `updatePresence()`: Send heartbeat to keep yourself online
- `subscribeToPresence()`: Listen for presence changes
- `cleanupStalePresence()`: Remove timed-out users

**Utilities:**
- `generateUsername()`: Create random username like "SwiftFox742"
- `generateSessionId()`: Create unique session identifier
- `cleanup()`: Cleanup when popup closes

**Event Handling:**
- `setupEventListeners()`: Wire up send button and Enter key
- Message validation and error handling

#### styles.css
All styling. Features:
- Dark theme (blue/slate colors)
- Responsive scrollable areas
- Smooth animations (message slide-in)
- Hover and active states
- Readable text contrast

#### config.js
**One file YOU must edit:**
```javascript
const CONFIG = {
  SUPABASE_URL: 'YOUR_URL_HERE',
  SUPABASE_ANON_KEY: 'YOUR_KEY_HERE'
};
```

#### background.js
Minimal service worker that just logs installation. Could be expanded for:
- Badge notifications
- Icon updates
- Context menu items

#### icon-generator.html
Standalone tool to generate extension icons. Opens in a browser tab, generates three PNG files by drawing the logo programmatically.

---

## Real-Time Features

### WebSocket Subscriptions

The extension uses Supabase's Realtime feature, which is built on WebSockets:

**How it works:**
1. When popup opens, `subscribeToMessages()` is called
2. Opens a WebSocket connection to Supabase
3. Subscribes to the `INSERT` event on the `messages` table filtered by current domain
4. Whenever any user posts to this domain, all subscribers get notified instantly
5. Message is added to UI without any page reload

**Example flow:**
```
User A types "Hello" → Sends INSERT to messages table
                    ↓
Supabase broadcasts "new message in example.com"
                    ↓
User B gets real-time notification
                    ↓
Message appears in User B's chat instantly
```

### Presence Subscriptions

Similarly, presence uses subscriptions:

1. `subscribeToPresence()` subscribes to ALL presence changes in current domain
2. When anyone joins/leaves/updates presence, all users in that domain are notified
3. User list updates automatically

### Important: Connection States

**Connection established:**
- Messages flow in real-time
- User list updates instantly
- Green light (implicit - no disconnect indicator in current UI)

**Connection lost:**
- Messages won't send (button disabled)
- Errors shown in chat area
- Eventually, stale presence records are cleaned up

**Auto-reconnect:**
- Supabase client auto-reconnects on network change
- No manual intervention needed

---

## User Flow

### Scenario 1: First Time Using Domain Echo

1. User installs extension from `chrome://extensions/`
2. Visits `example.com`
3. Clicks Domain Echo icon
4. Extension generates random username (e.g., "SwiftFox742")
5. Stores username in browser storage
6. Creates session ID
7. Fetches last 50 messages from `example.com` room
8. Shows empty chat if this is first time for this domain
9. Creates presence entry ("SwiftFox742 is online on example.com")
10. Subscribes to real-time updates
11. Starts heartbeat (update every 30 seconds)

### Scenario 2: Multiple Users in Same Room

1. User A on `reddit.com` → Messages saying "This subreddit is great!"
2. User B visits `reddit.com` → Sees User A's message from earlier
3. User B types "I agree!"
4. User A gets real-time notification → Message appears immediately
5. User B switches to `github.com` → New chat room loads
6. User A still sees User B's username in presence (still on reddit.com)
7. If User A switches to `github.com` → Now in same room as User B
8. User A stays on `github.com` for 5 minutes with no activity
9. Presence record gets stale (last_seen > 60 seconds ago)
10. Background cleanup removes User A from presence
11. User A's username disappears from online list

### Scenario 3: Message Sending Error

1. User types message
2. Clicks send
3. Network error occurs
4. Error message appears: "Failed to send message"
5. Message stays in input field (not lost)
6. User can retry (connection auto-recovers)

### Scenario 4: Different Domains, Same User

1. User opens `example.com` chat → Joins "example.com" room
2. User sees SwiftFox742, TigerBear123, etc. online
3. User navigates to `github.com` → Closes popup
4. User clicks extension on `github.com` → New room loads
5. Same username ("SwiftFox742") is used (retrieved from storage)
6. Different set of online users appears (whoever is on github.com)
7. Different message history (only github.com messages)

---

## Troubleshooting

### Extension Icon Not Appearing

**Problem:** You can't find the Domain Echo icon in Chrome

**Solutions:**
1. Go to `chrome://extensions/`
2. Make sure "Developer mode" is ON (toggle in top right)
3. Make sure icon files (icon16.png, icon48.png, icon128.png) are in `extension/` folder
4. Try removing and re-adding the extension:
   - Click the trash icon next to Domain Echo
   - Click "Load unpacked" again
   - Select `extension/` folder

### "Domain Echo" Opens But Shows Blank Chat

**Problem:** Popup opens but nothing appears, or error messages show

**Likely causes:**

1. **config.js is empty or missing**
   - Check `extension/config.js` has your Supabase URL and key
   - Make sure you didn't leave placeholder text

2. **Supabase connection failed**
   - Verify URL is correct (should look like `https://xxxxx.supabase.co`)
   - Verify Anon Key is correct (long alphanumeric string)
   - Check your internet connection

3. **Database not initialized**
   - Go to your Supabase dashboard
   - Check that tables exist (go to SQL Editor)
   - Run the migration if tables don't exist

**How to debug:**
1. Right-click extension icon → "Inspect popup"
2. Look at Console tab for error messages
3. Common errors:
   - `CONFIG is not defined` → config.js not loading
   - `Cannot read property 'from' of undefined` → Supabase client not initialized
   - `Network error` → Check internet and Supabase credentials

### Messages Not Sending

**Problem:** You type a message, click send, nothing happens

**Check:**
1. Message input not empty (empty messages are silently ignored)
2. Send button should be enabled (not grayed out)
3. Check console for error messages
4. Check internet connection
5. Try a refresh of the popup

**If still broken:**
1. Verify Supabase anon key has INSERT permission on `messages` table
2. Check RLS policy allows anonymous INSERT (should be enabled by default)

### Can't See Other Users' Messages

**Problem:** You post but don't see messages from others

**Possible causes:**
1. **Other users on different domain** → Switch to their domain to see them
2. **No one else online** → Messages only appear when real people post
3. **Real-time subscription failed** → Try closing and reopening popup
4. **Database query failed** → Check `loadMessages()` console error

### "5 online" But You Only See 2 Names

**Problem:** User count shows high but some users don't have visible names

**Explanation:** This is normal. The presence table can have records even if they don't show in the UI due to timing. The number shown is more accurate than individual names.

### Extension Crashed or Frozen

**Problem:** Popup opened but everything is frozen

**Solutions:**
1. Close the popup (click X)
2. Wait 5 seconds
3. Click extension icon again
4. If still frozen, right-click extension icon → "Remove"
5. Reload extension from `chrome://extensions/`

### Messages Disappearing

**Problem:** Messages you posted are gone

**Note:** Messages are persistent in the database and won't disappear. If they're not visible:
1. You might be looking at a different domain
2. Try refreshing the popup
3. Check that you're in the right domain room

The extension doesn't delete messages automatically.

### Real-Time Updates Not Working

**Problem:** You post a message, but other users don't see it for 30+ seconds (or only after refresh)

**Causes:**
1. **Real-time subscription not active** → Close/reopen popup
2. **Supabase Realtime down** → Check Supabase status page
3. **Network issue** → Check internet, firewall settings

**Temporary fix:** Manually refresh popup by closing and reopening

### Can't Connect to Supabase

**Error message:** "Failed to connect to Supabase" or similar

**Check:**
1. Is your Supabase project running? (Go to Supabase dashboard)
2. Is the URL correct? Should be `https://[project-id].supabase.co`
3. Is the Anon Key correct? Should be a long alphanumeric string
4. Do you have internet? Try visiting a regular website
5. Is Supabase down? Check their status page

---

## Customization

### Changing the Username

Want to use the same username every time instead of random ones?

Edit `extension/popup.js`, find the `loadUsername()` function:

```javascript
async function loadUsername() {
  const stored = await chrome.storage.local.get(['username']);
  if (stored.username) {
    currentUsername = stored.username;
  } else {
    currentUsername = generateUsername();  // <-- Change this line
    await chrome.storage.local.set({ username: currentUsername });
  }
}
```

Change to:
```javascript
currentUsername = 'MyCustomUsername';
```

### Changing Colors

Edit `extension/styles.css` and replace color values:

**Current color scheme:**
- Primary Blue: `#3b82f6`, `#2563eb`
- Dark Background: `#0f172a`
- Secondary Background: `#1e293b`
- Borders: `#334155`
- Text: `#e2e8f0`, `#64748b`

**Example: Change blue to green:**
Replace `#3b82f6` with `#10b981` (emerald green)

### Changing Popup Size

In `extension/styles.css`, find:
```css
body {
  width: 400px;
  height: 600px;
  ...
}
```

Change width and height. Note: Too small and UI breaks, too large and looks odd.

Recommended sizes:
- Minimum: 350x500
- Default: 400x600
- Large: 500x700

### Changing Message Limit

In `extension/popup.js`, find `loadMessages()`:
```javascript
.limit(50)  // <-- Change this number
```

50 is a good balance. Higher numbers = slower loading.

### Changing Presence Timeout

In `extension/popup.js`, find the constants at the top:

```javascript
const PRESENCE_UPDATE_INTERVAL = 30000;  // 30 seconds - how often to send heartbeat
const PRESENCE_TIMEOUT = 60000;  // 60 seconds - when to consider user gone
```

These are in milliseconds. Lower numbers = more responsive but more network traffic.

### Adding Message Reactions

The database supports it already - you could add emoji reactions:

```sql
CREATE TABLE message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  emoji text,
  username text,
  created_at timestamptz DEFAULT now()
);
```

Then modify popup.js to fetch and display reactions.

### Adding Moderation

Add a `flagged` column to messages table:

```sql
ALTER TABLE messages ADD COLUMN flagged boolean DEFAULT false;
```

Users could flag inappropriate messages, and they'd get hidden.

---

## Security & Privacy

### What Data Is Stored?

**In Supabase:**
- Message content and timestamps
- Domain names
- Random usernames (not tied to real identity)
- Presence data (online/offline status)

**In Browser Storage:**
- Your username (persists across sessions)
- Nothing else

### What Data Is NOT Stored?

- No email addresses
- No passwords
- No passwords or tokens
- No browsing history
- No IP addresses (except Supabase logs)
- No real names or identities
- No cross-domain data

### Privacy by Design

1. **Anonymous by Default**: No login required, no real identity needed
2. **Domain Isolation**: You can't see messages from other domains
3. **Ephemeral Sessions**: Session IDs are temporary and random
4. **No Tracking**: No analytics or tracking pixels
5. **No Cookies**: Extension doesn't use cookies
6. **No Remote Code**: All code is local except Supabase connection

### Row Level Security (RLS)

RLS policies ensure:
- Anonymous users can only write messages (not edit/delete others')
- Anonymous users can only read their current domain's messages
- Presence data is public but session IDs are unique per user

### What Supabase Sees

Supabase (the backend provider) can see:
- All messages posted
- All domain names used
- Presence/activity patterns
- Timestamps

But they cannot:
- Link usernames to real identities
- See your browsing history
- See your real IP (unless logging it)
- Track you across domains

### Important Security Notes

1. **This is NOT end-to-end encrypted**
   - Supabase can read your messages (but they're public anyway)
   - Messages are transmitted via HTTPS (encrypted in transit)
   - If you need true privacy, don't use this for sensitive discussions

2. **No moderation yet**
   - Anyone can post anything
   - No spam filter or content moderation
   - Domain rooms can get abused

3. **Permanent storage**
   - Messages are stored permanently (currently)
   - No automatic deletion
   - Future versions could add TTL (time-to-live)

### Best Practices

- Don't post personal information (it's on the internet)
- Assume everything you post is public
- Don't post sensitive business information
- Use for casual, ephemeral discussions only

---

## Maintenance

### Regular Checks

**Weekly:**
- Check that extension still loads and works
- Send a test message to verify real-time works

**Monthly:**
- Check Supabase dashboard for database health
- Review message count to ensure DB isn't overflowing

### Backups

Supabase automatically backs up your database. You don't need to do anything.

### Upgrades

To upgrade the extension:
1. Modify files in `extension/`
2. Go to `chrome://extensions/`
3. Click refresh icon on Domain Echo
4. Changes take effect immediately

### Monitoring Database Size

Go to Supabase dashboard:
1. Project Settings → Database
2. View storage usage
3. Message table will grow over time

To keep it manageable, you could add a migration to delete messages older than 30 days:

```sql
DELETE FROM messages WHERE created_at < now() - interval '30 days';
```

---

## Common Questions

**Q: Can I see who posted a message?**
A: No, only their randomly-generated username. No way to link back to real identity.

**Q: What if someone posts something inappropriate?**
A: Currently no moderation. Future version could add reporting/blocking.

**Q: Can I see messages from before I joined?**
A: Yes, last 50 messages are loaded when you open the popup.

**Q: What happens to my username when I close the extension?**
A: It's kept in browser storage. You'll use the same username next time. You can clear it by clearing browser data.

**Q: Can I use this on my phone?**
A: Not without Android Chrome extensions support (currently not available).

**Q: Why do I need Supabase? Can I use a different database?**
A: Supabase is ideal because it has built-in Realtime for instant updates. You *could* use another database, but you'd need to build the real-time infrastructure yourself.

**Q: Is this against Chrome policy?**
A: No, it's a legitimate extension. It doesn't scrape sites or do anything malicious.

**Q: Can I modify and redistribute this?**
A: Yes, it's open source. Just maintain the privacy principles.

---

## Support

### If Something Breaks

1. Check the Console for error messages (right-click popup → Inspect)
2. Verify config.js has correct credentials
3. Try removing and re-adding the extension
4. Restart Chrome
5. Check your internet connection

### Getting Help

- Check the troubleshooting section above
- Look at console errors (Inspect popup → Console)
- Verify Supabase credentials are correct
- Test with a simple message to isolate the issue

---

## Next Steps

1. **Get Supabase credentials** (if you haven't already)
2. **Update config.js** with your credentials
3. **Generate icons** using icon-generator.html
4. **Load extension** in Chrome
5. **Test on different domains** to verify it works
6. **Customize** (colors, size, etc.) if desired

You now have a fully functional anonymous chat system for the web!
