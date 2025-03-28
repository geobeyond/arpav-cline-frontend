output_dir="${1:-.}"

output_file="${output_dir}/injectedEnv.js"

echo "(Re)generating '${output_file}' by writing environment variables starting with 'ARPAV_' into it..."

# Start writing the JavaScript file
cat > "$output_file" << EOL
// This file is autogenerated
window.injectedEnv = {
EOL

# Process only environment variables starting with ARPAV_
env | grep "^ARPAV_" | while IFS='=' read -r key value; do
    # Clean the value: escape quotes and backslashes
    cleaned_value=$(echo "$value" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')

    # Write the key-value pair as a JavaScript property
    echo "  \"$key\": \"$cleaned_value\"," >> "$output_file"
done

cat >> "$output_file" << EOL
};

EOL