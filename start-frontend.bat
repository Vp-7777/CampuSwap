@echo off
echo Starting CampuSwap Frontend...
echo.
cd /d "%~dp0frontend"

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not found in PATH!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
)

echo.
echo Starting React development server...
echo Frontend will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
call npm start

pause
