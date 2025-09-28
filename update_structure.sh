#!/bin/bash
# Auto-generate structure.json for content blog
# This script can be run manually or set up as a cron job

echo "Generating structure.json from src directory..."
python3 generate_structure.py

if [ $? -ne 0 ]; then
    echo "Failed to generate structure.json"
    exit 1
fi

echo "structure.json generated successfully!"