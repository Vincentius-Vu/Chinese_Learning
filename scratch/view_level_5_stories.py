import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("src/data/vocabulary.js", "r", encoding="utf-8") as f:
    content = f.read()

start_idx = content.find("export const readingData = [")
if start_idx == -1:
    print("Could not find readingData")
    exit(1)

# Find all story blocks
# A story block usually spans from { id: "rX", ... } to the next story or end of array
# Let's extract all blocks that have level: 5
story_blocks = re.findall(r'\{\s*id:\s*"r\d+".*?quizzes:\s*\[.*?\]\s*\}', content[start_idx:], re.DOTALL)

level_5_stories = []
for block in story_blocks:
    level_match = re.search(r'level:\s*(\d+)', block)
    level = int(level_match.group(1)) if level_match else 0
    if level == 5:
        id_match = re.search(r'id:\s*"(r\d+)"', block)
        title_match = re.search(r'titleSimplified:\s*"([^"]+)"', block)
        trans_match = re.search(r'translationTitle:\s*"([^"]+)"', block)
        content_match = re.search(r'contentSimplified:\s*"([^"]+)"', block)
        
        level_5_stories.append({
            "id": id_match.group(1) if id_match else "",
            "title": title_match.group(1) if title_match else "",
            "translation": trans_match.group(1) if trans_match else "",
            "content": content_match.group(1) if content_match else ""
        })

print(f"Extracted {len(level_5_stories)} Level 5 stories.")
for s in level_5_stories:
    print(f"\nID: {s['id']}")
    print(f"Title: {s['title']} ({s['translation']})")
    print(f"Content:\n{s['content']}")
