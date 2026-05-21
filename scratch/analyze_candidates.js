import fs from "fs";
import path from "path";

// Read all three files
const content100 = fs.readFileSync("scratch/expand_vocab.js", "utf8");
const content200 = fs.readFileSync("scratch/expand_vocab_to_200.js", "utf8");
const content300 = fs.readFileSync("scratch/expand_vocab_to_300.js", "utf8");

// Parse candidates using regex or basic matching
function extractCandidates(content) {
  const match = content.match(/const candidates = ({[\s\S]*?});/);
  if (!match) return null;
  try {
    const fn = new Function("return " + match[1]);
    return fn();
  } catch (e) {
    console.error("Eval error", e);
    return null;
  }
}

const cand100 = extractCandidates(content100);
const cand200 = extractCandidates(content200);
const cand300 = extractCandidates(content300);

if (cand100 && cand200 && cand300) {
  for (let l = 1; l <= 6; l++) {
    const list100 = cand100[l] || [];
    const list200 = cand200[l] || [];
    const list300 = cand300[l] || [];
    
    // Combine simplified characters
    const simp100 = list100.map(x => Array.isArray(x) ? x[0] : x.simplified);
    const simp200 = list200.map(x => Array.isArray(x) ? x[0] : x.simplified);
    const simp300 = list300.map(x => Array.isArray(x) ? x[0] : x.simplified);
    
    const union = new Set([...simp100, ...simp200, ...simp300]);
    console.log(`Level ${l}: 100 has ${list100.length}, 200 has ${list200.length}, 300 has ${list300.length}. Combined unique: ${union.size}`);
  }
} else {
  console.log("Failed to extract candidates");
}
