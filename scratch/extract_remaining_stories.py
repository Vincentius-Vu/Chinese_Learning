import re
import json
import sys

# Set standard output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

with open("src/data/vocabulary.js", "r", encoding="utf-8") as f:
    content = f.read()

# Locate readingData
start_idx = content.find("export const readingData = [")
if start_idx == -1:
    print("Could not find readingData")
    exit(1)

stories = []
# Split by level block or similar, but let's do a more robust parsing by looking for active stories
# Let's search all story definitions
story_blocks = re.findall(r'\{\s*id:\s*"r\d+".*?quizzes:\s*\[', content[start_idx:], re.DOTALL)

for block in story_blocks:
    id_match = re.search(r'id:\s*"(r\d+)"', block)
    if not id_match:
        continue
    sid = id_match.group(1)
    
    level_match = re.search(r'level:\s*(\d+)', block)
    level = int(level_match.group(1)) if level_match else 0
    
    if level < 4:
        continue
        
    title_match = re.search(r'titleSimplified:\s*"([^"]+)"', block)
    title = title_match.group(1) if title_match else ""
    
    trans_match = re.search(r'translationTitle:\s*"([^"]+)"', block)
    trans = trans_match.group(1) if trans_match else ""
    
    stories.append({
        "id": sid,
        "level": level,
        "title": title,
        "translation": trans
    })

# Write to a JSON file as well to be safe
with open("scratch/remaining_stories.json", "w", encoding="utf-8") as out:
    json.dump(stories, out, ensure_ascii=False, indent=2)

print(f"Successfully extracted {len(stories)} stories.")
print(json.dumps(stories, ensure_ascii=False, indent=2))
