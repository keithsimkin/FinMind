@echo off
echo Deploying FinMind to Firebase Hosting...
echo.

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Firebase CLI is not installed!
    echo Please install it with: npm install -g firebase-tools
    pause
    exit /b 1
)

REM Deploy to Firebase
firebase deploy

echo.
echo Deployment complete!
pause
