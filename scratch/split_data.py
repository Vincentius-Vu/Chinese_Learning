import re
import os

base_path = r"c:\Users\T14\Documents\GitHub\Chinese_Learning\src\data"
vocab_file = os.path.join(base_path, "vocabulary.js")

with open(vocab_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Split content by 'export const '
parts = content.split('\nexport const ')
# parts[0] is the top of the file including writingData since it starts with 'export const writingData'
# Wait, the first one might not have \n if it's the first line, but writingData has comments before it.

new_vocab = parts[0]
reading_data = ""
listening_data = ""
speaking_data = ""

for part in parts[1:]:
    if part.startswith('readingData'):
        reading_data = "export const " + part
    elif part.startswith('listeningData'):
        listening_data = "export const " + part
    elif part.startswith('speakingData'):
        speaking_data = "export const " + part
    else:
        new_vocab += '\nexport const ' + part

# Write the new files
if reading_data:
    with open(os.path.join(base_path, "readingData.js"), "w", encoding='utf-8') as f:
        f.write(reading_data)
        print("Created readingData.js")
if listening_data:
    with open(os.path.join(base_path, "listeningData.js"), "w", encoding='utf-8') as f:
        f.write(listening_data)
        print("Created listeningData.js")
if speaking_data:
    with open(os.path.join(base_path, "speakingData.js"), "w", encoding='utf-8') as f:
        f.write(speaking_data)
        print("Created speakingData.js")

with open(vocab_file, "w", encoding='utf-8') as f:
    f.write(new_vocab)
    print("Updated vocabulary.js")

print("Split completed successfully!")
