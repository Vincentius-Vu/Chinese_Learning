// ─── Vocabulary Data for HSK 1 (Simplified) & TOCFL 1 (Traditional) ───

export type ScriptType = 'simplified' | 'traditional';
export type SkillType = 'writing' | 'reading' | 'listening' | 'speaking';

export interface VocabWord {
  simplified: string;
  traditional: string;
  pinyin: string;
  vietnamese: string;
  strokes?: number; // only for single chars useful in writing mode
}

export interface VocabTopic {
  id: string;
  label_vi: string;
  emoji: string;
  words: VocabWord[];
}

export type VocabLevel = 'HSK1' | 'TOCFL1';

// ─── HSK 1 Vocabulary (150 words, Simplified Chinese) ───
export const hsk1Topics: VocabTopic[] = [
  {
    id: 'hsk-greetings',
    label_vi: 'Chào hỏi',
    emoji: '👋',
    words: [
      { simplified: '你好', traditional: '你好', pinyin: 'nǐ hǎo', vietnamese: 'Xin chào' },
      { simplified: '谢谢', traditional: '謝謝', pinyin: 'xièxie', vietnamese: 'Cảm ơn' },
      { simplified: '再见', traditional: '再見', pinyin: 'zàijiàn', vietnamese: 'Tạm biệt' },
      { simplified: '请', traditional: '請', pinyin: 'qǐng', vietnamese: 'Xin mời, Làm ơn', strokes: 10 },
      { simplified: '对不起', traditional: '對不起', pinyin: 'duìbuqǐ', vietnamese: 'Xin lỗi' },
      { simplified: '没关系', traditional: '沒關係', pinyin: 'méi guānxi', vietnamese: 'Không sao' },
      { simplified: '欢迎', traditional: '歡迎', pinyin: 'huānyíng', vietnamese: 'Hoan nghênh' },
      { simplified: '早上好', traditional: '早上好', pinyin: 'zǎoshang hǎo', vietnamese: 'Chào buổi sáng' },
      { simplified: '晚上好', traditional: '晚上好', pinyin: 'wǎnshang hǎo', vietnamese: 'Chào buổi tối' },
    ],
  },
  {
    id: 'hsk-people',
    label_vi: 'Con người',
    emoji: '👨‍👩‍👧',
    words: [
      { simplified: '我', traditional: '我', pinyin: 'wǒ', vietnamese: 'Tôi', strokes: 7 },
      { simplified: '你', traditional: '你', pinyin: 'nǐ', vietnamese: 'Bạn', strokes: 7 },
      { simplified: '他', traditional: '他', pinyin: 'tā', vietnamese: 'Anh ấy', strokes: 5 },
      { simplified: '她', traditional: '她', pinyin: 'tā', vietnamese: 'Cô ấy', strokes: 6 },
      { simplified: '我们', traditional: '我們', pinyin: 'wǒmen', vietnamese: 'Chúng tôi' },
      { simplified: '先生', traditional: '先生', pinyin: 'xiānsheng', vietnamese: 'Ngài, Ông' },
      { simplified: '小姐', traditional: '小姐', pinyin: 'xiǎojiě', vietnamese: 'Cô, Chị' },
      { simplified: '同学', traditional: '同學', pinyin: 'tóngxué', vietnamese: 'Bạn học' },
      { simplified: '朋友', traditional: '朋友', pinyin: 'péngyou', vietnamese: 'Bạn bè' },
      { simplified: '老师', traditional: '老師', pinyin: 'lǎoshī', vietnamese: 'Giáo viên' },
      { simplified: '学生', traditional: '學生', pinyin: 'xuésheng', vietnamese: 'Học sinh' },
    ],
  },
  {
    id: 'hsk-family',
    label_vi: 'Gia đình',
    emoji: '👨‍👩‍👦',
    words: [
      { simplified: '爸爸', traditional: '爸爸', pinyin: 'bàba', vietnamese: 'Bố, Cha' },
      { simplified: '妈妈', traditional: '媽媽', pinyin: 'māma', vietnamese: 'Mẹ' },
      { simplified: '哥哥', traditional: '哥哥', pinyin: 'gēge', vietnamese: 'Anh trai' },
      { simplified: '弟弟', traditional: '弟弟', pinyin: 'dìdi', vietnamese: 'Em trai' },
      { simplified: '姐姐', traditional: '姐姐', pinyin: 'jiějie', vietnamese: 'Chị gái' },
      { simplified: '妹妹', traditional: '妹妹', pinyin: 'mèimei', vietnamese: 'Em gái' },
      { simplified: '儿子', traditional: '兒子', pinyin: 'érzi', vietnamese: 'Con trai' },
      { simplified: '女儿', traditional: '女兒', pinyin: 'nǚ\'ér', vietnamese: 'Con gái' },
      { simplified: '家', traditional: '家', pinyin: 'jiā', vietnamese: 'Nhà, Gia đình', strokes: 10 },
    ],
  },
  {
    id: 'hsk-numbers',
    label_vi: 'Số đếm',
    emoji: '🔢',
    words: [
      { simplified: '一', traditional: '一', pinyin: 'yī', vietnamese: 'Một', strokes: 1 },
      { simplified: '二', traditional: '二', pinyin: 'èr', vietnamese: 'Hai', strokes: 2 },
      { simplified: '三', traditional: '三', pinyin: 'sān', vietnamese: 'Ba', strokes: 3 },
      { simplified: '四', traditional: '四', pinyin: 'sì', vietnamese: 'Bốn', strokes: 5 },
      { simplified: '五', traditional: '五', pinyin: 'wǔ', vietnamese: 'Năm', strokes: 4 },
      { simplified: '六', traditional: '六', pinyin: 'liù', vietnamese: 'Sáu', strokes: 4 },
      { simplified: '七', traditional: '七', pinyin: 'qī', vietnamese: 'Bảy', strokes: 2 },
      { simplified: '八', traditional: '八', pinyin: 'bā', vietnamese: 'Tám', strokes: 2 },
      { simplified: '九', traditional: '九', pinyin: 'jiǔ', vietnamese: 'Chín', strokes: 2 },
      { simplified: '十', traditional: '十', pinyin: 'shí', vietnamese: 'Mười', strokes: 2 },
      { simplified: '百', traditional: '百', pinyin: 'bǎi', vietnamese: 'Trăm', strokes: 6 },
      { simplified: '千', traditional: '千', pinyin: 'qiān', vietnamese: 'Nghìn', strokes: 3 },
      { simplified: '万', traditional: '萬', pinyin: 'wàn', vietnamese: 'Vạn', strokes: 3 },
    ],
  },
  {
    id: 'hsk-time',
    label_vi: 'Thời gian',
    emoji: '🕐',
    words: [
      { simplified: '今天', traditional: '今天', pinyin: 'jīntiān', vietnamese: 'Hôm nay' },
      { simplified: '明天', traditional: '明天', pinyin: 'míngtiān', vietnamese: 'Ngày mai' },
      { simplified: '昨天', traditional: '昨天', pinyin: 'zuótiān', vietnamese: 'Hôm qua' },
      { simplified: '现在', traditional: '現在', pinyin: 'xiànzài', vietnamese: 'Hiện tại' },
      { simplified: '时候', traditional: '時候', pinyin: 'shíhou', vietnamese: 'Lúc, Thời gian' },
      { simplified: '年', traditional: '年', pinyin: 'nián', vietnamese: 'Năm', strokes: 6 },
      { simplified: '月', traditional: '月', pinyin: 'yuè', vietnamese: 'Tháng', strokes: 4 },
      { simplified: '日', traditional: '日', pinyin: 'rì', vietnamese: 'Ngày', strokes: 4 },
      { simplified: '星期', traditional: '星期', pinyin: 'xīngqī', vietnamese: 'Tuần lễ' },
      { simplified: '点', traditional: '點', pinyin: 'diǎn', vietnamese: 'Giờ, Điểm', strokes: 9 },
      { simplified: '分', traditional: '分', pinyin: 'fēn', vietnamese: 'Phút', strokes: 4 },
      { simplified: '上午', traditional: '上午', pinyin: 'shàngwǔ', vietnamese: 'Buổi sáng' },
      { simplified: '下午', traditional: '下午', pinyin: 'xiàwǔ', vietnamese: 'Buổi chiều' },
    ],
  },
  {
    id: 'hsk-food',
    label_vi: 'Ăn uống',
    emoji: '🍜',
    words: [
      { simplified: '吃', traditional: '吃', pinyin: 'chī', vietnamese: 'Ăn', strokes: 6 },
      { simplified: '喝', traditional: '喝', pinyin: 'hē', vietnamese: 'Uống', strokes: 12 },
      { simplified: '水', traditional: '水', pinyin: 'shuǐ', vietnamese: 'Nước', strokes: 4 },
      { simplified: '茶', traditional: '茶', pinyin: 'chá', vietnamese: 'Trà', strokes: 9 },
      { simplified: '饭', traditional: '飯', pinyin: 'fàn', vietnamese: 'Cơm, Bữa ăn', strokes: 7 },
      { simplified: '水果', traditional: '水果', pinyin: 'shuǐguǒ', vietnamese: 'Trái cây' },
      { simplified: '苹果', traditional: '蘋果', pinyin: 'píngguǒ', vietnamese: 'Táo' },
      { simplified: '鸡蛋', traditional: '雞蛋', pinyin: 'jīdàn', vietnamese: 'Trứng gà' },
      { simplified: '牛奶', traditional: '牛奶', pinyin: 'niúnǎi', vietnamese: 'Sữa bò' },
      { simplified: '咖啡', traditional: '咖啡', pinyin: 'kāfēi', vietnamese: 'Cà phê' },
      { simplified: '菜', traditional: '菜', pinyin: 'cài', vietnamese: 'Rau, Món ăn', strokes: 11 },
    ],
  },
  {
    id: 'hsk-school',
    label_vi: 'Học tập',
    emoji: '📚',
    words: [
      { simplified: '学习', traditional: '學習', pinyin: 'xuéxí', vietnamese: 'Học tập' },
      { simplified: '学校', traditional: '學校', pinyin: 'xuéxiào', vietnamese: 'Trường học' },
      { simplified: '书', traditional: '書', pinyin: 'shū', vietnamese: 'Sách', strokes: 4 },
      { simplified: '写字', traditional: '寫字', pinyin: 'xiě zì', vietnamese: 'Viết chữ' },
      { simplified: '汉字', traditional: '漢字', pinyin: 'Hànzì', vietnamese: 'Chữ Hán' },
      { simplified: '中文', traditional: '中文', pinyin: 'Zhōngwén', vietnamese: 'Tiếng Trung' },
      { simplified: '英语', traditional: '英語', pinyin: 'Yīngyǔ', vietnamese: 'Tiếng Anh' },
      { simplified: '汉语', traditional: '漢語', pinyin: 'Hànyǔ', vietnamese: 'Tiếng Hán' },
      { simplified: '问题', traditional: '問題', pinyin: 'wèntí', vietnamese: 'Câu hỏi, Vấn đề' },
      { simplified: '名字', traditional: '名字', pinyin: 'míngzi', vietnamese: 'Tên' },
    ],
  },
  {
    id: 'hsk-daily',
    label_vi: 'Cuộc sống',
    emoji: '🏠',
    words: [
      { simplified: '大', traditional: '大', pinyin: 'dà', vietnamese: 'To, Lớn', strokes: 3 },
      { simplified: '小', traditional: '小', pinyin: 'xiǎo', vietnamese: 'Nhỏ', strokes: 3 },
      { simplified: '多', traditional: '多', pinyin: 'duō', vietnamese: 'Nhiều', strokes: 6 },
      { simplified: '少', traditional: '少', pinyin: 'shǎo', vietnamese: 'Ít', strokes: 4 },
      { simplified: '好', traditional: '好', pinyin: 'hǎo', vietnamese: 'Tốt', strokes: 6 },
      { simplified: '热', traditional: '熱', pinyin: 'rè', vietnamese: 'Nóng', strokes: 10 },
      { simplified: '冷', traditional: '冷', pinyin: 'lěng', vietnamese: 'Lạnh', strokes: 7 },
      { simplified: '人', traditional: '人', pinyin: 'rén', vietnamese: 'Người', strokes: 2 },
      { simplified: '男', traditional: '男', pinyin: 'nán', vietnamese: 'Nam', strokes: 7 },
      { simplified: '女', traditional: '女', pinyin: 'nǚ', vietnamese: 'Nữ', strokes: 3 },
    ],
  },
  {
    id: 'hsk-verbs',
    label_vi: 'Động từ',
    emoji: '🗣️',
    words: [
      { simplified: '来', traditional: '來', pinyin: 'lái', vietnamese: 'Đến', strokes: 7 },
      { simplified: '去', traditional: '去', pinyin: 'qù', vietnamese: 'Đi', strokes: 5 },
      { simplified: '看', traditional: '看', pinyin: 'kàn', vietnamese: 'Nhìn, Xem', strokes: 9 },
      { simplified: '听', traditional: '聽', pinyin: 'tīng', vietnamese: 'Nghe', strokes: 7 },
      { simplified: '说', traditional: '說', pinyin: 'shuō', vietnamese: 'Nói', strokes: 9 },
      { simplified: '读', traditional: '讀', pinyin: 'dú', vietnamese: 'Đọc', strokes: 10 },
      { simplified: '写', traditional: '寫', pinyin: 'xiě', vietnamese: 'Viết', strokes: 5 },
      { simplified: '走', traditional: '走', pinyin: 'zǒu', vietnamese: 'Đi bộ', strokes: 7 },
      { simplified: '坐', traditional: '坐', pinyin: 'zuò', vietnamese: 'Ngồi', strokes: 7 },
      { simplified: '站', traditional: '站', pinyin: 'zhàn', vietnamese: 'Đứng', strokes: 10 },
      { simplified: '做', traditional: '做', pinyin: 'zuò', vietnamese: 'Làm', strokes: 11 },
      { simplified: '买', traditional: '買', pinyin: 'mǎi', vietnamese: 'Mua', strokes: 6 },
      { simplified: '卖', traditional: '賣', pinyin: 'mài', vietnamese: 'Bán', strokes: 8 },
      { simplified: '回', traditional: '回', pinyin: 'huí', vietnamese: 'Trở về', strokes: 6 },
      { simplified: '会', traditional: '會', pinyin: 'huì', vietnamese: 'Sẽ, Biết', strokes: 6 },
      { simplified: '想', traditional: '想', pinyin: 'xiǎng', vietnamese: 'Nghĩ, Muốn', strokes: 13 },
      { simplified: '认识', traditional: '認識', pinyin: 'rènshi', vietnamese: 'Nhận biết' },
      { simplified: '工作', traditional: '工作', pinyin: 'gōngzuò', vietnamese: 'Làm việc' },
      { simplified: '帮助', traditional: '幫助', pinyin: 'bāngzhù', vietnamese: 'Giúp đỡ' },
    ],
  },
  {
    id: 'hsk-adj',
    label_vi: 'Tính từ & Phó từ',
    emoji: '💬',
    words: [
      { simplified: '高兴', traditional: '高興', pinyin: 'gāoxìng', vietnamese: 'Vui vẻ' },
      { simplified: '漂亮', traditional: '漂亮', pinyin: 'piàoliang', vietnamese: 'Đẹp' },
      { simplified: '快', traditional: '快', pinyin: 'kuài', vietnamese: 'Nhanh', strokes: 7 },
      { simplified: '慢', traditional: '慢', pinyin: 'màn', vietnamese: 'Chậm', strokes: 14 },
      { simplified: '远', traditional: '遠', pinyin: 'yuǎn', vietnamese: 'Xa', strokes: 7 },
      { simplified: '近', traditional: '近', pinyin: 'jìn', vietnamese: 'Gần', strokes: 7 },
      { simplified: '长', traditional: '長', pinyin: 'cháng', vietnamese: 'Dài', strokes: 4 },
      { simplified: '新', traditional: '新', pinyin: 'xīn', vietnamese: 'Mới', strokes: 13 },
      { simplified: '很', traditional: '很', pinyin: 'hěn', vietnamese: 'Rất', strokes: 9 },
      { simplified: '都', traditional: '都', pinyin: 'dōu', vietnamese: 'Đều', strokes: 10 },
      { simplified: '也', traditional: '也', pinyin: 'yě', vietnamese: 'Cũng', strokes: 3 },
      { simplified: '太', traditional: '太', pinyin: 'tài', vietnamese: 'Quá, Lắm', strokes: 4 },
      { simplified: '最', traditional: '最', pinyin: 'zuì', vietnamese: 'Nhất', strokes: 12 },
    ],
  },
  {
    id: 'hsk-places',
    label_vi: 'Địa điểm',
    emoji: '🏙️',
    words: [
      { simplified: '中国', traditional: '中國', pinyin: 'Zhōngguó', vietnamese: 'Trung Quốc' },
      { simplified: '北京', traditional: '北京', pinyin: 'Běijīng', vietnamese: 'Bắc Kinh' },
      { simplified: '上海', traditional: '上海', pinyin: 'Shànghǎi', vietnamese: 'Thượng Hải' },
      { simplified: '医院', traditional: '醫院', pinyin: 'yīyuàn', vietnamese: 'Bệnh viện' },
      { simplified: '商店', traditional: '商店', pinyin: 'shāngdiàn', vietnamese: 'Cửa hàng' },
      { simplified: '饭店', traditional: '飯店', pinyin: 'fàndiàn', vietnamese: 'Nhà hàng' },
      { simplified: '火车站', traditional: '火車站', pinyin: 'huǒchē zhàn', vietnamese: 'Ga tàu' },
      { simplified: '机场', traditional: '機場', pinyin: 'jīchǎng', vietnamese: 'Sân bay' },
      { simplified: '房间', traditional: '房間', pinyin: 'fángjiān', vietnamese: 'Phòng' },
    ],
  },
  {
    id: 'hsk-pronouns',
    label_vi: 'Đại từ & Khác',
    emoji: '📝',
    words: [
      { simplified: '这', traditional: '這', pinyin: 'zhè', vietnamese: 'Đây, Này', strokes: 7 },
      { simplified: '那', traditional: '那', pinyin: 'nà', vietnamese: 'Kia, Đó', strokes: 6 },
      { simplified: '什么', traditional: '什麼', pinyin: 'shénme', vietnamese: 'Cái gì' },
      { simplified: '谁', traditional: '誰', pinyin: 'shuí', vietnamese: 'Ai', strokes: 10 },
      { simplified: '哪', traditional: '哪', pinyin: 'nǎ', vietnamese: 'Nào', strokes: 9 },
      { simplified: '几', traditional: '幾', pinyin: 'jǐ', vietnamese: 'Mấy', strokes: 2 },
      { simplified: '怎么', traditional: '怎麼', pinyin: 'zěnme', vietnamese: 'Như thế nào' },
      { simplified: '多少', traditional: '多少', pinyin: 'duōshao', vietnamese: 'Bao nhiêu' },
      { simplified: '的', traditional: '的', pinyin: 'de', vietnamese: 'Của (trợ từ)', strokes: 8 },
      { simplified: '了', traditional: '了', pinyin: 'le', vietnamese: 'Rồi (trợ từ)', strokes: 2 },
      { simplified: '吗', traditional: '嗎', pinyin: 'ma', vietnamese: 'Không (câu hỏi)', strokes: 6 },
      { simplified: '不', traditional: '不', pinyin: 'bù', vietnamese: 'Không', strokes: 4 },
      { simplified: '没', traditional: '沒', pinyin: 'méi', vietnamese: 'Chưa, Không', strokes: 7 },
      { simplified: '和', traditional: '和', pinyin: 'hé', vietnamese: 'Và, Hòa', strokes: 8 },
    ],
  },
];

