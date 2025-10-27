@echo off
echo ========================================
echo    Starting CampuSwap Application
echo ========================================
echo.

REM Start Backend in a new window
echo [1/2] Starting Backend Server...
start "CampuSwap Backend" cmd /k "%~dp0start-backend.bat"

REM Wait a moment before starting frontend
timeout /t 3 /nobreak >nul

REM Start Frontend in a new window
echo [2/2] Starting Frontend Server...
start "CampuSwap Frontend" cmd /k "%~dp0start-frontend.bat"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Two terminal windows should open.
echo Wait for both servers to start, then open your browser.
echo.
pause
