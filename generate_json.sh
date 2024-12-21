#!/bin/bash

# File path
FILE_PATH="structure.json"
ROOT_DIR="src"

# Function to format the name
format_name() {
    local name="$1"
    name="${name%.md}"  # Remove .md extension
    name=$(echo "$name" | sed -r 's/([a-z])([A-Z])/\1 \2/g')  # Add space before capital letters
    name=$(echo "$name" | sed -r 's/([A-Z])([A-Z][a-z])/\1 \2/g')  # Add space between consecutive capital letters
    echo "$name"
}

# Function to recursively generate JSON structure from directory
generate_json() {
    local dir_path="$1"
    local indent="$2"
    local json=""
    local has_md_file=false

    json+="${indent}{\n"
    json+="${indent}  \"name\": \"$(basename "$dir_path")\",\n"
    json+="${indent}  \"isDirectory\": true,\n"
    json+="${indent}  \"children\": [\n"

    local first=true
    for entry in "$dir_path"/*; do
        if [ -d "$entry" ]; then
            local child_json=$(generate_json "$entry" "    $indent")
            if [ -n "$child_json" ]; then
                if [ "$first" = true ]; then
                    first=false
                else
                    json+=",\n"
                fi
                json+="$child_json"
            fi
        elif [[ "$entry" == *.md ]]; then
            if [ "$first" = true ]; then
                first=false
            else
                json+=",\n"
            fi
            local formatted_name=$(format_name "$(basename "$entry")")
            json+="${indent}    {\n"
            json+="${indent}      \"name\": \"$formatted_name\",\n"
            json+="${indent}      \"isDirectory\": false,\n"
            json+="${indent}      \"path\": \"$ROOT_DIR/${entry/$ROOT_DIR\//}\"\n"
            json+="${indent}    }"
            has_md_file=true
        fi
    done

    json+="\n${indent}  ]\n"
    json+="${indent}}"

    if [ "$has_md_file" = true ]; then
        echo -e "$json"
    else
        echo ""
    fi
}

# Generate JSON structure from the contents of the "src" directory
json_structure=""
first=true
for entry in "$ROOT_DIR"/*; do
    if [ -d "$entry" ] || [[ "$entry" == *.md ]]; then
        entry_json=$(generate_json "$entry" "  ")
        if [ -n "$entry_json" ]; then
            if [ "$first" = true ]; then
                first=false
            else
                json_structure+=",\n"
            fi
            json_structure+="$entry_json"
        fi
    fi
done

# Write the updated JSON to the file
echo -e "{\n  \"name\": \"root\",\n  \"isDirectory\": true,\n  \"children\": [\n$json_structure\n  ]\n}" | jq '.' > "$FILE_PATH"

echo "JSON structure updated successfully."