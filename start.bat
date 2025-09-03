@echo off
echo ========================================
echo Daily Coding Challenge Website Setup
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js is installed.
echo.

echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    echo.
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.

echo Starting the Daily Coding Challenge server...
echo.
echo The website will be available at: http://localhost:3000
echo.
echo Default login credentials:
echo ========================
echo Admin:   admin / admin123
echo Faculty: faculty1 / faculty123  
echo Student: student1 / student123
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
