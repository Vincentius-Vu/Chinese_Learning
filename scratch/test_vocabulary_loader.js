import fs from "fs";
import path from "path";
import { writingData as coreData } from "../src/data/vocabulary.js";

// Read candidates from expand_vocab.js, expand_vocab_to_200.js, and expand_vocab_to_300.js
function loadAllCandidates() {
  const files = [
    "scratch/expand_vocab.js",
    "scratch/expand_vocab_to_200.js",
    "scratch/expand_vocab_to_300.js"
  ];
  
  const allCand = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  
  function extractCandidates(content) {
    const match = content.match(/const candidates = ({[\s\S]*?});/);
    if (!match) return null;
    try {
      const fn = new Function("return " + match[1]);
      return fn();
    } catch (e) {
      return null;
    }
  }

  files.forEach(f => {
    if (!fs.existsSync(f)) return;
    const content = fs.readFileSync(f, "utf8");
    const candObj = extractCandidates(content);
    if (!candObj) return;
    
    for (let lvl = 1; lvl <= 6; lvl++) {
      const rawList = candObj[lvl] || [];
      rawList.forEach(item => {
        let simplified, traditional, pinyin, sinoViet, translation, category;
        if (Array.isArray(item)) {
          [simplified, traditional, pinyin, sinoViet, translation, category] = item;
        } else {
          ({ simplified, traditional, pinyin, sinoViet, translation, category } = item);
        }
        
        if (simplified) {
          allCand[lvl].push({
            simplified,
            traditional: traditional || simplified,
            pinyin: pinyin || "",
            sinoViet: sinoViet || "",
            translation: translation || "",
            category: category || "Từ vựng / Vocabulary"
          });
        }
      });
    }
  });
  
  return allCand;
}

const candidatesPool = loadAllCandidates();
const levelGroups = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
coreData.forEach(w => {
  levelGroups[w.level].push(w);
});

for (let lvl = 1; lvl <= 6; lvl++) {
  const currentLvlWords = [...levelGroups[lvl]];
  const currentLvlSimplified = new Set(currentLvlWords.map(w => w.simplified));
  const currentLvlTraditional = new Set(currentLvlWords.map(w => w.traditional));
  
  const lvlCandidates = candidatesPool[lvl] || [];
  let addedCount = 0;
  
  for (const cand of lvlCandidates) {
    if (currentLvlSimplified.has(cand.simplified) || currentLvlTraditional.has(cand.traditional)) {
      continue;
    }
    currentLvlSimplified.add(cand.simplified);
    currentLvlTraditional.add(cand.traditional);
    addedCount++;
  }
  
  console.log(`Level ${lvl}: Core = ${levelGroups[lvl].length}, Candidates (no-dups) = ${addedCount}, Combined = ${levelGroups[lvl].length + addedCount}, Missing = ${Math.max(0, 300 - (levelGroups[lvl].length + addedCount))}`);
}
