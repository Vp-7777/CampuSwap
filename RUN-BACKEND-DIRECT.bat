@echo off
echo ==========================================
echo   Running CampuSwap Backend with Java
echo ==========================================
echo.

cd /d "%~dp0backend"

REM Check if backend is compiled
if not exist "target\classes\com\campuswap\CampuswapApplication.class" (
    echo ERROR: Backend not compiled!
    echo Please compile first or use IntelliJ IDEA
    pause
    exit /b 1
)

echo Checking for dependencies...
if not exist "target\campuswap-backend-1.0.0.jar" (
    echo.
    echo ERROR: JAR file not found!
    echo Please use one of these methods:
    echo.
    echo METHOD 1 - IntelliJ IDEA (EASIEST):
    echo   1. Open IntelliJ IDEA
    echo   2. File -^> Open -^> Select 'backend' folder
    echo   3. Wait for dependencies to download
    echo   4. Right-click CampuswapApplication.java -^> Run
    echo.
    echo METHOD 2 - Maven (if installed):
    echo   1. Open terminal in 'backend' folder
    echo   2. Run: mvn clean package -DskipTests
    echo   3. Then run this script again
    echo.
    pause
    exit /b 1
)

echo.
echo Starting backend server...
echo Backend URL: http://localhost:8080
echo Press Ctrl+C to stop
echo.

java -jar target\campuswap-backend-1.0.0.jar

pause
