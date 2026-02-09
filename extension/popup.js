import { ConvexClient } from './lib/convex-dist/esm/browser/index.js';
import { api } from './convex/_generated/api.js';

let convexClient;
let currentDomain = '';
let currentUsername = '';
let sessionId = '';
let presenceInterval = null;
let messageWatcher = null;
let presenceWatcher = null;

const PRESENCE_UPDATE_INTERVAL = 30000;

function initializeConvex() {
  convexClient = new ConvexClient(CONFIG.CONVEX_URL);
}

function generateUsername() {
  const adjectives = [
    // Vibes & Moods
    'Chill', 'Cosmic', 'Epic', 'Retro', 'Neon', 'Mystic', 'Turbo', 'Ultra', 'Mega', 'Hyper',
    'Funky', 'Groovy', 'Spicy', 'Sweet', 'Salty', 'Crispy', 'Fuzzy', 'Shiny', 'Glitchy', 'Pixel'
  ];

  const nouns = [
    // Movie Characters & Icons
    'Yoda', 'Vader', 'Neo', 'Morpheus', 'Gandalf', 'Frodo', 'Gollum', 'Simba', 'Shrek', 'Groot',
    'Thanos', 'Loki', 'Thor', 'Hulk', 'Joker', 'Batman', 'Spidey', 'Deadpool', 'Wolverine', 'IronMan',

    // Game Characters
    'Mario', 'Luigi', 'Sonic', 'Kirby', 'Pikachu', 'Link', 'Kratos', 'Pacman', 'Megaman', 'Ryu',
    'Cloud', 'Sephiroth', 'MasterChief', 'Steve', 'Creeper', 'Enderman', 'Bowser', 'Wario', 'Waluigi', 'Yoshi',
    'Donkey', 'Diddy', 'Banjo', 'Kazooie', 'Crash', 'Spyro', 'Rayman', 'Sackboy', 'Ratchet', 'Clank',

    // Household Items
    'Toaster', 'Blender', 'Microwave', 'Lamp', 'Couch', 'Pillow', 'Blanket', 'Mug', 'Fork', 'Spoon',
    'Remote', 'Charger', 'Router', 'Vacuum', 'Fridge', 'Oven', 'Kettle', 'Teapot', 'Candle', 'Mirror',
    'Clock', 'Fan', 'Heater', 'Speaker', 'Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Printer', 'Scanner',

    // Food & Drinks
    'Pizza', 'Taco', 'Burrito', 'Sushi', 'Ramen', 'Burger', 'Hotdog', 'Donut', 'Cookie', 'Brownie',
    'Waffle', 'Pancake', 'Bacon', 'Cheese', 'Pickle', 'Avocado', 'Mango', 'Banana', 'Coconut', 'Latte',
    'Espresso', 'Mocha', 'Boba', 'Smoothie', 'Milkshake', 'Pretzel', 'Nacho', 'Popcorn', 'Candy', 'Jellybean',
    'Cupcake', 'Muffin', 'Bagel', 'Croissant', 'Churro', 'Dumpling', 'Noodle', 'Tempura', 'Kimchi', 'Tofu'
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999);
  return `${adj}${noun}${num}`;
}

function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return 'unknown';
  }
}

async function loadUsername() {
  const stored = await chrome.storage.local.get(['username']);
  if (stored.username) {
    currentUsername = stored.username;
  } else {
    currentUsername = generateUsername();
    await chrome.storage.local.set({ username: currentUsername });
  }
}

async function loadOrGenerateSessionId() {
  const stored = await chrome.storage.local.get(['sessionId']);
  if (stored.sessionId) {
    sessionId = stored.sessionId;
  } else {
    sessionId = generateSessionId();
    await chrome.storage.local.set({ sessionId: sessionId });
  }
}

async function updatePresence() {
  if (!currentDomain || !sessionId) return;

  try {
    await convexClient.mutation(api.presence.update, {
      domain: currentDomain,
      username: currentUsername,
      sessionId: sessionId,
    });
  } catch (error) {
    console.error('Error updating presence:', error);
  }
}

async function cleanupStalePresence() {
  try {
    await convexClient.mutation(api.presence.cleanupStale, {});
  } catch (error) {
    console.error('Error cleaning up presence:', error);
  }
}

async function loadPresence() {
  if (!currentDomain) return;

  await cleanupStalePresence();

  try {
    const activeUsers = await convexClient.query(api.presence.getByDomain, {
      domain: currentDomain,
    });

    updatePresenceUI(activeUsers);
  } catch (error) {
    console.error('Error loading presence:', error);
  }
}

function updatePresenceUI(activeUsers) {
  const usersList = document.getElementById('users-list');
  const userCount = document.getElementById('user-count');

  usersList.innerHTML = '';

  if (activeUsers && activeUsers.length > 0) {
    userCount.textContent = `${activeUsers.length} online`;

    activeUsers.forEach(user => {
      const badge = document.createElement('div');
      badge.className = 'user-badge';
      if (user.sessionId === sessionId) {
        badge.className += ' self';
      }
      badge.textContent = user.username;
      usersList.appendChild(badge);
    });
  } else {
    userCount.textContent = '0 online';
  }
}

