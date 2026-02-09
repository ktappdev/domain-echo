#!/bin/bash

# Copy Convex generated API files to extension directory
# Run this after making changes to Convex functions

echo "📦 Copying Convex API files to extension..."

# Create directory if it doesn't exist
mkdir -p extension/convex/_generated

# Copy the generated API files
if [ -f "convex/_generated/api.js" ]; then
  cp convex/_generated/api.js extension/convex/_generated/api.js
  echo "✅ Copied api.js"
else
  echo "❌ Error: convex/_generated/api.js not found"
  echo "   Run 'npx convex dev' first to generate API files"
  exit 1
fi

if [ -f "convex/_generated/api.d.ts" ]; then
  cp convex/_generated/api.d.ts extension/convex/_generated/api.d.ts
  echo "✅ Copied api.d.ts"
fi

echo "✅ Convex API files copied to extension successfully!"
echo ""
echo "Next steps:"
echo "1. Reload the extension in Chrome (chrome://extensions/)"
echo "2. Test the extension functionality"

