#!/bin/bash

# Usage: ./dump_structure_and_content.sh /path/to/folder output.txt

INPUT_DIR="$1"
OUTPUT_FILE="$2"

if [[ -z "$INPUT_DIR" || -z "$OUTPUT_FILE" ]]; then
    echo "Usage: $0 <input_directory> <output_file>"
    exit 1
fi

# Ensure the output file is empty
> "$OUTPUT_FILE"

# Function to handle each file and directory
dump_content() {
    local current_dir="$1"

    # Find all files and directories inside current_dir
    find "$current_dir" -print | while IFS= read -r path; do
        if [ -d "$path" ]; then
            echo "### Directory: $path" >> "$OUTPUT_FILE"
        elif [ -f "$path" ]; then
            echo "" >> "$OUTPUT_FILE"
            echo "==================== FILE: $path ====================" >> "$OUTPUT_FILE"
            # Check if it's a binary file (optional: remove to include all files)
            if file "$path" | grep -q "text"; then
                cat "$path" >> "$OUTPUT_FILE"
            else
                echo "[Binary file omitted]" >> "$OUTPUT_FILE"
            fi
            echo "" >> "$OUTPUT_FILE"
            echo "=====================================================" >> "$OUTPUT_FILE"
        fi
    done
}

# Run the function
dump_content "$INPUT_DIR"

echo "Done. Output written to $OUTPUT_FILE"