// ─── TOCFL 1 Vocabulary (Novice, Traditional Chinese) ───
export const tocfl1Topics: VocabTopic[] = [
  {
    id: 'tocfl-greetings',
    label_vi: 'Chào hỏi',
    emoji: '👋',
    words: [
      { simplified: '你好', traditional: '你好', pinyin: 'nǐ hǎo', vietnamese: 'Xin chào' },
      { simplified: '謝謝', traditional: '謝謝', pinyin: 'xièxie', vietnamese: 'Cảm ơn' },
      { simplified: '再見', traditional: '再見', pinyin: 'zàijiàn', vietnamese: 'Tạm biệt' },
      { simplified: '請', traditional: '請', pinyin: 'qǐng', vietnamese: 'Xin mời', strokes: 10 },
      { simplified: '對不起', traditional: '對不起', pinyin: 'duìbuqǐ', vietnamese: 'Xin lỗi' },
      { simplified: '沒關係', traditional: '沒關係', pinyin: 'méi guānxi', vietnamese: 'Không sao' },
      { simplified: '歡迎', traditional: '歡迎', pinyin: 'huānyíng', vietnamese: 'Hoan nghênh' },
      { simplified: '早安', traditional: '早安', pinyin: 'zǎo ān', vietnamese: 'Chào buổi sáng' },
      { simplified: '晚安', traditional: '晚安', pinyin: 'wǎn ān', vietnamese: 'Chào buổi tối' },
      { simplified: '不客氣', traditional: '不客氣', pinyin: 'bú kèqì', vietnamese: 'Không客气' },
    ],
  },
  {
    id: 'tocfl-people',
    label_vi: 'Con người',
    emoji: '👨‍👩‍👧',
    words: [
      { simplified: '我', traditional: '我', pinyin: 'wǒ', vietnamese: 'Tôi', strokes: 7 },
      { simplified: '你', traditional: '你', pinyin: 'nǐ', vietnamese: 'Bạn', strokes: 7 },
      { simplified: '他', traditional: '他', pinyin: 'tā', vietnamese: 'Anh ấy', strokes: 5 },
      { simplified: '她', traditional: '她', pinyin: 'tā', vietnamese: 'Cô ấy', strokes: 6 },
      { simplified: '我們', traditional: '我們', pinyin: 'wǒmen', vietnamese: 'Chúng tôi' },
      { simplified: '先生', traditional: '先生', pinyin: 'xiānsheng', vietnamese: 'Ông' },
      { simplified: '小姐', traditional: '小姐', pinyin: 'xiǎojiě', vietnamese: 'Cô, Chị' },
      { simplified: '同學', traditional: '同學', pinyin: 'tóngxué', vietnamese: 'Bạn học' },
      { simplified: '朋友', traditional: '朋友', pinyin: 'péngyou', vietnamese: 'Bạn bè' },
      { simplified: '老師', traditional: '老師', pinyin: 'lǎoshī', vietnamese: 'Giáo viên' },
      { simplified: '學生', traditional: '學生', pinyin: 'xuésheng', vietnamese: 'Học sinh' },
    ],
  },
  {
    id: 'tocfl-family',
    label_vi: 'Gia đình',
    emoji: '👨‍👩‍👦',
    words: [
      { simplified: '爸爸', traditional: '爸爸', pinyin: 'bàba', vietnamese: 'Bố' },
      { simplified: '媽媽', traditional: '媽媽', pinyin: 'māma', vietnamese: 'Mẹ' },
      { simplified: '哥哥', traditional: '哥哥', pinyin: 'gēge', vietnamese: 'Anh trai' },
      { simplified: '弟弟', traditional: '弟弟', pinyin: 'dìdi', vietnamese: 'Em trai' },
      { simplified: '姐姐', traditional: '姐姐', pinyin: 'jiějie', vietnamese: 'Chị gái' },
      { simplified: '妹妹', traditional: '妹妹', pinyin: 'mèimei', vietnamese: 'Em gái' },
      { simplified: '兒子', traditional: '兒子', pinyin: 'érzi', vietnamese: 'Con trai' },
      { simplified: '女兒', traditional: '女兒', pinyin: 'nǚ\'ér', vietnamese: 'Con gái' },
      { simplified: '家', traditional: '家', pinyin: 'jiā', vietnamese: 'Nhà, Gia đình', strokes: 10 },
    ],
  },
  {
    id: 'tocfl-numbers',
    label_vi: 'Số đếm',
    emoji: '🔢',
    words: [
      { simplified: '一', traditional: '一', pinyin: 'yī', vietnamese: 'Một', strokes: 1 },
      { simplified: '二', traditional: '二', pinyin: 'èr', vietnamese: 'Hai', strokes: 2 },
      { simplified: '三', traditional: '三', pinyin: 'sān', vietnamese: 'Ba', strokes: 3 },
      { simplified: '四', traditional: '四', pinyin: 'sì', vietnamese: 'Bốn', strokes: 5 },
      { simplified: '五', traditional: '五', pinyin: 'wǔ', vietnamese: 'Năm', strokes: 4 },
      { simplified: '六', traditional: '六', pinyin: 'liù', vietnamese: 'Sáu', strokes: 4 },
      { simplified: '七', traditional: '七', pinyin: 'qī', vietnamese: 'Bảy', strokes: 2 },
      { simplified: '八', traditional: '八', pinyin: 'bā', vietnamese: 'Tám', strokes: 2 },
      { simplified: '九', traditional: '九', pinyin: 'jiǔ', vietnamese: 'Chín', strokes: 2 },
      { simplified: '十', traditional: '十', pinyin: 'shí', vietnamese: 'Mười', strokes: 2 },
      { simplified: '百', traditional: '百', pinyin: 'bǎi', vietnamese: 'Trăm', strokes: 6 },
      { simplified: '千', traditional: '千', pinyin: 'qiān', vietnamese: 'Nghìn', strokes: 3 },
      { simplified: '萬', traditional: '萬', pinyin: 'wàn', vietnamese: 'Vạn', strokes: 12 },
    ],
  },
  {
    id: 'tocfl-time',
    label_vi: 'Thời gian',
    emoji: '🕐',
    words: [
      { simplified: '今天', traditional: '今天', pinyin: 'jīntiān', vietnamese: 'Hôm nay' },
      { simplified: '明天', traditional: '明天', pinyin: 'míngtiān', vietnamese: 'Ngày mai' },
      { simplified: '昨天', traditional: '昨天', pinyin: 'zuótiān', vietnamese: 'Hôm qua' },
      { simplified: '現在', traditional: '現在', pinyin: 'xiànzài', vietnamese: 'Hiện tại' },
      { simplified: '時候', traditional: '時候', pinyin: 'shíhou', vietnamese: 'Lúc' },
      { simplified: '年', traditional: '年', pinyin: 'nián', vietnamese: 'Năm', strokes: 6 },
      { simplified: '月', traditional: '月', pinyin: 'yuè', vietnamese: 'Tháng', strokes: 4 },
      { simplified: '日', traditional: '日', pinyin: 'rì', vietnamese: 'Ngày', strokes: 4 },
      { simplified: '星期', traditional: '星期', pinyin: 'xīngqī', vietnamese: 'Tuần lễ' },
      { simplified: '點', traditional: '點', pinyin: 'diǎn', vietnamese: 'Giờ', strokes: 9 },
      { simplified: '分', traditional: '分', pinyin: 'fēn', vietnamese: 'Phút', strokes: 4 },
      { simplified: '上午', traditional: '上午', pinyin: 'shàngwǔ', vietnamese: 'Buổi sáng' },
      { simplified: '下午', traditional: '下午', pinyin: 'xiàwǔ', vietnamese: 'Buổi chiều' },
    ],
  },
  {
    id: 'tocfl-food',
    label_vi: 'Ăn uống',
    emoji: '🍜',
    words: [
      { simplified: '吃', traditional: '吃', pinyin: 'chī', vietnamese: 'Ăn', strokes: 6 },
      { simplified: '喝', traditional: '喝', pinyin: 'hē', vietnamese: 'Uống', strokes: 12 },
      { simplified: '水', traditional: '水', pinyin: 'shuǐ', vietnamese: 'Nước', strokes: 4 },
      { simplified: '茶', traditional: '茶', pinyin: 'chá', vietnamese: 'Trà', strokes: 9 },
      { simplified: '飯', traditional: '飯', pinyin: 'fàn', vietnamese: 'Cơm', strokes: 7 },
      { simplified: '水果', traditional: '水果', pinyin: 'shuǐguǒ', vietnamese: 'Trái cây' },
      { simplified: '蘋果', traditional: '蘋果', pinyin: 'píngguǒ', vietnamese: 'Táo' },
      { simplified: '雞蛋', traditional: '雞蛋', pinyin: 'jīdàn', vietnamese: 'Trứng gà' },
      { simplified: '牛奶', traditional: '牛奶', pinyin: 'niúnǎi', vietnamese: 'Sữa bò' },
      { simplified: '咖啡', traditional: '咖啡', pinyin: 'kāfēi', vietnamese: 'Cà phê' },
      { simplified: '菜', traditional: '菜', pinyin: 'cài', vietnamese: 'Rau, Món', strokes: 11 },
      { simplified: '便當', traditional: '便當', pinyin: 'biàndāng', vietnamese: 'Cơm hộp' },
    ],
  },
  {
    id: 'tocfl-school',
    label_vi: 'Học tập',
    emoji: '📚',
    words: [
      { simplified: '學習', traditional: '學習', pinyin: 'xuéxí', vietnamese: 'Học tập' },
      { simplified: '學校', traditional: '學校', pinyin: 'xuéxiào', vietnamese: 'Trường học' },
      { simplified: '書', traditional: '書', pinyin: 'shū', vietnamese: 'Sách', strokes: 10 },
      { simplified: '寫字', traditional: '寫字', pinyin: 'xiě zì', vietnamese: 'Viết chữ' },
      { simplified: '漢字', traditional: '漢字', pinyin: 'Hànzì', vietnamese: 'Chữ Hán' },
      { simplified: '中文', traditional: '中文', pinyin: 'Zhōngwén', vietnamese: 'Tiếng Trung' },
      { simplified: '英語', traditional: '英語', pinyin: 'Yīngyǔ', vietnamese: 'Tiếng Anh' },
      { simplified: '問題', traditional: '問題', pinyin: 'wèntí', vietnamese: 'Câu hỏi' },
      { simplified: '名字', traditional: '名字', pinyin: 'míngzi', vietnamese: 'Tên' },
      { simplified: '功課', traditional: '功課', pinyin: 'gōngkè', vietnamese: 'Bài tập' },
    ],
  },
  {
    id: 'tocfl-daily',
    label_vi: 'Cuộc sống',
    emoji: '🏠',
    words: [
      { simplified: '大', traditional: '大', pinyin: 'dà', vietnamese: 'To, Lớn', strokes: 3 },
      { simplified: '小', traditional: '小', pinyin: 'xiǎo', vietnamese: 'Nhỏ', strokes: 3 },
      { simplified: '多', traditional: '多', pinyin: 'duō', vietnamese: 'Nhiều', strokes: 6 },
      { simplified: '少', traditional: '少', pinyin: 'shǎo', vietnamese: 'Ít', strokes: 4 },
      { simplified: '好', traditional: '好', pinyin: 'hǎo', vietnamese: 'Tốt', strokes: 6 },
      { simplified: '熱', traditional: '熱', pinyin: 'rè', vietnamese: 'Nóng', strokes: 15 },
      { simplified: '冷', traditional: '冷', pinyin: 'lěng', vietnamese: 'Lạnh', strokes: 7 },
      { simplified: '人', traditional: '人', pinyin: 'rén', vietnamese: 'Người', strokes: 2 },
      { simplified: '男', traditional: '男', pinyin: 'nán', vietnamese: 'Nam', strokes: 7 },
      { simplified: '女', traditional: '女', pinyin: 'nǚ', vietnamese: 'Nữ', strokes: 3 },
    ],
  },
  {
    id: 'tocfl-verbs',
    label_vi: 'Động từ',
    emoji: '🗣️',
    words: [
      { simplified: '來', traditional: '來', pinyin: 'lái', vietnamese: 'Đến', strokes: 8 },
      { simplified: '去', traditional: '去', pinyin: 'qù', vietnamese: 'Đi', strokes: 5 },
      { simplified: '看', traditional: '看', pinyin: 'kàn', vietnamese: 'Nhìn, Xem', strokes: 9 },
      { simplified: '聽', traditional: '聽', pinyin: 'tīng', vietnamese: 'Nghe', strokes: 22 },
      { simplified: '說', traditional: '說', pinyin: 'shuō', vietnamese: 'Nói', strokes: 14 },
      { simplified: '讀', traditional: '讀', pinyin: 'dú', vietnamese: 'Đọc', strokes: 22 },
      { simplified: '寫', traditional: '寫', pinyin: 'xiě', vietnamese: 'Viết', strokes: 15 },
      { simplified: '走', traditional: '走', pinyin: 'zǒu', vietnamese: 'Đi bộ', strokes: 7 },
      { simplified: '坐', traditional: '坐', pinyin: 'zuò', vietnamese: 'Ngồi', strokes: 7 },
      { simplified: '做', traditional: '做', pinyin: 'zuò', vietnamese: 'Làm', strokes: 11 },
      { simplified: '買', traditional: '買', pinyin: 'mǎi', vietnamese: 'Mua', strokes: 12 },
      { simplified: '賣', traditional: '賣', pinyin: 'mài', vietnamese: 'Bán', strokes: 15 },
      { simplified: '幫忙', traditional: '幫忙', pinyin: 'bāngmáng', vietnamese: 'Giúp đỡ' },
      { simplified: '工作', traditional: '工作', pinyin: 'gōngzuò', vietnamese: 'Làm việc' },
    ],
  },
  {
    id: 'tocfl-adj',
    label_vi: 'Tính từ & Phó từ',
    emoji: '💬',
    words: [
      { simplified: '高興', traditional: '高興', pinyin: 'gāoxìng', vietnamese: 'Vui vẻ' },
      { simplified: '漂亮', traditional: '漂亮', pinyin: 'piàoliang', vietnamese: 'Đẹp' },
      { simplified: '快', traditional: '快', pinyin: 'kuài', vietnamese: 'Nhanh', strokes: 7 },
      { simplified: '慢', traditional: '慢', pinyin: 'màn', vietnamese: 'Chậm', strokes: 14 },
      { simplified: '遠', traditional: '遠', pinyin: 'yuǎn', vietnamese: 'Xa', strokes: 13 },
      { simplified: '近', traditional: '近', pinyin: 'jìn', vietnamese: 'Gần', strokes: 7 },
      { simplified: '長', traditional: '長', pinyin: 'cháng', vietnamese: 'Dài', strokes: 8 },
      { simplified: '新', traditional: '新', pinyin: 'xīn', vietnamese: 'Mới', strokes: 13 },
      { simplified: '很', traditional: '很', pinyin: 'hěn', vietnamese: 'Rất', strokes: 9 },
      { simplified: '也', traditional: '也', pinyin: 'yě', vietnamese: 'Cũng', strokes: 3 },
      { simplified: '太', traditional: '太', pinyin: 'tài', vietnamese: 'Quá', strokes: 4 },
      { simplified: '最', traditional: '最', pinyin: 'zuì', vietnamese: 'Nhất', strokes: 12 },
    ],
  },
  {
    id: 'tocfl-taiwan',
    label_vi: 'Đài Loan & Địa điểm',
    emoji: '🏙️',
    words: [
      { simplified: '台灣', traditional: '臺灣', pinyin: 'Táiwān', vietnamese: 'Đài Loan' },
      { simplified: '台北', traditional: '臺北', pinyin: 'Táiběi', vietnamese: 'Đài Bắc' },
      { simplified: '醫院', traditional: '醫院', pinyin: 'yīyuàn', vietnamese: 'Bệnh viện' },
      { simplified: '商店', traditional: '商店', pinyin: 'shāngdiàn', vietnamese: 'Cửa hàng' },
      { simplified: '餐廳', traditional: '餐廳', pinyin: 'cāntīng', vietnamese: 'Nhà hàng' },
      { simplified: '車站', traditional: '車站', pinyin: 'chēzhàn', vietnamese: 'Ga xe' },
      { simplified: '機場', traditional: '機場', pinyin: 'jīchǎng', vietnamese: 'Sân bay' },
      { simplified: '房間', traditional: '房間', pinyin: 'fángjiān', vietnamese: 'Phòng' },
      { simplified: '捷運', traditional: '捷運', pinyin: 'jiéyùn', vietnamese: 'Tàu điện' },
    ],
  },
  {
    id: 'tocfl-pronouns',
    label_vi: 'Đại từ & Khác',
    emoji: '📝',
    words: [
      { simplified: '這', traditional: '這', pinyin: 'zhè', vietnamese: 'Đây, Này', strokes: 14 },
      { simplified: '那', traditional: '那', pinyin: 'nà', vietnamese: 'Kia, Đó', strokes: 6 },
      { simplified: '什麼', traditional: '什麼', pinyin: 'shénme', vietnamese: 'Cái gì' },
      { simplified: '誰', traditional: '誰', pinyin: 'shuí', vietnamese: 'Ai', strokes: 15 },
      { simplified: '哪', traditional: '哪', pinyin: 'nǎ', vietnamese: 'Nào', strokes: 9 },
      { simplified: '幾', traditional: '幾', pinyin: 'jǐ', vietnamese: 'Mấy', strokes: 12 },
      { simplified: '怎麼', traditional: '怎麼', pinyin: 'zěnme', vietnamese: 'Như thế nào' },
      { simplified: '多少', traditional: '多少', pinyin: 'duōshao', vietnamese: 'Bao nhiêu' },
      { simplified: '的', traditional: '的', pinyin: 'de', vietnamese: 'Của (trợ từ)', strokes: 8 },
      { simplified: '了', traditional: '了', pinyin: 'le', vietnamese: 'Rồi (trợ từ)', strokes: 2 },
      { simplified: '嗎', traditional: '嗎', pinyin: 'ma', vietnamese: 'Không (câu hỏi)', strokes: 13 },
      { simplified: '不', traditional: '不', pinyin: 'bù', vietnamese: 'Không', strokes: 4 },
      { simplified: '沒', traditional: '沒', pinyin: 'méi', vietnamese: 'Chưa, Không', strokes: 7 },
      { simplified: '和', traditional: '和', pinyin: 'hé', vietnamese: 'Và, Hòa', strokes: 8 },
    ],
  },
];

// ─── Helper functions ───

export function getTopics(script: ScriptType): VocabTopic[] {
  return script === 'simplified' ? hsk1Topics : tocfl1Topics;
}

export function getDisplayChar(word: VocabWord, script: ScriptType): string {
  return script === 'simplified' ? word.simplified : word.traditional;
}

export function getAllWords(script: ScriptType): VocabWord[] {
  return getTopics(script).flatMap((t) => t.words);
}

// Get single chars for writing practice (filter to 1-char words with stroke count)
export function getWritableChars(script: ScriptType): VocabWord[] {
  return getAllWords(script).filter((w) => {
    const char = getDisplayChar(w, script);
    return char.length === 1 && w.strokes && w.strokes > 0;
  });
}
