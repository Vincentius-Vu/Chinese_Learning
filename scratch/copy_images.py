import os
import shutil
import glob

artifact_dir = r"C:\Users\T14\.gemini\antigravity\brain\afd7d9a7-4cfc-4e09-86a1-ddbb11f737f6"
target_dir = r"public/images/stories"

os.makedirs(target_dir, exist_ok=True)

mappings = {
    "story_r8": "r8.webp",
    "story_r9": "r9.webp",
    "story_r10": "r10.webp",
    "story_r18": "r18.webp",
    "story_r32": "r32.webp",
    "story_r33": "r33.webp",
    "story_r34": "r34.webp",
    "story_r11": "r11.webp"
}

for prefix, target_name in mappings.items():
    search_pattern = os.path.join(artifact_dir, f"{prefix}_*.png")
    matching_files = glob.glob(search_pattern)
    
    if matching_files:
        # Get the latest one if multiple exist
        source_file = max(matching_files, key=os.path.getmtime)
        dest_file = os.path.join(target_dir, target_name)
        shutil.copy2(source_file, dest_file)
        print(f"Copied {os.path.basename(source_file)} -> {dest_file}")
    else:
        print(f"No file found for pattern: {prefix}_*.png")

print("Copy completed!")
