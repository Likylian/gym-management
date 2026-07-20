@echo off
REM ============================================
REM  Gym Mini-Program - Spring Boot Launcher
REM  Usage: double-click this file
REM ============================================

cd /d "%~dp0"
cd gym\gym-backend

title Gym Backend (port 8080)

echo ============================================
echo  CWD: %CD%
echo ============================================

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080.*LISTENING"') do (
    echo [cleanup] kill stale PID=%%a on port 8080
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

if not exist "target\gym-backend-1.0.0.jar" (
    echo [ERROR] target\gym-backend-1.0.0.jar not found
    echo        Please run: mvn package -DskipTests
    echo.
    pause
    exit /b 1
)

"C:\Program Files\Java\jdk-26.0.1\bin\java.exe" ^
  -Dserver.port=8080 ^
  -Dserver.address=0.0.0.0 ^
  -jar target\gym-backend-1.0.0.jar

pause
