@echo off
cd /d "%~dp0"
chcp 65001 >nul
call npm run build && call npx wrangler deploy
pause
