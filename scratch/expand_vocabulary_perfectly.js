import fs from "fs";
import path from "path";
import { sinoVietMap } from "../src/data/sinoVietMap.js";

// Helper to construct Sino-Vietnamese reading for a Chinese word
function getSinoViet(word) {
  let result = [];
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const reading = sinoVietMap[char];
    if (reading) {
      // Use the first option if multiple readings exist (separated by /)
      const firstReading = reading.split("/")[0].trim();
      result.push(firstReading.charAt(0).toUpperCase() + firstReading.slice(1).toLowerCase());
    } else {
      // Fallback
      result.push("?");
    }
  }
  if (result.includes("?")) return "";
  return result.join(" ");
}

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
            sinoViet: sinoViet || getSinoViet(simplified),
            translation: translation || "",
            category: category || "Từ vựng / Vocabulary"
          });
        }
      });
    }
  });
  
  return allCand;
}

// Extra high-quality backup words for levels that might be short of 300 words
const backupWords = {
  2: [
    { simplified: "谢谢", traditional: "謝謝", pinyin: "xièxie", translation: "Cảm ơn", category: "Giao tiếp / Communication" },
    { simplified: "再见", traditional: "再見", pinyin: "zài jiàn", translation: "Tạm biệt", category: "Giao tiếp / Communication" },
    { simplified: "对不起", traditional: "對不起", pinyin: "duìbuqǐ", translation: "Xin lỗi", category: "Giao tiếp / Communication" },
    { simplified: "没关系", traditional: "沒關係", pinyin: "méi guānxi", translation: "Không có gì", category: "Giao tiếp / Communication" },
    { simplified: "不客气", traditional: "不客氣", pinyin: "bù kèqi", translation: "Không cần khách sáo", category: "Giao tiếp / Communication" },
    { simplified: "今天", traditional: "今天", pinyin: "jīntiān", translation: "Hôm nay", category: "Thời gian / Time" },
    { simplified: "明天", traditional: "明天", pinyin: "míngtiān", translation: "Ngày mai", category: "Thời gian / Time" },
    { simplified: "昨天", traditional: "昨天", pinyin: "zuótiān", translation: "Hôm qua", category: "Thời gian / Time" },
    { simplified: "上午", traditional: "上午", pinyin: "shàngwǔ", translation: "Buổi sáng", category: "Thời gian / Time" },
    { simplified: "中午", traditional: "中午", pinyin: "zhōngwǔ", translation: "Buổi trưa", category: "Thời gian / Time" },
    { simplified: "下午", traditional: "下午", pinyin: "xiàwǔ", translation: "Buổi chiều", category: "Thời gian / Time" },
    { simplified: "今年", traditional: "今年", pinyin: "jīnnián", translation: "Năm nay", category: "Thời gian / Time" },
    { simplified: "明年", traditional: "明年", pinyin: "míngnián", translation: "Sang năm", category: "Thời gian / Time" },
    { simplified: "去年", traditional: "去年", pinyin: "qùnián", translation: "Năm ngoái", category: "Thời gian / Time" },
    { simplified: "星期", traditional: "星期", pinyin: "xīngqī", translation: "Tuần, thứ", category: "Thời gian / Time" },
    { simplified: "星期天", traditional: "星期天", pinyin: "xīngqītiān", translation: "Chủ nhật", category: "Thời gian / Time" },
    { simplified: "点", traditional: "點", pinyin: "diǎn", translation: "Giờ, điểm", category: "Thời gian / Time" },
    { simplified: "时候", traditional: "時候", pinyin: "shíhou", translation: "Lúc, khi", category: "Thời gian / Time" },
    { simplified: "现在", traditional: "現在", pinyin: "xiànzài", translation: "Bây giờ", category: "Thời gian / Time" },
    { simplified: "桌子", traditional: "桌子", pinyin: "zhuōzi", translation: "Cái bàn", category: "Đồ dùng / Items" },
    { simplified: "椅子", traditional: "椅子", pinyin: "yǐzi", translation: "Cái ghế", category: "Đồ dùng / Items" },
    { simplified: "猫", traditional: "貓", pinyin: "māo", translation: "Con mèo", category: "Động vật / Animals" },
    { simplified: "狗", traditional: "狗", pinyin: "gǒu", translation: "Con chó", category: "Động vật / Animals" },
    { simplified: "苹果", traditional: "蘋果", pinyin: "píngguǒ", translation: "Quả táo", category: "Đồ dùng / Items" },
    { simplified: "茶", traditional: "茶", pinyin: "chá", translation: "Trà, chè", category: "Đồ dùng / Items" },
    { simplified: "米饭", traditional: "米飯", pinyin: "mǐfàn", translation: "Cơm, gạo tẻ", category: "Đồ dùng / Items" },
    { simplified: "衣服", traditional: "衣服", pinyin: "yīfu", translation: "Quần áo", category: "Đồ dùng / Items" },
    { simplified: "商店", traditional: "商店", pinyin: "shāngdiàn", translation: "Cửa hàng", category: "Địa điểm / Places" },
    { simplified: "学校", traditional: "學校", pinyin: "xuéxiào", translation: "Trường học", category: "Địa điểm / Places" },
    { simplified: "医院", traditional: "醫院", pinyin: "yīyuàn", translation: "Bệnh viện", category: "Địa điểm / Places" },
    { simplified: "老师", traditional: "老師", pinyin: "lǎoshī", translation: "Thầy cô giáo", category: "Con người / People" },
    { simplified: "学生", traditional: "學生", pinyin: "xuéshēng", translation: "Học sinh, sinh viên", category: "Con người / People" },
    { simplified: "医生", traditional: "醫生", pinyin: "yīshēng", translation: "Bác sĩ", category: "Con người / People" },
    { simplified: "电脑", traditional: "電腦", pinyin: "diànnǎo", translation: "Máy vi tính", category: "Đồ dùng / Items" },
    { simplified: "电视", traditional: "電視", pinyin: "diànshì", translation: "Máy thu hình, tivi", category: "Đồ dùng / Items" },
    { simplified: "电影", traditional: "電影", pinyin: "diànyǐng", translation: "Phim điện ảnh", category: "Đồ dùng / Items" },
    { simplified: "天气", traditional: "天氣", pinyin: "tiānqì", translation: "Thời tiết", category: "Thiên nhiên / Nature" },
    { simplified: "下雨", traditional: "下雨", pinyin: "xiàyǔ", translation: "Mưa, đổ mưa", category: "Thiên nhiên / Nature" },
    { simplified: "下雪", traditional: "下雪", pinyin: "xiàxuě", translation: "Tuyết rơi", category: "Thiên nhiên / Nature" },
    { simplified: "说话", traditional: "說話", pinyin: "shuōhuà", translation: "Nói chuyện, phát ngôn", category: "Hành động / Actions" }
  ],
  3: [
    { simplified: "突然", traditional: "突然", pinyin: "tūrán", translation: "Đột nhiên, thốt nhiên", category: "Trạng từ / Adverbs" },
    { simplified: "然后", traditional: "然後", pinyin: "ránhòu", translation: "Sau đó", category: "Liên từ / Conjunctions" },
    { simplified: "最后", traditional: "最後", pinyin: "zuìhòu", translation: "Cuối cùng", category: "Liên từ / Conjunctions" },
    { simplified: "其实", traditional: "其實", pinyin: "qíshí", translation: "Thực ra, kỳ thực", category: "Trạng từ / Adverbs" },
    { simplified: "其他", traditional: "其他", pinyin: "qítā", translation: "Cái khác, người khác", category: "Đại từ / Pronouns" },
    { simplified: "花", traditional: "花", pinyin: "huā", translation: "Hoa, tiêu tốn", category: "Thiên nhiên / Nature" },
    { simplified: "树", traditional: "樹", pinyin: "shù", translation: "Cây cối", category: "Thiên nhiên / Nature" },
    { simplified: "太阳", traditional: "太陽", pinyin: "tàiyáng", translation: "Mặt trời, thái dương", category: "Thiên nhiên / Nature" },
    { simplified: "月亮", traditional: "月亮", pinyin: "yuèliang", translation: "Mặt trăng", category: "Thiên nhiên / Nature" },
    { simplified: "葡萄", traditional: "葡萄", pinyin: "pútáo", translation: "Quả nho", category: "Đồ dùng / Items" },
    { simplified: "面条", traditional: "麵條", pinyin: "miàntiáo", translation: "Mì sợi", category: "Đồ dùng / Items" },
    { simplified: "楼", traditional: "樓", pinyin: "lóu", translation: "Tầng, nhà lầu", category: "Địa điểm / Places" },
    { simplified: "层", traditional: "層", pinyin: "céng", translation: "Tầng, lớp", category: "Lượng từ / Classifiers" },
    { simplified: "如果", traditional: "如果", pinyin: "rúguǒ", translation: "Nếu như, nếu", category: "Liên từ / Conjunctions" },
    { simplified: "只有", traditional: "只有", pinyin: "zhǐyǒu", translation: "Chỉ có", category: "Liên từ / Conjunctions" },
    { simplified: "只要", traditional: "只要", pinyin: "zhǐyào", translation: "Chỉ cần", category: "Liên từ / Conjunctions" },
    { simplified: "或者", traditional: "或者", pinyin: "huòzhě", translation: "Hoặc là", category: "Liên từ / Conjunctions" },
    { simplified: "还是", traditional: "還是", pinyin: "háishi", translation: "Vẫn là, hay là", category: "Liên từ / Conjunctions" },
    { simplified: "主要", traditional: "主要", pinyin: "zhǔyào", translation: "Chủ yếu", category: "Tính từ / Adjectives" },
    { simplified: "重要", traditional: "重要", pinyin: "zhòngyào", translation: "Quan trọng", category: "Tính từ / Adjectives" },
    { simplified: "安全", traditional: "安全", pinyin: "ānquán", translation: "An toàn", category: "Tính từ / Adjectives" },
    { simplified: "危险", traditional: "危險", pinyin: "wēixiǎn", translation: "Nguy hiểm", category: "Tính từ / Adjectives" },
    { simplified: "嘴巴", traditional: "嘴巴", pinyin: "zuǐba", translation: "Cái miệng", category: "Con người / People" },
    { simplified: "耳朵", traditional: "耳朵", pinyin: "ěrduo", translation: "Cái tai", category: "Con người / People" },
    { simplified: "鼻子", traditional: "鼻子", pinyin: "bízi", translation: "Cái mũi", category: "Con người / People" }
  ],
  5: [
    { simplified: "充电", traditional: "充電", pinyin: "chōngdiàn", translation: "Sạc điện, nạp điện", category: "Hành động / Actions" },
    { simplified: "充满", traditional: "充滿", pinyin: "chōngmǎn", translation: "Tràn đầy, sung mãn", category: "Trạng thái / States" },
    { simplified: "重叠", traditional: "重疊", pinyin: "chóngdié", translation: "Trùng lặp, chồng chất", category: "Trạng thái / States" },
    { simplified: "宠物", traditional: "寵物", pinyin: "chǒngwù", translation: "Thú cưng, vật nuôi", category: "Động vật / Animals" },
    { simplified: "抽", traditional: "抽", pinyin: "chōu", translation: "Rút ra, hút (thuốc)", category: "Hành động / Actions" },
    { simplified: "抽象", traditional: "抽象", pinyin: "chōuxiàng", translation: "Trừu tượng", category: "Tính từ / Adjectives" },
    { simplified: "出版", traditional: "出版", pinyin: "chūbǎn", translation: "Xuất bản", category: "Hành động / Actions" },
    { simplified: "出口", traditional: "出口", pinyin: "chūkǒu", translation: "Xuất khẩu, lối ra", category: "Danh từ / Nouns" },
    { simplified: "出色", traditional: "出色", pinyin: "chūsè", translation: "Xuất sắc, xuất sắc vượt trội", category: "Tính từ / Adjectives" },
    { simplified: "出席", traditional: "出席", pinyin: "chūxí", translation: "Tham gia, có mặt dự họp", category: "Hành động / Actions" },
    { simplified: "初级", traditional: "初級", pinyin: "chūjí", translation: "Sơ cấp, cấp thấp", category: "Tính từ / Adjectives" },
    { simplified: "除", traditional: "除", pinyin: "chú", translation: "Trừ đi, loại bỏ", category: "Hành động / Actions" },
    { simplified: "除非", traditional: "除非", pinyin: "chúfēi", translation: "Trừ phi", category: "Liên từ / Conjunctions" },
    { simplified: "除夕", traditional: "除夕", pinyin: "chúxī", translation: "Đêm giao thừa", category: "Thời gian / Time" },
    { simplified: "处理", traditional: "處理", pinyin: "chǔlǐ", translation: "Xử lý, giải quyết", category: "Hành động / Actions" },
    { simplified: "传播", traditional: "傳播", pinyin: "chuánbō", translation: "Truyền bá, phổ biến", category: "Hành động / Actions" },
    { simplified: "传染", traditional: "傳染", pinyin: "傳染", translation: "Lây nhiễm, truyền nhiễm", category: "Trạng thái / States" },
    { simplified: "传说", traditional: "傳說", pinyin: "chuánshuō", translation: "Truyền thuyết", category: "Danh từ / Nouns" },
    { simplified: "传统", traditional: "傳統", pinyin: "chuántǒng", translation: "Truyền thống", category: "Danh từ / Nouns" },
    { simplified: "窗帘", traditional: "窗簾", pinyin: "chuānglián", translation: "Rèm cửa, màn cửa", category: "Đồ dùng / Items" },
    { simplified: "闯", traditional: "闖", pinyin: "chuǎng", translation: "Xông vào, vượt qua khó khăn", category: "Hành động / Actions" },
    { simplified: "吹", traditional: "吹", pinyin: "chuī", translation: "Thổi, khoác lác", category: "Hành động / Actions" },
    { simplified: "词汇", traditional: "詞彙", pinyin: "cíhuì", translation: "Từ vựng, từ hội", category: "Danh từ / Nouns" },
    { simplified: "磁带", traditional: "磁帶", pinyin: "cídài", translation: "Băng từ, băng cassette", category: "Đồ dùng / Items" },
    { simplified: "辞职", traditional: "辭職", pinyin: "cízhí", translation: "Từ chức, nghỉ việc", category: "Hành động / Actions" },
    { simplified: "此外", traditional: "此外", pinyin: "cǐwài", translation: "Ngoài ra, hơn nữa", category: "Liên từ / Conjunctions" },
    { simplified: "次要", traditional: "次要", pinyin: "cìyào", translation: "Thứ yếu, không quan trọng bằng", category: "Tính từ / Adjectives" },
    { simplified: "刺激", traditional: "刺激", pinyin: "cìjī", translation: "Kích thích, khích lệ", category: "Hành động / Actions" },
    { simplified: "从不", traditional: "從不", pinyin: "cóngbù", translation: "Chưa từng, không bao giờ", category: "Trạng từ / Adverbs" },
    { simplified: "从前", traditional: "從前", pinyin: "cóngqián", translation: "Trước đây, ngày xưa", category: "Thời gian / Time" },
    { simplified: "从事", traditional: "從事", pinyin: "cóngshì", translation: "Làm việc, dấn thân vào", category: "Hành động / Actions" },
    { simplified: "粗糙", traditional: "粗糙", pinyin: "cūcāo", translation: "Thô ráp, xù xì, cẩu thả", category: "Tính từ / Adjectives" },
    { simplified: "促进", traditional: "促進", pinyin: "cùjìn", translation: "Xúc tiến, thúc đẩy", category: "Hành động / Actions" },
    { simplified: "促使", traditional: "促使", pinyin: "cùshǐ", translation: "Thúc giục, làm cho", category: "Hành động / Actions" },
    { simplified: "催", traditional: "催", pinyin: "cuī", translation: "Hối thúc, thúc giục", category: "Hành động / Actions" },
    { simplified: "存", traditional: "存", pinyin: "cún", translation: "Tiết kiệm, tích trữ, gửi tiền", category: "Hành động / Actions" },
    { simplified: "存在", traditional: "存在", pinyin: "cúnzài", translation: "Tồn tại", category: "Trạng thái / States" },
    { simplified: "错误", traditional: "錯誤", pinyin: "cuòwù", translation: "Sai lầm, lỗi lầm", category: "Danh từ / Nouns" },
    { simplified: "措施", traditional: "措施", pinyin: "cuòshī", translation: "Biện pháp, thố thi", category: "Danh từ / Nouns" },
    { simplified: "答应", traditional: "答應", pinyin: "dāying", translation: "Trả lời, đồng ý", category: "Hành động / Actions" },
    { simplified: "达到", traditional: "達到", pinyin: "dádào", translation: "Đạt đến", category: "Hành động / Actions" },
    { simplified: "打工", traditional: "打工", pinyin: "dǎgōng", translation: "Làm thuê, làm bán thời gian", category: "Hành động / Actions" },
    { simplified: "打交道", traditional: "打交道", pinyin: "dǎ jiāodao", translation: "Giao thiệp, tiếp xúc", category: "Hành động / Actions" },
    { simplified: "打喷嚏", traditional: "打噴嚏", pinyin: "dǎ pēntì", translation: "Hắt hơi", category: "Hành động / Actions" },
    { simplified: "打听", traditional: "打聽", pinyin: "dǎting", translation: "Nghe ngóng, hỏi thăm", category: "Hành động / Actions" },
    { simplified: "大方", traditional: "大方", pinyin: "dàfang", translation: "Rộng rãi, phóng khoáng", category: "Tính từ / Adjectives" },
    { simplified: "大型", traditional: "大型", pinyin: "dàxíng", translation: "Quy mô lớn, loại lớn", category: "Tính từ / Adjectives" },
    { simplified: "代替", traditional: "代替", pinyin: "代替", translation: "Thay thế", category: "Hành động / Actions" },
    { simplified: "贷款", traditional: "貸款", pinyin: "dàikuǎn", translation: "Khoản vay, vay vốn", category: "Danh từ / Nouns" },
    { simplified: "待遇", traditional: "待遇", pinyin: "dàiyù", translation: "Đãi ngộ, lương bổng", category: "Danh từ / Nouns" },
    { simplified: "单纯", traditional: "單純", pinyin: "dānchún", translation: "Đơn thuần", category: "Tính từ / Adjectives" },
    { simplified: "单调", traditional: "單調", pinyin: "dāndiào", translation: "Đơn điệu, tẻ nhạt", category: "Tính từ / Adjectives" },
    { simplified: "单独", traditional: "單獨", pinyin: "dāndú", translation: "Đơn độc, một mình", category: "Tính từ / Adjectives" },
    { simplified: "担任", traditional: "擔任", pinyin: "dānrèn", translation: "Đảm nhiệm, gánh vác", category: "Hành động / Actions" },
    { simplified: "耽误", traditional: "耽誤", pinyin: "dānwu", translation: "Trễ nải, trì hoãn", category: "Hành động / Actions" },
    { simplified: "胆小鬼", traditional: "膽小鬼", pinyin: "dǎnxiǎoguǐ", translation: "Kẻ nhát gan", category: "Con người / People" },
    { simplified: "淡", traditional: "淡", pinyin: "dàn", translation: "Nhạt, loãng", category: "Tính từ / Adjectives" },
    { simplified: "当地", traditional: "當地", pinyin: "dāngdì", translation: "Bản địa, địa phương", category: "Địa điểm / Places" },
    { simplified: "当兵", traditional: "當兵", pinyin: "dāngbīng", translation: "Làm lính, tòng quân", category: "Con người / People" }
  ]
};

