# Domain Echo - Quick Reference Guide

## One-Time Setup

```
1. Create Supabase project at supabase.com
2. Get Project URL and Anon Key from Settings → API
3. Edit extension/config.js with credentials
4. Open extension/icon-generator.html in Chrome, download icons
5. Go to chrome://extensions/ → Developer mode ON → Load unpacked (select extension folder)
6. Done!
```

## File Locations & Purposes

| File | Purpose | Edit? |
|------|---------|-------|
| `extension/config.js` | **YOUR CREDENTIALS GO HERE** | YES (required) |
| `extension/popup.html` | Chat UI structure | No (unless customizing UI) |
| `extension/popup.js` | All the logic | No (unless adding features) |
| `extension/styles.css` | Chat appearance | Yes (to customize colors/size) |
| `extension/manifest.json` | Chrome extension config | No |
| `extension/background.js` | Background worker | No |
| `extension/icon-generator.html` | Generate extension icons | No |
| `DOMAIN_ECHO_DOCS.md` | Full documentation | Reference |

## Database Overview

### `messages` Table
- Stores chat messages
- Columns: `id`, `domain`, `content`, `username`, `created_at`
- Anyone can read/write (RLS enabled)

### `presence` Table
- Tracks online users
- Columns: `id`, `domain`, `username`, `last_seen`, `session_id`
- Anyone can read/write/delete (RLS enabled)

## How Real-Time Works

1. User A posts message → Inserted into `messages` table
2. Supabase broadcasts to all subscribers in that domain
3. User B's popup receives notification via WebSocket
4. Message appears instantly in User B's chat
5. No page refresh needed

## Key Constants (in popup.js)

```javascript
PRESENCE_UPDATE_INTERVAL = 30000  // Send heartbeat every 30 seconds
PRESENCE_TIMEOUT = 60000           // Remove user if inactive for 60 seconds
MESSAGE_LIMIT = 50                 // Load last 50 messages when opening chat
```

## Debugging Checklist

- [ ] config.js has real Supabase URL and key?
- [ ] Icon files exist (icon16.png, icon48.png, icon128.png)?
- [ ] Extension loads without errors in chrome://extensions/?
- [ ] Can click extension icon and see popup?
- [ ] Can type and send a message?
- [ ] Open popup on same domain in different tab - see your message?
- [ ] Try different domain - different chat room?

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| Icon doesn't appear | Developer mode on? Icons in folder? Reload extension? |
| Popup blank/errors | Right-click → Inspect → Console tab for errors |
| CONFIG is not defined | config.js file missing or not loading |
| Network error | Internet connection? Supabase credentials correct? |
| Can't send messages | RLS policy issue? Check Supabase dashboard |
| Messages not real-time | Close/reopen popup, check internet |
| "X online" but no names | Normal - timing issue with UI updates |

## Customization Examples

### Change Colors
In `styles.css`, replace `#3b82f6` (blue) with:
- Green: `#10b981`
- Red: `#ef4444`
- Slate: `#64748b`

### Change Popup Size
In `styles.css`:
```css
body {
  width: 400px;    /* Change to 350-500 */
  height: 600px;   /* Change to 500-700 */
}
```

### Change Username Generation
In `popup.js`, modify `generateUsername()` to use different adjectives/nouns or a static name.

### Load More Messages
In `popup.js`:
```javascript
.limit(50)  // Change to .limit(100) or more
```

### Faster Presence Updates
In `popup.js`:
```javascript
const PRESENCE_UPDATE_INTERVAL = 15000;  // 15 seconds instead of 30
const PRESENCE_TIMEOUT = 30000;          // 30 seconds instead of 60
```

## Testing Workflow

```
1. Open https://example.com
2. Click Domain Echo → See empty chat
3. Type "Test" → Send → Message appears
4. Open https://example.com in new tab
5. Click Domain Echo → Should see your message
6. Open https://github.com
7. Click Domain Echo → Different chat room
8. Go back to example.com tab
9. Should still see message there
```

## Security Notes

- ✓ Anonymous (no login)
- ✓ Domain-isolated (can't see other domains)
- ✓ RLS protected (server-side rules)
- ✗ NOT end-to-end encrypted (Supabase can read)
- ✗ No moderation (yet)
- ✗ No content filtering (yet)

**Golden Rule:** Treat messages as public. Never post sensitive info.

## Performance

- **Message loading:** 50 messages = instant
- **Real-time latency:** <100ms (WebSocket)
- **Presence updates:** Every 30 seconds
- **Database size:** ~1KB per message

## Troubleshooting Flow

```
Extension not working?
  ├─ Check chrome://extensions/ loads without errors
  ├─ Right-click popup → Inspect → Console for errors
  ├─ Verify config.js has credentials
  ├─ Verify icon files exist
  ├─ Try removing and reloading extension
  └─ Check internet connection

Chat not appearing?
  ├─ Wrong domain? Try switching tabs
  ├─ No messages yet? Post one and check other tabs
  ├─ Real-time broken? Close/reopen popup
  └─ Check Supabase dashboard for data

Message won't send?
  ├─ Network error? Check internet
  ├─ Empty message? Type something first
  ├─ Buttons disabled? Retry after moment
  └─ Check Supabase RLS policies
```

## Need to Know These Functions (popup.js)

| Function | What It Does |
|----------|------------|
| `initialize()` | Runs when popup opens |
| `loadMessages()` | Fetch 50 recent messages |
| `subscribeToMessages()` | Listen for new messages |
| `sendMessage()` | Post user's message |
| `loadPresence()` | Get online users |
| `updatePresence()` | Send heartbeat |
| `generateUsername()` | Create random name |
| `extractDomain()` | Parse domain from URL |
| `cleanup()` | Runs when popup closes |

## Extension Lifecycle

```
User clicks extension icon
  ↓
popup.html loads → popup.js runs
  ↓
initialize()
  ├─ Get current domain
  ├─ Load/create username
  ├─ Connect to Supabase
  ├─ Load previous messages
  ├─ Start real-time subscriptions
  └─ Display UI
  ↓
User can now chat
  ├─ Send messages
  ├─ See others' messages (real-time)
  ├─ See online users
  └─ Switch domains anytime
  ↓
User closes popup
  ↓
cleanup()
  ├─ Remove presence entry
  ├─ Cancel subscriptions
  └─ Browser storage kept
```

## What Happens in Background

- **Every 30 seconds:** Send presence heartbeat
- **Every message:** Broadcast via WebSocket to all subscribers
- **Every 60 seconds:** Clean up old presence entries (automatic)
- **Never:** Your username or identity is leaked

## Final Checklist Before Using

- [ ] Supabase project created
- [ ] config.js updated with credentials
- [ ] Icons generated and saved
- [ ] Extension loaded in Chrome
- [ ] Can open popup
- [ ] Can send a message
- [ ] Message appears in new tab same domain
- [ ] Different domain = different chat

You're ready to go!
