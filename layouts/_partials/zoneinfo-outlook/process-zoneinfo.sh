#!/usr/bin/env bash
# Process zoneinfo-outlook files for Hugo template compatibility
#
# This script:
# 1. Removes VCALENDAR wrapper (lines 1-3 and last line)
# 2. Adds INTERVAL=1 to RRULE lines that don't have it
# 3. Keeps LAST-MODIFIED and https:// TZURL (both are valid improvements)
#
# Usage:
#   ./process-zoneinfo.sh [file.ics]           # Process single file
#   ./process-zoneinfo.sh [-r|--recursive]     # Process all .ics files recursively
#   ./process-zoneinfo.sh                      # Process all .ics files in current directory

set -euo pipefail

# Function to check if file needs processing
needs_processing() {
    local file="$1"
    # Check if first line is BEGIN:VCALENDAR
    head -n 1 "$file" | grep -q "^BEGIN:VCALENDAR$"
}

# Function to process a single file
process_file() {
    local input_file="$1"
    local temp_file="${input_file}.tmp"
    
    # Skip if already processed
    if ! needs_processing "$input_file"; then
        echo "Skipping (already processed): $input_file"
        return 0
    fi
    
    echo "Processing: $input_file"
    
    # Process file: remove wrapper and add INTERVAL=1 to RRULE lines
    awk '
    BEGIN { 
        line_num = 0
        # Store all lines in array
    }
    {
        line_num++
        lines[line_num] = $0
    }
    END {
        # Process all lines except first 3 and last
        for (i = 4; i < line_num; i++) {
            line = lines[i]
            
            # Add INTERVAL=1 to RRULE lines that don'\''t have it
            if (line ~ /^RRULE:/ && line !~ /INTERVAL=/) {
                # Match FREQ=VALUE followed by semicolon
                if (match(line, /FREQ=[A-Z]+;/)) {
                    freq_end = RSTART + RLENGTH - 1
                    before = substr(line, 1, freq_end)
                    after = substr(line, freq_end + 1)
                    print before "INTERVAL=1;" after
                    continue
                }
                # Match FREQ=VALUE at end of line
                else if (match(line, /FREQ=[A-Z]+$/)) {
                    print line ";INTERVAL=1"
                    continue
                }
            }
            
            # Print all other lines unchanged
            print line
        }
    }
    ' "$input_file" > "$temp_file"
    
    # Replace original file
    mv "$temp_file" "$input_file"
    
    echo "  ✓ Processed successfully"
}

# Main execution
if [ $# -eq 1 ]; then
    # Check if argument is recursive flag
    if [ "$1" = "-r" ] || [ "$1" = "--recursive" ]; then
        # Process all .ics files recursively
        echo "Processing all .ics files recursively..."
        file_count=0
        processed_count=0
        skipped_count=0
        
        while IFS= read -r -d '' file; do
            file_count=$((file_count + 1))
            if needs_processing "$file"; then
                process_file "$file"
                processed_count=$((processed_count + 1))
            else
                skipped_count=$((skipped_count + 1))
            fi
        done < <(find . -name "*.ics" -type f -print0)
        
        echo ""
        echo "Summary:"
        echo "  Total files: $file_count"
        echo "  Processed: $processed_count"
        echo "  Skipped (already processed): $skipped_count"
    elif [ ! -f "$1" ]; then
        echo "Error: File not found: $1" >&2
        exit 1
    else
        # Process single file
        process_file "$1"
    fi
else
    # Process all .ics files in current directory only (not recursive)
    shopt -s nullglob
    ics_files=(*.ics)
    
    if [ ${#ics_files[@]} -eq 0 ]; then
        echo "No .ics files found in current directory" >&2
        echo "Use -r or --recursive to process subdirectories" >&2
        exit 1
    fi
    
    echo "Processing ${#ics_files[@]} .ics files in current directory..."
    processed_count=0
    skipped_count=0
    
    for file in "${ics_files[@]}"; do
        if needs_processing "$file"; then
            process_file "$file"
            processed_count=$((processed_count + 1))
        else
            skipped_count=$((skipped_count + 1))
        fi
    done
    
    echo ""
    echo "Summary:"
    echo "  Processed: $processed_count"
    echo "  Skipped (already processed): $skipped_count"
fi
