// scratch/test_adaptive.js
// Automated test script for Local Mastery and ZPD Lesson Generation

import { calculateNewMastery, getAdaptiveVocabulary } from "../src/lib/adaptiveLearning.js";
import { writingData } from "../src/data/vocabulary.js";
import { hskCompoundWords } from "../src/data/hskCompoundWords.js";

console.log("=== BẮT ĐẦU KIỂM THỬ THUẬT TOÁN HỌC THÍCH ỨNG ===");

// 1. Kiểm thử Thuật toán tính Mastery (ELO)
console.log("\n1. Kiểm thử Thuật toán Mastery (calculateNewMastery):");
const initialMastery = 1000;
const masteryUp = calculateNewMastery(initialMastery, 1.0); // 100% đúng
const masteryDown = calculateNewMastery(initialMastery, 0.2); // 20% đúng
const masteryNeutral = calculateNewMastery(initialMastery, 0.75); // 75% đúng

console.log(`- Khởi tạo: ${initialMastery}`);
console.log(`- Trả lời đúng 100%: ${masteryUp} (Mong đợi: > 1000)`);
console.log(`- Trả lời đúng 20%: ${masteryDown} (Mong đợi: < 1000)`);
console.log(`- Trả lời đúng 75%: ${masteryNeutral} (Mong đợi: ~1000)`);

if (masteryUp > initialMastery && masteryDown < initialMastery) {
  console.log("=> ĐẠT: Thuật toán Mastery hoạt động chính xác!");
} else {
  console.error("=> LỖI: Thuật toán Mastery sai lệch!");
  process.exit(1);
}

// 2. Kiểm thử Thuật toán ZPD Lesson Builder (getAdaptiveVocabulary)
console.log("\n2. Kiểm thử Sinh Bài Học ZPD (getAdaptiveVocabulary):");

// Chuẩn bị Mock Data
const vocabularyPool = [...writingData, ...hskCompoundWords];
console.log(`- Tổng số từ trong Kho Từ Vựng Hợp Nhất: ${vocabularyPool.length}`);

// Mock logs (để tạo Weakness)
const reviewLogs = [
  { wordId: "w201", correct: false, timestamp: new Date().toISOString() },
  { wordId: "w201", correct: false, timestamp: new Date().toISOString() },
  { wordId: "w202", correct: false, timestamp: new Date().toISOString() },
  { wordId: "w203", correct: true, timestamp: new Date().toISOString() },
];

const selectedLevel = 3;
const targetWords = getAdaptiveVocabulary("typing", selectedLevel, vocabularyPool, reviewLogs, 1200);

console.log(`- Số lượng từ được sinh ra: ${targetWords.length}`);
console.log("- Danh sách từ vựng thích ứng:");
targetWords.forEach((word, idx) => {
  console.log(`  [${idx + 1}] ID: ${word.id} | Chữ Hán: ${word.simplified} | Pinyin: ${word.pinyin} | Level: ${word.level} | Nghĩa: ${word.translation}`);
});

// Kiểm tra tính hợp lệ
if (targetWords.length === 10) {
  console.log("=> ĐẠT: Sinh chính xác 10 từ thích ứng!");
} else {
  console.error(`=> LỖI: Sinh sai số lượng từ (${targetWords.length})!`);
  process.exit(1);
}

// Kiểm tra xem có chứa từ yếu điểm "w201" không
const hasWeakness = targetWords.some(w => w.id === "w201");
console.log(`- Chứa từ yếu điểm trước đó: ${hasWeakness ? "ĐÚNG" : "SAI"}`);

console.log("\n=== TẤT CẢ KIỂM THỬ ĐÃ THÀNH CÔNG! ===");
