import { readingData } from "../src/data/vocabulary.js";

console.log("=== CATALOG OF ALL READING STORIES ===");
readingData.forEach((story, idx) => {
  console.log(`${idx + 1}. ID: ${story.id} | Level: ${story.level} | Title: ${story.titleSimplified} (${story.translationTitle})`);
});
