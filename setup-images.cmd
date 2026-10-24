@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
set COREPACK_ENABLE_DOWNLOAD_PROMPT=0
echo.
echo ===== Zyphix: push site + fill product images =====
echo.

echo [1/5] Pushing latest code to GitHub (Cloudflare redeploys automatically)...
git push origin main cloudflare-now
if errorlevel 1 echo   (push failed or nothing to push - continuing)

echo.
echo [2/5] Installing dependencies (first time takes a minute)...
call corepack pnpm install
if errorlevel 1 (
  echo   Install failed. Fix the error above and run this file again.
  pause
  exit /b 1
)
set "WR=call corepack pnpm exec wrangler"

echo.
echo [3/5] Checking Cloudflare login...
%WR% whoami >nul 2>&1
if errorlevel 1 (
  echo   Not logged in - a browser window will open, please approve.
  %WR% login
)

echo.
echo [4/5] Setting the ADMIN_TOKEN on the worker...
set "TOKEN="
if exist "artifacts\zyphix\.dev.vars" (
  for /f "tokens=1,* delims==" %%a in ('findstr /b "ADMIN_TOKEN=" "artifacts\zyphix\.dev.vars"') do set "TOKEN=%%b"
)
if "!TOKEN!"=="" (
  for /f "delims=" %%t in ('powershell -NoProfile -Command "-join ((48..57+65..90+97..122) | Get-Random -Count 40 | ForEach-Object {[char]$_})"') do set "TOKEN=%%t"
  > "artifacts\zyphix\.dev.vars" echo ADMIN_TOKEN=!TOKEN!
  echo   Saved to artifacts\zyphix\.dev.vars (git-ignored)
) else (
  echo   Using existing token from artifacts\zyphix\.dev.vars
)
echo !TOKEN!| %WR% secret put ADMIN_TOKEN
if errorlevel 1 (
  echo   Could not set the secret on Cloudflare. Fix the error above and run this file again.
  pause
  exit /b 1
)

echo.
echo [5/5] Filling product images. This takes 1-2 hours - keep this window open.
cd artifacts\zyphix
call corepack pnpm run images:local
call corepack pnpm run images:produce

echo.
echo ===== Done. Open https://zyphix.in/now to see the photos. =====
pause