// Process backup words to ensure they have sinoViet and traditional properly configured
for (const lvl in backupWords) {
  backupWords[lvl] = backupWords[lvl].map(w => {
    return {
      simplified: w.simplified,
      traditional: w.traditional || w.simplified,
      pinyin: w.pinyin,
      sinoViet: w.sinoViet || getSinoViet(w.simplified),
      translation: w.translation,
      category: w.category || "Từ vựng / Vocabulary"
    };
  });
}

// Main execution block
import("../src/data/vocabulary.js").then(vocab => {
  const originalWritingData = vocab.writingData;
  console.log(`Original vocabulary size in file: ${originalWritingData.length} words.`);
  
  // Group existing words by level
  const levelGroups = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  originalWritingData.forEach(word => {
    levelGroups[word.level].push(word);
  });
  
  for (let lvl = 1; lvl <= 6; lvl++) {
    console.log(`Level ${lvl} has ${levelGroups[lvl].length} core words.`);
  }
  
  // Load candidate lists
  const candidatesPool = loadAllCandidates();
  
  // Next assigned ID start
  let newIdCounter = 1201;
  const newWritingData = [];
  
  for (let lvl = 1; lvl <= 6; lvl++) {
    const currentLvlWords = [...levelGroups[lvl]];
    const currentLvlSimplified = new Set(currentLvlWords.map(w => w.simplified));
    const currentLvlTraditional = new Set(currentLvlWords.map(w => w.traditional));
    
    // Add candidates first
    const lvlCandidates = candidatesPool[lvl] || [];
    let addedCandidatesCount = 0;
    
    for (const cand of lvlCandidates) {
      if (currentLvlWords.length >= 300) break;
      
      const { simplified, traditional, pinyin, sinoViet, translation, category } = cand;
      
      if (currentLvlSimplified.has(simplified) || currentLvlTraditional.has(traditional)) {
        continue; // duplicate
      }
      
      const newWord = {
        id: `w${newIdCounter++}`,
        level: lvl,
        simplified,
        traditional,
        pinyin,
        sinoViet,
        translation,
        category
      };
      
      currentLvlWords.push(newWord);
      currentLvlSimplified.add(simplified);
      currentLvlTraditional.add(traditional);
      addedCandidatesCount++;
    }
    
    // Add backup words if still short of 300
    let addedBackupCount = 0;
    const lvlBackups = backupWords[lvl] || [];
    
    for (const backup of lvlBackups) {
      if (currentLvlWords.length >= 300) break;
      
      const { simplified, traditional, pinyin, sinoViet, translation, category } = backup;
      
      if (currentLvlSimplified.has(simplified) || currentLvlTraditional.has(traditional)) {
        continue; // duplicate
      }
      
      const newWord = {
        id: `w${newIdCounter++}`,
        level: lvl,
        simplified,
        traditional,
        pinyin,
        sinoViet,
        translation,
        category
      };
      
      currentLvlWords.push(newWord);
      currentLvlSimplified.add(simplified);
      currentLvlTraditional.add(traditional);
      addedBackupCount++;
    }
    
    console.log(`Level ${lvl}: Added ${addedCandidatesCount} from candidate pool, ${addedBackupCount} from backups. Total: ${currentLvlWords.length}`);
    
    if (currentLvlWords.length !== 300) {
      console.error(`[ERROR] Level ${lvl} could not reach 300 words! It only has ${currentLvlWords.length} words.`);
      process.exit(1);
    }
    
    newWritingData.push(...currentLvlWords);
  }
  
  console.log(`Total expanded vocabulary: ${newWritingData.length} words.`);
  
  // Format the writingData array beautifully in Javascript code representation
  let formattedData = "export const writingData = [\n";
  newWritingData.forEach(word => {
    let line = `  { id: "${word.id}", level: ${word.level}, simplified: "${word.simplified}", traditional: "${word.traditional}", pinyin: "${word.pinyin}", `;
    if (word.sinoViet) {
      line += `sinoViet: "${word.sinoViet}", `;
    }
    line += `translation: "${word.translation}", category: "${word.category}" },\n`;
    formattedData += line;
  });
  formattedData += "];";
  
  // Read target file content
  const filepath = path.join("src", "data", "vocabulary.js");
  const fileContent = fs.readFileSync(filepath, "utf8");
  
  // Replace writingData array block in the original fileContent string
  const writingDataRegex = /export\s+const\s+writingData\s*=\s*\[[\s\S]*?\];/;
  if (!writingDataRegex.test(fileContent)) {
    console.error("Could not find 'export const writingData = [...];' block in vocabulary.js");
    process.exit(1);
  }
  
  const updatedFileContent = fileContent.replace(writingDataRegex, formattedData);
  
  // Write back to vocabulary.js
  fs.writeFileSync(filepath, updatedFileContent, "utf8");
  console.log("Successfully expanded vocabulary.js perfectly to exactly 300 words per level (1800 words total)!");
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
