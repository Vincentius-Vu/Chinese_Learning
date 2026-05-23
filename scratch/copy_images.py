import os
import shutil

artifact_dir = r"C:\Users\T14\.gemini\antigravity\brain\afd7d9a7-4cfc-4e09-86a1-ddbb11f737f6"
target_dir = r"c:\Users\T14\Documents\GitHub\Chinese_Learning\public\images\stories"

# Mapping of file prefixes to their final names
files = [
    ("story_r43", "r43.webp"),
    ("story_r44", "r44.webp"),
    ("story_r45", "r45.webp"),
    ("story_r46", "r46.webp"),
    ("story_r47", "r47.webp")
]

# Find the exact filenames in the artifact directory
for prefix, final_name in files:
    for filename in os.listdir(artifact_dir):
        if filename.startswith(prefix) and filename.endswith(".png"):
            source_path = os.path.join(artifact_dir, filename)
            target_path = os.path.join(target_dir, final_name)
            
            # Try to use PIL to convert to webp properly
            try:
                from PIL import Image
                img = Image.open(source_path)
                img.save(target_path, "webp")
                print(f"Converted {filename} to {final_name} using PIL")
            except ImportError:
                # Fallback to copy and rename
                shutil.copy(source_path, target_path)
                print(f"Copied {filename} to {final_name} (no PIL)")
            break
