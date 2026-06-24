@echo off
REM OAUTH_TEST_STARTUP.bat
REM Quick startup script to automate local OAuth Code+PKCE testing (Windows)
REM Usage: Double-click this file to start

setlocal enabledelayedexpansion

echo.
echo ========================================
echo OAuth Code+PKCE Local Testing
echo ========================================
echo.

REM Check prerequisites
echo [1/5] Checking prerequisites...

where node >nul 2>nul
if errorlevel 1 (
    echo X Node.js not found. Please install Node.js >=20
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION%

where npm >nul 2>nul
if errorlevel 1 (
    echo X npm not found
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION%

REM Check dependencies
echo.
echo [2/5] Checking dependencies...

if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
    if errorlevel 1 (
        echo X Failed to install root dependencies
        pause
        exit /b 1
    )
)
echo [OK] Root dependencies

if not exist "apps\scanner\node_modules" (
    echo Installing scanner dependencies...
    call npm install --workspace apps/scanner
    if errorlevel 1 (
        echo X Failed to install scanner dependencies
        pause
        exit /b 1
    )
)
echo [OK] Scanner dependencies

REM Check environment variables
echo.
echo [3/5] Checking environment variables...

if not exist "apps\scanner\.env.local" (
    echo X Missing apps\scanner\.env.local
    echo.
    echo Create it with these variables:
    echo.
    echo VITE_GOOGLE_CLIENT_ID=^<your-google-client-id^>
    echo VITE_MICROSOFT_CLIENT_ID=^<your-microsoft-client-id^>
    echo VITE_SUPABASE_URL=https://fuiebtpezpoxvkuuhaqy.supabase.co
    echo VITE_SUPABASE_ANON_KEY=^<your-supabase-anon-key^>
    echo.
    pause
    exit /b 1
)
echo [OK] Environment variables found

REM Verify key files exist
echo.
echo [4/5] Verifying OAuth implementation files...

set FILES=^
    apps\scanner\src\lib\oauth-utils.ts ^
    apps\scanner\src\routes\auth\email-callback.tsx ^
    apps\scanner\src\routes\auth\signin.tsx ^
    supabase\functions\exchange-email-code\index.ts

for %%F in (%FILES%) do (
    if exist "%%F" (
        echo [OK] %%F
    ) else (
        echo X %%F not found
        pause
        exit /b 1
    )
)

REM Build TypeScript
echo.
echo [5/5] Building TypeScript...

call npm run build --workspace @digitaleu/scanner >nul 2>&1
if errorlevel 1 (
    echo X TypeScript build failed
    echo Run: npm run build --workspace @digitaleu/scanner
    pause
    exit /b 1
)
echo [OK] TypeScript build successful

REM Ready to start
echo.
echo ========================================
echo [OK] All checks passed!
echo ========================================
echo.
echo Starting dev server...
echo Scanner will be available at: http://localhost:5174
echo Signin page: http://localhost:5174/auth/signin
echo.
echo === TESTING CHECKLIST ===
echo   1. Click '🔗 Connect Gmail'
echo   2. Sign in to Google account
echo   3. Grant permissions
echo   4. Verify redirect to /dashboard
echo   5. Check sessionStorage for token (DevTools ^> Application ^> Session Storage)
echo.
echo === SECURITY CHECKS ===
echo   ✓ Verify NO #access_token in URL (should see ?code=...)
echo   ✓ Check browser history (Ctrl+H) for 'access_token' (should be empty)
echo   ✓ Check DevTools Console for errors
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev:scanner

pause
