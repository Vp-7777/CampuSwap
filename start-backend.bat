@echo off
echo Starting CampuSwap Backend Server...
echo.
cd /d "%~dp0backend"

REM Check if Maven is in PATH
where mvn >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Maven is not found in PATH!
    echo Please install Maven or add it to your PATH environment variable.
    echo.
    echo You can download Maven from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo Cleaning and building the project...
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Starting Spring Boot application...
echo Backend will be available at http://localhost:8080
echo Press Ctrl+C to stop the server
echo.
call mvn spring-boot:run

pause
