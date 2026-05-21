import fs from "fs";
import { writingData as coreData } from "../src/data/vocabulary.js";

// Load candidate simplified characters
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
        let simplified;
        if (Array.isArray(item)) {
          simplified = item[0];
        } else {
          simplified = item.simplified;
        }
        if (simplified) {
          allCand[lvl].push(simplified);
        }
      });
    }
  });
  
  return allCand;
}

const candidatesPool = loadAllCandidates();
const lvl2Existing = new Set();

coreData.filter(w => w.level === 2).forEach(w => lvl2Existing.add(w.simplified));
candidatesPool[2].forEach(w => lvl2Existing.add(w));

console.log("Level 2 Existing Simplified Words count:", lvl2Existing.size);
console.log(Array.from(lvl2Existing).join(", "));
