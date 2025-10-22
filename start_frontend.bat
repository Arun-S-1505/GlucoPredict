@echo off
title GlucoPredict Frontend
echo.
echo ===============================================
echo    🎨 Starting GlucoPredict Frontend
echo ===============================================
echo.
cd /d "%~dp0"
echo 🌐 Starting development server...
echo 💡 Your app will open in your browser automatically
echo 💡 Press Ctrl+C to stop the server
echo.
npm run dev
echo.
echo ⏹️  Frontend server stopped
pause