async function loadMessages() {
  if (!currentDomain) return;

  try {
    const messages = await convexClient.query(api.messages.getByDomain, {
      domain: currentDomain,
    });

    const messagesContainer = document.getElementById('messages');
    const welcome = messagesContainer.querySelector('.welcome');

    if (messages && messages.length > 0) {
      if (welcome) welcome.remove();

      messages.forEach(msg => {
        appendMessage(msg, false);
      });

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  } catch (error) {
    console.error('Error loading messages:', error);
    showError('Failed to load messages');
  }
}

function setupRealtimeSubscriptions() {
  // Subscribe to messages for current domain
  const messagesContainer = document.getElementById('messages');

  messageWatcher = convexClient.onUpdate(
    api.messages.getByDomain,
    { domain: currentDomain },
    (messages) => {
      const welcome = messagesContainer.querySelector('.welcome');
      if (welcome) welcome.remove();

      // Clear existing messages to avoid duplicates
      const existingMessages = messagesContainer.querySelectorAll('.message');
      existingMessages.forEach(msg => msg.remove());

      // Render all messages
      if (messages && messages.length > 0) {
        messages.forEach(msg => {
          appendMessage(msg, false);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  );

  // Subscribe to presence for current domain
  presenceWatcher = convexClient.onUpdate(
    api.presence.getByDomain,
    { domain: currentDomain },
    (activeUsers) => {
      updatePresenceUI(activeUsers);
    }
  );
}

function appendMessage(message, isNew) {
  const messagesContainer = document.getElementById('messages');
  const welcome = messagesContainer.querySelector('.welcome');
  if (welcome) welcome.remove();

  // Use Convex's _id instead of id
  const existingMessage = document.querySelector(`[data-message-id="${message._id}"]`);
  if (existingMessage) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  messageDiv.setAttribute('data-message-id', message._id);

  if (message.username === currentUsername) {
    messageDiv.classList.add('self');
  }

  const header = document.createElement('div');
  header.className = 'message-header';

  const username = document.createElement('div');
  username.className = 'message-username';
  username.textContent = message.username;

  const time = document.createElement('div');
  time.className = 'message-time';
  // Use createdAt instead of created_at
  time.textContent = formatTime(message.createdAt);

  header.appendChild(username);
  header.appendChild(time);

  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = message.content;

  messageDiv.appendChild(header);
  messageDiv.appendChild(content);

  messagesContainer.appendChild(messageDiv);

  if (isNew) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function formatTime(timestamp) {
  // Convex uses Unix timestamp in milliseconds
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString();
}

async function sendMessage() {
  const input = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const content = input.value.trim();

  if (!content) return;

  sendButton.disabled = true;
  input.disabled = true;

  try {
    await convexClient.mutation(api.messages.send, {
      domain: currentDomain,
      content: content,
      username: currentUsername,
    });

    input.value = '';
  } catch (error) {
    console.error('Error sending message:', error);
    showError(error.message || 'Failed to send message');
  } finally {
    sendButton.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

function showError(message) {
  const messagesContainer = document.getElementById('messages');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'system-message error-message';
  errorDiv.textContent = message;
  messagesContainer.appendChild(errorDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

function setupEventListeners() {
  const sendButton = document.getElementById('send-button');
  const messageInput = document.getElementById('message-input');

  sendButton.addEventListener('click', sendMessage);

  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

async function cleanup() {
  if (presenceInterval) {
    clearInterval(presenceInterval);
  }

  if (sessionId && currentDomain) {
    try {
      await convexClient.mutation(api.presence.remove, {
        sessionId: sessionId,
      });
    } catch (error) {
      console.error('Error cleaning up presence:', error);
    }
  }

  // Cleanup watchers (onUpdate returns unsubscribe function)
  if (messageWatcher) {
    messageWatcher();
  }

  if (presenceWatcher) {
    presenceWatcher();
  }

  // Convex client cleanup
  if (convexClient) {
    convexClient.close();
  }
}

async function initialize() {
  try {
    initializeConvex();

    const tab = await getCurrentTab();
    currentDomain = extractDomain(tab.url);

    document.getElementById('current-domain').textContent = currentDomain;

    await loadUsername();
    await loadOrGenerateSessionId();

    setupEventListeners();

    await updatePresence();
    await loadPresence();
    await loadMessages();

    setupRealtimeSubscriptions();

    presenceInterval = setInterval(async () => {
      await updatePresence();
    }, PRESENCE_UPDATE_INTERVAL);
  } catch (error) {
    console.error('Error initializing:', error);
    showError('Failed to initialize. Check console for details.');
  }
}

window.addEventListener('load', initialize);
window.addEventListener('unload', cleanup);
