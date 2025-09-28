@echo off
REM Auto-generate structure.json for content blog
REM This script can be run manually or set up as a scheduled task

echo Generating structure.json from src directory...
python generate_structure.py

if %errorlevel% neq 0 (
    echo Failed to generate structure.json
    pause
    exit /b 1
)

echo structure.json generated successfully!
pause