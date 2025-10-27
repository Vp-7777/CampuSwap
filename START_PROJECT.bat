@echo off
echo ========================================
echo    🎓 CampuSwap - Starting Project
echo ========================================
echo.

echo Step 1: Checking PostgreSQL...
net start | find "postgresql" >nul
if errorlevel 1 (
    echo Starting PostgreSQL...
    net start postgresql-x64-14
) else (
    echo PostgreSQL is already running
)

echo.
echo Step 2: Creating database (if not exists)...
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS campuswap;" 2>nul

echo.
echo Step 3: Starting Backend...
echo Opening new window for backend...
start "CampuSwap Backend" cmd /k "cd C:\Users\VISHAL\CampuSwap\backend && mvn spring-boot:run"

echo.
echo Waiting 30 seconds for backend to start...
timeout /t 30 /nobreak

echo.
echo Step 4: Starting Frontend...
echo Opening new window for frontend...
start "CampuSwap Frontend" cmd /k "cd C:\Users\VISHAL\CampuSwap\frontend && npm start"

echo.
echo ========================================
echo ✅ CampuSwap is starting!
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
