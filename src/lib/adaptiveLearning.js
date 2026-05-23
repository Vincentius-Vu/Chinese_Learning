// src/lib/adaptiveLearning.js
// Thư viện giải thuật học thích ứng cục bộ (Adaptive Learning & ZPD)
// Hoạt động 100% offline trên trình duyệt

import { etymologyData } from "../data/etymologyData.js";

/**
 * Tính toán điểm Mastery mới cho một kỹ năng dựa trên tỷ lệ trả lời đúng
 * @param {number} currentMastery Điểm Mastery hiện tại (500 - 2000)
 * @param {number} percentCorrect Tỷ lệ trả lời đúng (0.0 - 1.0)
 * @returns {number} Điểm Mastery mới đã được giới hạn trong khoảng [500, 2000]
 */
export function calculateNewMastery(currentMastery = 1000, percentCorrect = 0.75) {
  let delta = 0;
  if (percentCorrect >= 0.8) {
    // Tăng điểm khi hiệu suất từ 80% trở lên
    delta = 400 * (percentCorrect - 0.75); // Lên đến +100 điểm khi đạt 100% đúng
  } else if (percentCorrect < 0.7) {
    // Giảm điểm khi hiệu suất dưới 70%
    delta = -400 * (0.75 - percentCorrect); // Giảm đến -300 điểm khi 0% đúng
  }
  
  const newMastery = currentMastery + delta;
  return Math.max(500, Math.min(2000, Math.round(newMastery)));
}

/**
 * Tìm các bộ thủ liên quan giữa một chữ/từ mục tiêu và tập hợp các chữ đã học
 * @param {string} word Từ mục tiêu cần kiểm tra
 * @param {Set<string>} learnedChars Tập hợp các chữ đơn người dùng đã học/thành thạo
 * @returns {boolean} True nếu từ mục tiêu chia sẻ bộ thủ hoặc chữ đơn với từ đã học
 */
export function findRadicalOrCharRelationship(word, learnedChars = new Set()) {
  if (!word || learnedChars.size === 0) return false;

  // 1. Kiểm tra chia sẻ chữ đơn trực tiếp (Direct Character Overlap)
  for (const char of word) {
    if (learnedChars.has(char)) {
      return true;
    }
  }

  // 2. Kiểm tra chia sẻ bộ thủ gián tiếp (Radical Sharing) qua etymologyData
  const learnedRadicals = new Set();
  learnedChars.forEach(char => {
    const ety = etymologyData[char];
    if (ety && ety.radicalSymbol) {
      learnedRadicals.add(ety.radicalSymbol);
    }
  });

  for (const char of word) {
    const ety = etymologyData[char];
    if (ety && ety.radicalSymbol && learnedRadicals.has(ety.radicalSymbol)) {
      return true;
    }
  }

  return false;
}

/**
 * Sinh bài học thích ứng theo mô hình ZPD (Vùng phát triển gần nhất) với tỷ lệ vàng 3-5-2
 * @param {string} skill Tên kỹ năng ('writing', 'listening', 'speaking', 'typing', 'reading')
 * @param {number} level Cấp độ hiện tại của người dùng (1 - 6)
 * @param {Array} vocabularyPool Kho từ vựng hợp nhất 5000 từ
 * @param {Array} reviewLogs Lịch sử ôn tập (chứa các bản ghi kết quả làm bài của từ)
 * @param {number} currentMastery Điểm Mastery hiện tại của kỹ năng này
 * @returns {Array} Danh sách chính xác 10 từ vựng thích ứng cho bài học
 */
