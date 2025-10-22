@echo off
title GlucoPredict Backend Server
echo.
echo ===============================================
echo    🚀 Starting GlucoPredict Backend Server
echo ===============================================
echo.
cd /d "%~dp0backend"
echo 📡 Starting Flask server on http://localhost:8000
echo 💡 Press Ctrl+C to stop the server
echo.
python main.py
echo.
echo ⏹️  Backend server stopped
pause