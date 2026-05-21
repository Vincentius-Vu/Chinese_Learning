# -*- coding: utf-8 -*-
import json
import re
import urllib.parse
import requests

def main():
    vocab_path = "src/data/vocabulary.js"
    output_path = "src/data/sinoVietMap.js"

    print("Reading vocabulary.js...")
    with open(vocab_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract all simplified characters from writingData
    matches = re.findall(r'simplified:\s*["\']([^"\']+)["\']', content)
    
    # Get unique single characters
    unique_chars = []
    for match in matches:
        if len(match) == 1 and match not in unique_chars:
            unique_chars.append(match)

    print("Found unique characters in database.")

    # Combine into a single string for bulk lookup
    input_str = "".join(unique_chars)

    url = "https://hvdic.thivien.net/transcript-query.json.php"
    data = {
        'mode': 'trans',
        'lang': '1',
        'input': input_str
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    print("Sending POST request to thivien.net API...")
    try:
        r = requests.post(url, headers=headers, data=data)
        r.raise_for_status()
        resp_json = r.json()
    except Exception as e:
        print("Error calling API")
        return

    if resp_json.get("message") != "OK":
        print("API Error message")
        return

    results = resp_json.get("result", [])
    sino_viet_mapping = {}

    for item in results:
        char = item.get("i")
        readings = item.get("o", [])
        if char and readings:
            # Capitalize each reading
            formatted_readings = [r.capitalize() for r in readings]
            # Join with slashes
            sino_viet_mapping[char] = " / ".join(formatted_readings)

    # Write to sinoVietMap.js
    print("Writing results...")
    with open(output_path, "w", encoding="utf-8") as out_f:
        out_f.write("// Sino-Vietnamese (Han-Viet) pronunciation lookup map for HSK 1-6\n")
        out_f.write("export const sinoVietMap = {\n")
        for char in unique_chars:
            val = sino_viet_mapping.get(char, "")
            out_f.write(f'  "{char}": "{val}",\n')
        out_f.write("};\n")

    print("SUCCESS: Finished creating sinoVietMap.js!")

if __name__ == "__main__":
    main()
