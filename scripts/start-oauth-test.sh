#!/bin/bash

# OAUTH_TEST_STARTUP.sh
# Quick startup script to automate local OAuth Code+PKCE testing
# Usage: bash scripts/start-oauth-test.sh

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}OAuth Code+PKCE Local Testing${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check prerequisites
echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js >=20${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js ${$(node -v)}${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm ${$(npm -v)}${NC}"

# Check dependencies
echo -e "\n${YELLOW}[2/5] Checking dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}→ Installing root dependencies...${NC}"
    npm install
fi
echo -e "${GREEN}✓ Root dependencies${NC}"

if [ ! -d "apps/scanner/node_modules" ]; then
    echo -e "${YELLOW}→ Installing scanner dependencies...${NC}"
    npm install --workspace apps/scanner
fi
echo -e "${GREEN}✓ Scanner dependencies${NC}"

# Verify environment variables
echo -e "\n${YELLOW}[3/5] Checking environment variables...${NC}"

ENV_FILE="apps/web/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}✗ Missing $ENV_FILE${NC}"
    echo -e "${YELLOW}Create it with these variables:${NC}"
    cat > /tmp/oauth-env-template.txt << 'EOF'
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_MICROSOFT_CLIENT_ID=<your-microsoft-client-id>
VITE_SUPABASE_URL=https://mwsalzjsvuvlmshxzbxg.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
EOF
    cat /tmp/oauth-env-template.txt
    echo -e "\n${YELLOW}Copy the above variables to $ENV_FILE${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Environment variables found${NC}"

# Verify key files exist
echo -e "\n${YELLOW}[4/5] Verifying OAuth implementation files...${NC}"

FILES=(
    "apps/web/src/lib/oauth-utils.ts"
    "apps/web/src/pages/scanner/auth/email-callback.tsx"
    "apps/web/src/pages/scanner/auth/signin.tsx"
    "supabase/functions/exchange-email-code/index.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file not found${NC}"
        exit 1
    fi
done

# Build TypeScript
echo -e "\n${YELLOW}[5/5] Building TypeScript...${NC}"

if npm run build --workspace @digitaleu/scanner 2>&1 | grep -q "error"; then
    echo -e "${RED}✗ TypeScript build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ TypeScript build successful${NC}"

# Ready to start
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}✓ All checks passed!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${YELLOW}Starting dev server...${NC}"
echo -e "${BLUE}Scanner will be available at: http://localhost:5174${NC}"
echo -e "${BLUE}Signin page: http://localhost:5174/auth/signin${NC}\n"

echo -e "${YELLOW}=== TESTING CHECKLIST ===${NC}"
echo -e "  1. Click '🔗 Connect Gmail'"
echo -e "  2. Sign in to Google account"
echo -e "  3. Grant permissions"
echo -e "  4. Verify redirect to /dashboard"
echo -e "  5. Check sessionStorage for token (DevTools → Application → Session Storage)"
echo -e ""
echo -e "${YELLOW}=== SECURITY CHECKS ===${NC}"
echo -e "  ✓ Verify NO #access_token in URL (should see ?code=...)"
echo -e "  ✓ Check browser history (Ctrl+H) for 'access_token' (should be empty)"
echo -e "  ✓ Check DevTools Console for errors"
echo -e ""

# Start dev server
npm run dev:scanner
