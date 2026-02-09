#!/bin/bash

# Domain Echo - Extension Packaging Script
# This script creates a clean zip file for Chrome Web Store submission

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║         📦 Domain Echo - Extension Packager 📦                   ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Get version from manifest.json
VERSION=$(grep -o '"version": "[^"]*' manifest.json | cut -d'"' -f4)

if [ -z "$VERSION" ]; then
    echo -e "${RED}❌ Error: Could not read version from manifest.json${NC}"
    exit 1
fi

echo -e "${GREEN}📋 Version: $VERSION${NC}"
echo ""

# Output filename
OUTPUT="domain-echo-v${VERSION}.zip"

# Check if file already exists
if [ -f "$OUTPUT" ]; then
    echo -e "${YELLOW}⚠️  Warning: $OUTPUT already exists${NC}"
    read -p "Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPL =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Cancelled${NC}"
        exit 1
    fi
    rm "$OUTPUT"
fi

echo -e "${GREEN}📦 Creating package...${NC}"
echo ""

# Create zip file, excluding unnecessary files
zip -r "$OUTPUT" . \
    -x "*.git*" \
    -x "*node_modules*" \
    -x "*.DS_Store" \
    -x "*.old" \
    -x "*.backup" \
    -x "*test-*.html" \
    -x "package-extension.sh" \
    -x "*.zip" \
    -x "SETUP*.md" \
    -x "SETUP*.txt" \
    -x "icon-generator.html" \
    > /dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Package created successfully!${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}📦 Package Details${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  File: $OUTPUT"
    echo "  Version: $VERSION"
    echo "  Size: $(du -h "$OUTPUT" | cut -f1)"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}🚀 Next Steps${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  1. Go to: https://chrome.google.com/webstore/devconsole"
    echo "  2. Click on 'Domain Echo' (or 'New Item' for first publish)"
    echo "  3. Upload: $OUTPUT"
    echo "  4. Add release notes"
    echo "  5. Submit for review"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
else
    echo -e "${RED}❌ Error creating package${NC}"
    exit 1
fi

