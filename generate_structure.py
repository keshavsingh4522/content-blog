#!/usr/bin/env python3
"""
Auto-generate structure.json from the current directory structure.
This script scans the src/ directory and creates a JSON structure
for the content blog navigation.
"""

import os
import json
import argparse
from pathlib import Path

def should_include_file(file_path):
    """Check if a file should be included in the structure."""
    # Include markdown files and some other formats
    allowed_extensions = {'.md', '.txt', '.html', '.json'}
    return file_path.suffix.lower() in allowed_extensions

def should_include_directory(dir_name):
    """Check if a directory should be included in the structure."""
    # Exclude common build/cache directories
    excluded_dirs = {'.git', '.vscode', '__pycache__', 'node_modules', 'bin', 'obj'}
    return dir_name not in excluded_dirs and not dir_name.startswith('.')

def create_structure_item(path, base_path):
    """Create a structure item from a file or directory path."""
    relative_path = path.relative_to(base_path)
    # Convert path to forward slashes
    path_str = str(relative_path).replace('\\', '/')
    
    if path.is_file():
        return {
            "name": path.name,
            "path": f"src/{path_str}",  # Add src/ prefix
            "isDirectory": False
        }
    else:
        children = []
        try:
            # Sort items: directories first, then files, both alphabetically
            items = sorted(path.iterdir(), key=lambda x: (x.is_file(), x.name.lower()))
            
            for item in items:
                if item.is_file() and should_include_file(item):
                    children.append(create_structure_item(item, base_path))
                elif item.is_dir() and should_include_directory(item.name):
                    child_structure = create_structure_item(item, base_path)
                    if child_structure["children"]:  # Only include directories with content
                        children.append(child_structure)
        except PermissionError:
            print(f"Permission denied accessing {path}")
        
        return {
            "name": path.name,
            "path": f"src/{path_str}",  # Add src/ prefix
            "isDirectory": True,
            "children": children
        }

def generate_structure_json(src_dir="src", output_file="structure.json"):
    """Generate the structure.json file from the src directory."""
    base_path = Path(src_dir)
    
    if not base_path.exists():
        print(f"Error: Directory '{src_dir}' does not exist")
        return False
    
    if not base_path.is_dir():
        print(f"Error: '{src_dir}' is not a directory")
        return False
    
    print(f"Scanning directory: {base_path.absolute()}")
    
    # Create the root structure
    structure = {
        "name": "src",
        "path": "src",  # Add src path for root
        "isDirectory": True,
        "children": []
    }
    
    try:
        # Sort items: directories first, then files, both alphabetically
        items = sorted(base_path.iterdir(), key=lambda x: (x.is_file(), x.name.lower()))
        
        for item in items:
            if item.is_file() and should_include_file(item):
                structure["children"].append(create_structure_item(item, base_path))
            elif item.is_dir() and should_include_directory(item.name):
                child_structure = create_structure_item(item, base_path)
                if child_structure["children"]:  # Only include directories with content
                    structure["children"].append(child_structure)
    except PermissionError:
        print(f"Permission denied accessing {base_path}")
        return False
    
    # Write the structure to JSON file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(structure, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Successfully generated {output_file}")
        print(f"📁 Found {count_items(structure)} items")
        return True
        
    except Exception as e:
        print(f"Error writing {output_file}: {e}")
        return False

def count_items(structure):
    """Count total items in the structure."""
    count = 1  # Count the current item
    if structure.get("children"):
        for child in structure["children"]:
            count += count_items(child)
    return count

def watch_directory(src_dir="src", output_file="structure.json", interval=2):
    """Watch the directory for changes and regenerate structure.json."""
    import time
    import hashlib
    
    def get_dir_hash(path):
        """Get a hash of the directory structure for change detection."""
        hash_md5 = hashlib.md5()
        try:
            for root, dirs, files in os.walk(path):
                # Sort for consistent hashing
                dirs.sort()
                files.sort()
                
                for name in files:
                    if should_include_file(Path(name)):
                        hash_md5.update(f"{root}/{name}".encode('utf-8'))
                
                for name in dirs:
                    if should_include_directory(name):
                        hash_md5.update(f"{root}/{name}/".encode('utf-8'))
        except Exception as e:
            print(f"Error calculating hash: {e}")
            
        return hash_md5.hexdigest()
    
    print(f"👀 Watching {src_dir} for changes (Ctrl+C to stop)...")
    
    # Initial generation
    generate_structure_json(src_dir, output_file)
    last_hash = get_dir_hash(src_dir)
    
    try:
        while True:
            time.sleep(interval)
            current_hash = get_dir_hash(src_dir)
            
            if current_hash != last_hash:
                print(f"📝 Changes detected, regenerating {output_file}...")
                if generate_structure_json(src_dir, output_file):
                    last_hash = current_hash
                else:
                    print("❌ Failed to regenerate structure.json")
                    
    except KeyboardInterrupt:
        print("\n👋 Stopped watching directory")

def main():
    parser = argparse.ArgumentParser(description='Generate structure.json for content blog')
    parser.add_argument('--src', default='src', help='Source directory to scan (default: src)')
    parser.add_argument('--output', default='structure.json', help='Output file (default: structure.json)')
    parser.add_argument('--watch', action='store_true', help='Watch directory for changes')
    parser.add_argument('--interval', type=int, default=2, help='Watch interval in seconds (default: 2)')
    
    args = parser.parse_args()
    
    if args.watch:
        watch_directory(args.src, args.output, args.interval)
    else:
        success = generate_structure_json(args.src, args.output)
        exit(0 if success else 1)

if __name__ == "__main__":
    main()