@echo off
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
  start "" "%~dp0index.html"
  exit /b
)

set PORT=4180
start "Royal Ludo Server" /min python -m http.server %PORT% --bind 127.0.0.1
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/index.html"