export function getAdaptiveVocabulary(skill, level, vocabularyPool = [], reviewLogs = [], currentMastery = 1000) {
  if (!vocabularyPool || vocabularyPool.length === 0) return [];

  // Lọc kho từ vựng theo cấp độ hiện tại và cấp độ thách thức
  const currentLevelWords = vocabularyPool.filter(w => w.level === level);
  const nextLevelWords = vocabularyPool.filter(w => w.level === Math.min(6, level + 1));

  // Tập hợp các chữ cái đơn đã học được trích xuất từ các câu trả lời thành công trong reviewLogs
  const learnedChars = new Set();
  const successfulWordIds = new Set();

  reviewLogs.forEach(log => {
    if (log.correct) {
      successfulWordIds.add(log.wordId);
      const wordObj = vocabularyPool.find(w => w.id === log.wordId);
      if (wordObj && wordObj.simplified) {
        for (const char of wordObj.simplified) {
          learnedChars.add(char);
        }
      }
    }
  });

  // --- 1. NHÓM 1: 3 từ Yếu điểm (Weakness Items - 30%) ---
  // Lọc lịch sử ôn tập của level hiện tại có kết quả sai nhiều nhất
  const failCounts = {};
  reviewLogs.forEach(log => {
    const word = currentLevelWords.find(w => w.id === log.wordId);
    if (word) {
      if (!failCounts[log.wordId]) failCounts[log.wordId] = { correct: 0, total: 0 };
      failCounts[log.wordId].total += 1;
      if (!log.correct) failCounts[log.wordId].correct += 1; // đếm số lần sai
    }
  });

  // Xắp xếp từ sai nhiều nhất lên đầu
  const weaknessIds = Object.keys(failCounts)
    .map(id => ({ id, failRate: failCounts[id].correct / failCounts[id].total }))
    .filter(item => item.failRate > 0)
    .sort((a, b) => b.failRate - a.failRate)
    .map(item => item.id);

  const selectedWeakness = [];
  for (const id of weaknessIds) {
    if (selectedWeakness.length >= 3) break;
    const word = currentLevelWords.find(w => w.id === id);
    if (word) selectedWeakness.push(word);
  }

  // --- 2. NHÓM 2: 2 từ Thách thức (Challenge Items - 20%) ---
  // Chọn từ cấp độ kế tiếp (nếu đang ở level 6 thì chọn từ level 6)
  const challengeCandidates = level === 6 ? currentLevelWords : nextLevelWords;
  
  // Phân loại candidates dựa trên mối liên hệ bộ thủ/chữ đơn với từ đã học tốt
  const relatedChallenges = [];
  const unrelatedChallenges = [];

  challengeCandidates.forEach(w => {
    // Tránh trùng với các từ đã chọn trong nhóm 1
    if (selectedWeakness.some(sel => sel.id === w.id)) return;
    
    if (findRadicalOrCharRelationship(w.simplified, learnedChars)) {
      relatedChallenges.push(w);
    } else {
      unrelatedChallenges.push(w);
    }
  });

  // Shuffle các nhóm để tăng tính đa dạng ngẫu nhiên
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);
  shuffle(relatedChallenges);
  shuffle(unrelatedChallenges);

  // Lấy ưu tiên từ có liên hệ, thiếu thì bù từ không liên hệ
  const selectedChallengeCandidates = [...relatedChallenges, ...unrelatedChallenges];
  const selectedChallenge = selectedChallengeCandidates.slice(0, 2);

  // --- 3. NHÓM 3: 5 từ Mục tiêu (Current Target Items - 50%) ---
  // Lấy các từ ở level hiện tại chưa học hoặc có điểm trung bình, không trùng với Weakness hay Challenge
  const targetCandidates = currentLevelWords.filter(w => {
    const isWeak = selectedWeakness.some(sel => sel.id === w.id);
    const isChal = selectedChallenge.some(sel => sel.id === w.id);
    return !isWeak && !isChal;
  });

  // Sắp xếp các từ mục tiêu: ưu tiên từ chưa từng làm hoặc đã làm thành công ít lần (để củng cố)
  const successfulCounts = {};
  reviewLogs.forEach(log => {
    if (log.correct) {
      successfulCounts[log.wordId] = (successfulCounts[log.wordId] || 0) + 1;
    }
  });

  const sortedTargets = targetCandidates.sort((a, b) => {
    const countA = successfulCounts[a.id] || 0;
    const countB = successfulCounts[b.id] || 0;
    return countA - countB; // ưu tiên số lần làm đúng ít hơn lên trước (chưa thuộc hẳn)
  });

  // Chọn 5 từ mục tiêu
  shuffle(sortedTargets); // Shuffle nhẹ để bài học sống động
  const selectedTarget = sortedTargets.slice(0, 5);

  // --- 4. BÙ ĐẮP BÀI HỌC NẾU THIẾU NET ---
  // Nếu nhóm Weakness thiếu (ví dụ người dùng chưa làm sai từ nào), lấy từ nhóm Target bù vào
  let finalLesson = [...selectedWeakness, ...selectedTarget, ...selectedChallenge];

  if (finalLesson.length < 10) {
    // Lấy thêm từ Target Candidates còn lại
    const remainingTargets = currentLevelWords.filter(w => !finalLesson.some(f => f.id === w.id));
    shuffle(remainingTargets);
    finalLesson = [...finalLesson, ...remainingTargets.slice(0, 10 - finalLesson.length)];
  }

  // Nếu vẫn chưa đủ 10 từ (do kho từ vựng của level quá nhỏ), lấy từ bất kỳ trong pool của level đó
  if (finalLesson.length < 10) {
    const remainingPool = currentLevelWords.filter(w => !finalLesson.some(f => f.id === w.id));
    finalLesson = [...finalLesson, ...remainingPool.slice(0, 10 - finalLesson.length)];
  }

  // Đảm bảo trả về đúng 10 từ (hoặc tối đa có thể)
  return finalLesson.slice(0, 10);
}
