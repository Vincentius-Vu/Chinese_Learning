import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readingData as originalReadingData } from '../src/data/vocabulary.js';

// Resolve directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const vocabularyPath = path.resolve(__dirname, '../src/data/vocabulary.js');

console.log('Reading original vocabulary file from:', vocabularyPath);

// 1. Filter out duplicate ID "r16" and correct typo in "r4"
const processedReadingData = [];
const seenIds = new Set();

for (const lesson of originalReadingData) {
  if (lesson.id === 'r16') {
    if (!seenIds.has('r16')) {
      seenIds.add('r16');
      processedReadingData.push(lesson);
      console.log('Retained first occurrence of r16.');
    } else {
      console.log('Skipped duplicate occurrence of r16.');
    }
  } else if (lesson.id === 'r4') {
    // Fix typo in r4
    const correctedLesson = { ...lesson };
    correctedLesson.contentSimplified = correctedLesson.contentSimplified.replace('生病 cascade', '生病了');
    processedReadingData.push(correctedLesson);
    console.log('Corrected typo "生病 cascade" to "生病了" in r4.');
  } else {
    processedReadingData.push(lesson);
  }
}

// 2. Define the 20 new high-quality lessons
const newLessons = [
  // --- LEVEL 1 (HSK 1 / TOCFL 1) ---
  {
    id: "r22",
    level: 1,
    titleSimplified: "你在做什么？",
    titleTraditional: "你在做什麼？",
    pinyinTitle: "Nǐ zài zuò shénme?",
    translationTitle: "Bạn đang làm gì thế?",
    contentSimplified: "A: 你好！你在做什么？\nB: 你好！我在看书。你呢？\nA: 我在喝茶，我的猫在睡觉。\nB: 你的猫很漂亮！\nA: 谢谢！下午我们去公园，好吗？\nB: 太好了，我们三点去吧！",
    contentTraditional: "A: 你好！你在做什麼？\nB: 你好！我在看書。你呢？\nA: 我在喝茶，我的貓在睡覺。\nB: 你的貓很漂亮！\nA: 謝謝！下午我們去公園，好嗎？\nB: 太好了，我們三點去吧！",
    pinyinText: "A: Nǐ hǎo! Nǐ zài zuò shénme?\nB: Nǐ hǎo! Wǒ zài kànshū. Nǐ ne?\nA: Wǒ zài hē chá, wǒ de māo zài shuìjiào.\nB: Nǐ de māo hěn piàoliang!\nA: Xièxie! Xiàwǔ wǒmen qù gōngyuán, hǎo ma?\nB: Tài hǎo le, wǒmen sān diǎn qù ba!",
    translationText: "A: Xin chào! Bạn đang làm gì thế?\nB: Xin chào! Tôi đang đọc sách. Còn bạn?\nA: Tôi đang uống trà, con mèo của tôi đang ngủ.\nB: Con mèo của bạn đẹp quá!\nA: Cảm ơn! Chiều nay chúng ta đi công viên nhé, được không?\nB: Tuyệt quá, chúng ta đi lúc ba giờ nhé!",
    vocabulary: [
      { simplified: "做", traditional: "做", pinyin: "zuò", meaning: "Làm" },
      { simplified: "什么", traditional: "什麼", pinyin: "shénme", meaning: "Cái gì" },
      { simplified: "喝茶", traditional: "喝茶", pinyin: "hē chá", meaning: "Uống trà" },
      { simplified: "睡觉", traditional: "睡覺", pinyin: "shuìjiào", meaning: "Ngủ" },
      { simplified: "公园", traditional: "公園", pinyin: "gōngyuán", meaning: "Công viên" },
      { simplified: "三点", traditional: "三點", pinyin: "sān diǎn", meaning: "Ba giờ" }
    ],
    quizzes: [
      {
        question: "Nhân vật B đang làm gì?",
        options: [
          { text: "看书 (Đọc sách)", isCorrect: true },
          { text: "喝茶 (Uống trà)", isCorrect: false },
          { text: "睡觉 (Ngủ)", isCorrect: false }
        ],
        explanation: "B nói: '我在看书' (Tôi đang đọc sách)."
      },
      {
        question: "Hai nhân vật hẹn đi đâu vào buổi chiều?",
        options: [
          { text: "商店 (Cửa hàng)", isCorrect: false },
          { text: "公园 (Công viên)", isCorrect: true },
          { text: "学校 (Trường học)", isCorrect: false }
        ],
        explanation: "A rủ '下午我们去公园，好吗？' (Chiều nay chúng ta đi công viên nhé, được không?) và B đồng ý."
      }
    ]
  },
  {
    id: "r23",
    level: 1,
    titleSimplified: "明天是星期几？",
    titleTraditional: "明天是星期幾？",
    pinyinTitle: "Míngtiān shì xīngqī jǐ?",
    translationTitle: "Ngày mai là thứ mấy?",
    contentSimplified: "A: 请问，今天几号？\nB: 今天是五月二十一号，星期四。\nA: 明天是你的生日吗？\nB: 不是，我的生日是五月三十号。\nA: 明天星期五，我们去中国馆吃面，怎么样？\nB: 没问题，我很喜欢吃中国面！",
    contentTraditional: "A: 請問，今天幾號？\nB: 今天是五月二十一號，星期四。\nA: 明天是你的生日嗎？\nB: 不是，我的生日是五月三十號。\nA: 明天星期五，我們去中國館吃麵，怎麼樣？\nB: 沒問題，我很喜歡吃中國麵！",
    pinyinText: "A: Qǐngwèn, jīntiān jǐ hào?\nB: Jīntiān shì wǔ yuè èrshíyī hào, xīngqīsì.\nA: Míngtiān shì nǐ de shēngrì ma?\nB: Bú shì, wǒ de shēngrì shì wǔ yuè sānshí hào.\nA: Míngtiān xīngqīwǔ, wǒmen qù Zhōngguó guǎn chī miàn, zěnmeyàng?\nB: Méi wèntǐ, wǒ hěn xǐhuān chī Zhōngguó miàn!",
    translationText: "A: Xin hỏi, hôm nay ngày mấy?\nB: Hôm nay là ngày 21 tháng 5, thứ Năm.\nA: Ngày mai là sinh nhật của bạn phải không?\nB: Không phải, sinh nhật của tôi là ngày 30 tháng 5.\nA: Ngày mai thứ Sáu, chúng ta đến quán Trung Quốc ăn mì nhé, thấy sao?\nB: Không vấn đề gì, tôi rất thích ăn mì Trung Quốc!",
    vocabulary: [
      { simplified: "今天", traditional: "今天", pinyin: "jīntiān", meaning: "Hôm nay" },
      { simplified: "几号", traditional: "幾號", pinyin: "jǐ hào", meaning: "Ngày mấy" },
      { simplified: "星期四", traditional: "星期四", pinyin: "xīngqīsì", meaning: "Thứ Năm" },
      { simplified: "生日", traditional: "生日", pinyin: "shēngrì", meaning: "Sinh nhật" },
      { simplified: "吃面", traditional: "吃麵", pinyin: "chī miàn", meaning: "Ăn mì" },
      { simplified: "没问题", traditional: "沒問題", pinyin: "méi wèntǐ", meaning: "Không vấn đề gì" }
    ],
    quizzes: [
      {
        question: "Hôm nay là ngày bao nhiêu?",
        options: [
          { text: "Năm tháng ba mươi (5月30号)", isCorrect: false },
          { text: "Năm tháng hai mươi mốt (5月21号)", isCorrect: true },
          { text: "Năm tháng hai mươi hai (5月22号)", isCorrect: false }
        ],
        explanation: "B nói: '今天是五月二十一号' (Hôm nay là ngày 21 tháng 5)."
      },
      {
        question: "Họ rủ nhau ăn món gì vào ngày mai?",
        options: [
          { text: "水果 (Hoa quả)", isCorrect: false },
          { text: "鱼 (Cá)", isCorrect: false },
          { text: "面 (Mì)", isCorrect: true }
        ],
        explanation: "A đề xuất: '明天星期五，我们去中国馆吃面' (Ngày mai thứ Sáu, chúng ta đến quán Trung Quốc ăn mì)."
      }
    ]
  },

  // --- LEVEL 2 (HSK 2 / TOCFL 2) ---
  {
    id: "r24",
    level: 2,
    titleSimplified: "买新手机",
    titleTraditional: "買新手機",
    pinyinTitle: "Mǎi xīn shǒujī",
    translationTitle: "Mua điện thoại mới",
    contentSimplified: "我的旧手机用了三年了，有很多问题，现在非常慢。今天下午，我和哥哥一起去商店买了一部新手机。这个新手机不贵，而且拍照非常漂亮。售货员的服务也很热情，我非常高兴。",
    contentTraditional: "我的舊手機用了三年了，有很多問題，現在非常慢。今天下午，我和哥哥一起去商店買了一部新手機。這個新手機不貴，而且拍照非常漂亮。售貨員的服務也很熱情，我非常高慶。",
    pinyinText: "Wǒ de jiù shǒujī yòng le sān nián le, yǒu hěn duō wèntǐ, xiànzài fēicháng màn. Jīntiān xiàwǔ, wǒ hé gēge yìqǐ qù shāngdiàn mǎi le yí bù xīn shǒujī. Zhège xīn shǒujī bú guì, érqiě pāizhào fēicháng piàoliang. Shòuhuòyuán de fúwù yě hěn rèqíng, wǒ fēicháng gāoxìng.",
    translationText: "Điện thoại cũ của tôi đã dùng được ba năm rồi, có rất nhiều vấn đề, hiện tại chạy rất chậm. Chiều hôm nay, tôi cùng anh trai đi đến cửa hàng mua một chiếc điện thoại mới. Chiếc điện thoại mới này không đắt, hơn nữa chụp ảnh vô cùng đẹp. Dịch vụ của nhân viên bán hàng cũng rất nhiệt tình, tôi rất vui vẻ.",
    vocabulary: [
      { simplified: "手机", traditional: "手機", pinyin: "shǒujī", meaning: "Điện thoại di động" },
      { simplified: "旧", traditional: "舊", pinyin: "jiù", meaning: "Cũ" },
      { simplified: "慢", traditional: "慢", pinyin: "màn", meaning: "Chậm" },
      { simplified: "拍照", traditional: "拍照", pinyin: "pāizhào", meaning: "Chụp ảnh" },
      { simplified: "售货员", traditional: "售貨員", pinyin: "shòuhuòyuán", meaning: "Nhân viên bán hàng" },
      { simplified: "服务", traditional: "服務", pinyin: "fúwù", meaning: "Phục vụ, dịch vụ" }
    ],
    quizzes: [
      {
        question: "Tại sao nhân vật chính muốn thay điện thoại?",
        options: [
          { text: "Vì điện thoại cũ bị mất", isCorrect: false },
          { text: "Vì điện thoại cũ đã dùng 3 năm và rất chậm", isCorrect: true },
          { text: "Vì anh trai tặng tiền mua máy mới", isCorrect: false }
        ],
        explanation: "Đoạn văn viết: '我的旧手机用了三年了... 现在非常慢' (Điện thoại cũ của tôi đã dùng được ba năm... hiện tại chạy rất chậm)."
      },
      {
        question: "Đặc điểm của chiếc điện thoại mới mua là gì?",
        options: [
          { text: "Rất đắt đỏ và khó sử dụng", isCorrect: false },
          { text: "Không đắt và chụp ảnh vô cùng đẹp", isCorrect: true },
          { text: "Kích thước quá lớn và nặng nề", isCorrect: false }
        ],
        explanation: "Câu '这个新手机不贵，而且拍照非常漂亮' dịch là: 'Điện thoại mới này không đắt, hơn nữa chụp ảnh vô cùng đẹp'."
      }
    ]
  },
  {
    id: "r25",
    level: 2,
    titleSimplified: "我的小狗和小猫",
    titleTraditional: "我的小狗和小貓",
    pinyinTitle: "Wǒ de xiǎogǒu hé xiǎomāo",
    translationTitle: "Chú chó nhỏ và chú mèo nhỏ của tôi",
    contentSimplified: "我家有一只小狗和一只小猫。小狗叫“乐乐”，今年两岁了，它喜欢跑步和吃肉。小猫叫“咪咪”，只有一岁，喜欢睡觉和喝牛奶。它们是很好的朋友，每天下午都在房间里一起玩，非常可爱。",
    contentTraditional: "我家有一隻小狗和一隻小貓。小狗叫“樂樂”，今年兩歲了，牠喜歡跑步和吃肉。小貓叫“咪咪”，只有一歲，喜歡睡覺和喝牛奶。牠們是很好的朋友，每天下午都在房間裡一起玩，非常可愛。",
    pinyinText: "Wǒjiā yǒu yì zhī xiǎogǒu hé yì zhī xiǎomāo. Xiǎogǒu jiào 'Lèlè', jīntiān liǎng suì le, tā xǐhuān pǎobù hé chī ròu. Xiǎomāo jiào 'Mīmī', zhǐyǒu yí suì, xǐhuān shuìjiào hé hē niúnǎi. Tāmen shì hěn hǎo de péngyou, měi tiān xiàwǔ dōu zài fángjiān lǐ yìqǐ wán, fēicháng kě'ài.",
    translationText: "Nhà tôi có một chú chó nhỏ và một chú mèo nhỏ. Chú chó tên là 'Lelè', năm nay hai tuổi rồi, nó thích chạy bộ và ăn thịt. Chú mèo tên là 'Mīmī', mới có một tuổi, thích ngủ và uống sữa bò. Chúng là những người bạn rất tốt, mỗi buổi chiều đều cùng chơi đùa trong phòng, vô cùng đáng yêu.",
    vocabulary: [
      { simplified: "两岁", traditional: "兩歲", pinyin: "liǎng suì", meaning: "Hai tuổi" },
      { simplified: "吃肉", traditional: "吃肉", pinyin: "chī ròu", meaning: "Ăn thịt" },
      { simplified: "牛奶", traditional: "牛奶", pinyin: "niúnǎi", meaning: "Sữa bò" },
      { simplified: "房间", traditional: "房間", pinyin: "fángjiān", meaning: "Căn phòng" },
      { simplified: "玩", traditional: "玩", pinyin: "wán", meaning: "Chơi, đùa nghịch" },
      { simplified: "可爱", traditional: "可愛", pinyin: "kě'ài", meaning: "Đáng yêu" }
    ],
    quizzes: [
      {
        question: "Chú chó Lèlè có sở thích nào sau đây?",
        options: [
          { text: "Ngủ nướng cả ngày", isCorrect: false },
          { text: "Chạy bộ và ăn thịt", isCorrect: true },
          { text: "Bắt cá ở bờ ao", isCorrect: false }
        ],
        explanation: "Đoạn văn viết: '它喜欢跑步和吃肉' (Nó thích chạy bộ và ăn thịt)."
      },
      {
        question: "Mối quan hệ giữa chú chó và chú mèo như thế nào?",
        options: [
          { text: "Rất hay cắn nhau và tức giận", isCorrect: false },
          { text: "Là bạn rất tốt, thường chơi cùng nhau", isCorrect: true },
          { text: "Không bao giờ gặp nhau trong nhà", isCorrect: false }
        ],
        explanation: "Văn bản nêu rõ: '它们是很好的朋友，每天下午都在房间里一起玩' (Chúng là bạn rất tốt, mỗi chiều đều chơi cùng nhau trong phòng)."
      }
    ]
  },
  {
    id: "r26",
    level: 2,
    titleSimplified: "下雨天不要出去",
    titleTraditional: "下雨天不要出去",
    pinyinTitle: "Xiàyǔtiān búyào chūqù",
    translationTitle: "Trời mưa đừng ra ngoài",
    contentSimplified: "今天早上突然下起了大雨，外面的路很湿。妈妈对我说：“今天不要出去了，就在家里吧。” 我听了妈妈的话，在房间里自学汉字、看报纸。下午雨停了，我和妹妹去商店买了一些新鲜的水果。",
    contentTraditional: "今天早上突然下起了大雨，外面的路很濕。媽媽對我說：“今天不要出去了，就在家裡吧。” 我聽了媽媽的話，在房間裡自學漢字、看報紙。下午雨停了，我和妹妹去商店買了一些新鮮的水果。",
    pinyinText: "Jīntiān zǎoshang tūrán xià qǐ le dàyǔ, wàimiàn de lù hěn shī. Māma duì wǒ shuō: 'Jīntiān búyào chūqù le, jiù zài jiālǐ ba.' Wǒ tīng le māma de huà, zài fángjiān lǐ zìxué Hànzì, kàn bàozhǐ. Xiàwǔ yǔ tíng le, wǒ hé mèimei qù shāngdiàn mǎi le yìxiē xīnxīan de shuǐguǒ.",
    translationText: "Sáng hôm nay bỗng nhiên đổ mưa to, đường xá bên ngoài rất ướt. Mẹ nói với tôi: 'Hôm nay đừng ra ngoài nữa, cứ ở nhà đi.' Tôi nghe lời mẹ, ở trong phòng tự học chữ Hán, đọc báo. Buổi chiều mưa tạnh, tôi và em gái đi đến cửa hàng mua một ít trái cây tươi ngon.",
    vocabulary: [
      { simplified: "突然", traditional: "突然", pinyin: "tūrán", meaning: "Bỗng nhiên, đột nhiên" },
      { simplified: "湿", traditional: "濕", pinyin: "shī", meaning: "Ướt" },
      { simplified: "听话", traditional: "聽話", pinyin: "tīnghuà", meaning: "Nghe lời" },
      { simplified: "自学", traditional: "自學", pinyin: "zìxué", meaning: "Tự học" },
      { simplified: "报纸", traditional: "報紙", pinyin: "bàozhǐ", meaning: "Tờ báo, báo giấy" },
      { simplified: "新鲜", traditional: "新鮮", pinyin: "xīnxian", meaning: "Tươi, tươi ngon" }
    ],
    quizzes: [
      {
        question: "Nhân vật chính đã làm gì ở nhà vào buổi sáng?",
        options: [
          { text: "Chơi điện tử và nghe nhạc", isCorrect: false },
          { text: "Tự học chữ Hán và đọc báo trong phòng", isCorrect: true },
          { text: "Nấu ăn phụ giúp gia đình", isCorrect: false }
        ],
        explanation: "Bài đọc nêu rõ: '在房间里自学汉字、看报纸' (ở trong phòng tự học chữ Hán, đọc báo)."
      },
      {
        question: "Buổi chiều hai anh em đã đi đâu?",
        options: [
          { text: "Đến trường học nghe giảng", isCorrect: false },
          { text: "Đến cửa hàng mua hoa quả tươi sau khi mưa tạnh", isCorrect: true },
          { text: "Đi xem phim ở trung tâm thành phố", isCorrect: false }
        ],
        explanation: "Đoạn văn viết: '下午雨停了，我和妹妹去商店买了一些新鲜的水果' (Chiều mưa tạnh, tôi và em gái đi cửa hàng mua trái cây tươi)."
      }
    ]
  },
  {
    id: "r27",
    level: 2,
    titleSimplified: "怎么去火车站？",
    titleTraditional: "怎麼去火車站？",
    pinyinTitle: "Zěnme qù huǒchēzhàn?",
    translationTitle: "Đi trạm tàu hỏa thế nào?",
    contentSimplified: "A: 请问，去火车站怎么走？离这里远吗？\nB: 火车站离这里不远，大概有两公里。你可以坐公共汽车去，也可以走路去。\nA: 坐公共汽车要多长时间？\nB: 只要十分钟。你走过前面那条街，就可以看到公共汽车站了。\nA: 好的，非常感谢你！\nB: 不客气。",
    contentTraditional: "A: 請問，去火車站怎麼走？離這裡遠嗎？\nB: 火車站離這裡不遠，大概有兩公里。你可以坐公共汽車去，也可以走路去。\nA: 坐公共汽車要多長時間？\nB: 只要十分鐘。你走過前面那條街，就可以看到公共汽車站了。\nA: 好的，非常感謝你！\nB: 不客氣。",
    pinyinText: "A: Qǐngwèn, qù huǒchēzhàn zěnme zǒu? Lí zhèlǐ yuǎn ma?\nB: Huǒchēzhàn lí zhèlǐ bù yuǎn, dàgài yǒu liǎng gōnglǐ. Nǐ kěyǐ zuò gōnggòng qìchē qù, yě kěyǐ zǒulù qù.\nA: Zuò gōnggòng qìchē yào duō cháng shíjiān?\nB: Zhǐyào shí fēnzhōng. Nǐ zǒu guò qiánmiàn nà tiáo jiē, jiù kěyǐ kàndào gōnggòng qìchēzhàn le.\nA: Hǎo de, fēicháng gǎnxiè nǐ!\nB: Bú kèqi.",
    translationText: "A: Xin hỏi, đi đến ga tàu hỏa đi thế nào? Cách đây xa không?\nB: Ga tàu hỏa cách đây không xa, khoảng chừng hai cây số. Bạn có thể đi xe buýt, cũng có thể đi bộ đi.\nA: Đi xe buýt mất bao lâu?\nB: Chỉ cần mười phút. Bạn đi qua con phố phía trước kia là có thể nhìn thấy trạm xe buýt rồi.\nA: Vâng, vô cùng cảm ơn bạn!\nB: Không có chi.",
    vocabulary: [
      { simplified: "怎么走", traditional: "怎麼走", pinyin: "zěnme zǒu", meaning: "Đi thế nào" },
      { simplified: "离", traditional: "離", pinyin: "lí", meaning: "Cách" },
      { simplified: "公共汽车", traditional: "公共汽車", pinyin: "gōnggòng qìchē", meaning: "Xe buýt" },
      { simplified: "公里", traditional: "公里", pinyin: "gōnglǐ", meaning: "Km, cây số" },
      { simplified: "街", traditional: "街", pinyin: "jiē", meaning: "Con phố, đường phố" },
      { simplified: "十分钟", traditional: "十分鐘", pinyin: "shí fēnzhōng", meaning: "Mười phút" }
    ],
    quizzes: [
      {
        question: "Ga tàu hỏa cách vị trí hiện tại bao xa?",
        options: [
          { text: "Khoảng hai cây số (两公里)", isCorrect: true },
          { text: "Khoảng mười cây số (十公里)", isCorrect: false },
          { text: "Rất xa, phải đi bằng máy bay", isCorrect: false }
        ],
        explanation: "B nói: '火车站离这里不远，大概有两公里' (Ga tàu hỏa cách đây không xa, khoảng 2 cây số)."
      },
      {
        question: "Muốn bắt xe buýt thì A phải làm thế nào?",
        options: [
          { text: "Chờ tại chỗ có nhân viên xe ôm chỉ đường", isCorrect: false },
          { text: "Đi qua con phố phía trước để tới trạm xe buýt", isCorrect: true },
          { text: "Phải mua vé trực tuyến trước trên điện thoại", isCorrect: false }
        ],
        explanation: "B chỉ dẫn: '你走过前面那条街，就可以看到公共汽车站了' (Bạn đi qua con phố phía trước kia là thấy trạm xe buýt)."
      }
    ]
  },
  {
    id: "r28",
    level: 2,
    titleSimplified: "准备明天的考试",
    titleTraditional: "準備明天的考試",
    pinyinTitle: "Zhǔnbèi míngtiān de kǎoshì",
    translationTitle: "Chuẩn bị cho kỳ thi ngày mai",
    contentSimplified: "明天早上我们有一场非常重要的汉语考试。为了做好准备，今天我和同学们在图书馆复习了五个小时。我们多听了课文录音，也多写了生字。老师对我们说：“别太紧张，今天晚上早点睡觉，明天加油！”",
    contentTraditional: "明天早上我們有一場非常重要的漢語考試。為了做好準備，今天我和同學們在圖書館複習了五個小時。我們多聽了課文錄音，也多寫了生字。老師對我們說：“別太緊張，今天晚上早點睡覺，明天加油！”",
    pinyinText: "Míngtiān zǎoshang wǒmen yǒu yì chǎng fēicháng zhòngyào de Hànyǔ kǎoshì. Wèile zuò hǎo zhǔnbèi, jīntiān wǒ hé tóngxuémen zài túshūguǎn fùxí le wǔ ge xiǎoshí. Wǒmen duō tīng le kèwén lùyīn, yě duō xiě le shēngzì. Lǎoshī duì wǒmen shuō: 'Bié tài jǐnzhāng, jīntiān wǎnshang zǎodiǎn shuìjiào, míngtiān jiāyóu!'",
    translationText: "Sáng mai chúng tôi có một kỳ thi tiếng Trung vô cùng quan trọng. Để chuẩn bị tốt, hôm nay tôi và các bạn cùng lớp đã ôn tập ở thư viện suốt năm tiếng đồng hồ. Chúng tôi nghe băng bài khóa nhiều hơn, cũng tập viết từ mới nhiều hơn. Thầy giáo nói với chúng tôi: 'Đừng quá căng thẳng, tối nay hãy ngủ sớm một chút, ngày mai cố lên!'",
    vocabulary: [
      { simplified: "考试", traditional: "考試", pinyin: "kǎoshì", meaning: "Kỳ thi, thi cử" },
      { simplified: "重要", traditional: "重要", pinyin: "zhòngyào", meaning: "Quan trọng" },
      { simplified: "复习", traditional: "複習", pinyin: "fùxí", meaning: "Ôn tập" },
      { simplified: "录音", traditional: "錄音", pinyin: "lùyīn", meaning: "Ghi âm, băng ghi âm" },
      { simplified: "紧张", traditional: "緊張", pinyin: "jǐnzhāng", meaning: "Căng thẳng, hồi hộp" },
      { simplified: "加油", traditional: "加油", pinyin: "jiāyóu", meaning: "Cố lên, thêm dầu" }
    ],
    quizzes: [
      {
        question: "Cả nhóm đã chuẩn bị cho kỳ thi như thế nào?",
        options: [
          { text: "Ở nhà học bài một mình cả tối", isCorrect: false },
          { text: "Học cùng nhau ở thư viện trong 5 tiếng", isCorrect: true },
          { text: "Đi mua điện thoại mới để xả stress", isCorrect: false }
        ],
        explanation: "Bài khóa viết: '今天我和同学们在图书馆复习了五个小时' (hôm nay tôi và các bạn đã ôn tập ở thư viện 5 tiếng)."
      },
      {
        question: "Thầy giáo đã khuyên học sinh điều gì vào tối nay?",
        options: [
          { text: "Học thâu đêm suốt sáng không được ngủ", isCorrect: false },
          { text: "Đừng căng thẳng và đi ngủ sớm giữ sức khỏe", isCorrect: true },
          { text: "Tự học thêm nhiều từ khó ở trình độ cao hơn", isCorrect: false }
        ],
        explanation: "Lời khuyên của thầy: '别太紧张，今天晚上早点睡觉，明天加油！' (Đừng quá căng thẳng, tối nay ngủ sớm chút, ngày mai cố lên!)."
      }
    ]
  },

  // --- LEVEL 3 (HSK 3 / TOCFL 3) ---
  {
    id: "r29",
    level: 3,
    titleSimplified: "搬新家与邻居",
    titleTraditional: "搬新家與鄰居",
    pinyinTitle: "Bān xīn jiā yǔ línjū",
    translationTitle: "Chuyển nhà mới và hàng xóm",
    contentSimplified: "上个周末，我们全家搬到了一个新的小区。这里绿化非常好，空气很新鲜，环境也非常安静。下午，住在隔壁的邻居主动来敲门，送给我们一些他们自己烤的新鲜面包。我们非常感动，也送给他们一盒绿茶，新生活有了一个很好的开始。",
    contentTraditional: "上個週末，我們全家搬到了一個新的小區。這裡綠化非常好，空氣很新鮮，環境也非常安靜。下午，住在隔壁的鄰居主動來敲門，送給我們一些他們自己烤的新鮮麵包。我們非常感動，也送給他們一盒綠茶，新生活有了一個很好的開始。",
    pinyinText: "Shàng ge zhōumò, wǒmen quánjiā bān dào le yí gè xīn de xiǎoqū. Zhèlǐ lǜhuà fēicháng hǎo, kōngqì hěn xīnxian, huánjìng yě fēicháng ānjìng. Xiàwǔ, zhù zài gébì de línjū zhǔdòng lái qiāo mén, sòng gěi wǒmen yìxiē tāmen zìjǐ kǎo de xīnxian miànbāo. Wǒmen fēicháng gǎndòng, yě sòng gěi tāmen yì hé lǜchá, xīn shēnghuó yǒu le yí gè hěn hǎo de kāishǐ.",
    translationText: "Cuối tuần trước, cả nhà chúng tôi đã chuyển đến một khu chung cư mới. Độ phủ xanh ở đây rất tốt, không khí trong lành, môi trường cũng vô cùng yên tĩnh. Buổi chiều, người hàng xóm sống ở ngay sát vách đã chủ động đến gõ cửa, tặng chúng tôi một số chiếc bánh mì tươi do chính tay họ nướng. Chúng tôi rất cảm động, cũng tặng lại họ một hộp trà xanh, cuộc sống mới đã có một khởi đầu rất tốt đẹp.",
    vocabulary: [
      { simplified: "搬家", traditional: "搬家", pinyin: "bān jiā", meaning: "Chuyển nhà" },
      { simplified: "小区", traditional: "小區", pinyin: "xiǎoqū", meaning: "Khu dân cư, chung cư" },
      { simplified: "邻居", traditional: "鄰居", pinyin: "línjū", meaning: "Hàng xóm" },
      { simplified: "主动", traditional: "主動", pinyin: "zhǔdòng", meaning: "Chủ động" },
      { simplified: "面包", traditional: "麵包", pinyin: "miànbāo", meaning: "Bánh mì" },
      { simplified: "绿茶", traditional: "綠茶", pinyin: "lǜchá", meaning: "Trà xanh" }
    ],
    quizzes: [
      {
        question: "Khu dân cư mới của nhân vật chính có đặc điểm gì?",
        options: [
          { text: "Rất ồn ào và ô nhiễm không khí nặng", isCorrect: false },
          { text: "Cây xanh tốt, không khí trong lành và yên tĩnh", isCorrect: true },
          { text: "Giao thông bất tiện, xa trung tâm", isCorrect: false }
        ],
        explanation: "Bài viết tả: '这里绿化非常好，空气很新鲜，环境也非常安静' (Cây xanh tốt, không khí trong lành, môi trường rất yên tĩnh)."
      },
      {
        question: "Gia đình nhân vật chính đã phản hồi lại quà tặng của hàng xóm thế nào?",
        options: [
          { text: "Tặng lại họ một hộp trà xanh (一盒绿茶)", isCorrect: true },
          { text: "Mời hàng xóm sang nhà ăn cơm tối", isCorrect: false },
          { text: "Đóng cửa lại và không nhận quà", isCorrect: false }
        ],
        explanation: "Bài khóa viết: '也送给他们一盒绿茶' (cũng tặng lại họ một hộp trà xanh)."
      }
    ]
  },
  {
    id: "r30",
    level: 3,
    titleSimplified: "如果明天下雨",
    titleTraditional: "如果明天下雨",
    pinyinTitle: "Rúguǒ míngtiān xiàyǔ",
    translationTitle: "Nếu ngày mai trời mưa",
    contentSimplified: "A: 我们明天去爬山吧，票我都买好了。\nB: 可是天气预报说明天有大雨。如果明天下雨，你有什么计划？\nA: 如果下雨，我们就去市中心的图书馆看书，或者去电影院看新电影。\nB: 这个主意不错！不管是爬山还是看电影，我都愿意陪你一起去。\nA: 太好了，那我们明天早上八点联系。",
    contentTraditional: "A: 我們明天去爬山吧，票我都買好了。\nB: 可是天氣預報說明天有大雨。如果明天下雨，你有什麼計劃？\nA: 如果下雨，我們就去市中心的圖書館看書，或者去電影院看新電影。\nB: 這個主意不錯！不管是爬山還是看電影，我都願意陪你一起去。\nA: 太好了，那我們明天早上八點聯繫。",
    pinyinText: "A: Wǒmen míngtiān qù páshān ba, piào wǒ dōu mǎi hǎo le.\nB: Kěshì tiānqì yùbào shuō míngtiān yǒu dàyǔ. Rúguǒ míngtiān xiàyǔ, nǐ yǒu shénme jìhuà?\nA: Rúguǒ xiàyǔ, wǒmen jiù qù shìzhōngxīn de túshūguǎn kànshū, huòzhě qù diànyǐngyuàn kàn xīn diànyǐng.\nB: Zhège zhǔyì búcuò! Bùguǎn shì páshān háishì kàn diànyǐng, wǒ dōu yuànyì péi nǐ yìqǐ qù.\nA: Tài hǎo le, nà wǒmen míngtiān zǎoshang bā diǎn liánxì.",
    translationText: "A: Sáng mai chúng ta đi leo núi đi, vé tôi đều mua sẵn rồi.\nB: Nhưng dự báo thời tiết nói ngày mai có mưa to. Nếu ngày mai trời mưa, bạn có kế hoạch gì không?\nA: Nếu trời mưa, chúng ta sẽ đến thư viện ở trung tâm thành phố đọc sách, hoặc đến rạp chiếu phim xem bộ phim mới.\nB: Ý kiến này không tồi! Cho dù là leo núi hay xem phim, tôi đều sẵn lòng đi cùng bạn.\nA: Tuyệt quá, vậy sáng mai tám giờ chúng ta liên lạc nhé.",
    vocabulary: [
      { simplified: "爬山", traditional: "爬山", pinyin: "páshān", meaning: "Leo núi" },
      { simplified: "天气预报", traditional: "天氣預報", pinyin: "tiānqì yùbào", meaning: "Dự báo thời tiết" },
      { simplified: "计划", traditional: "計劃", pinyin: "jìhuà", meaning: "Kế hoạch" },
      { simplified: "主意", traditional: "主意", pinyin: "zhǔyì", meaning: "Ý kiến, chủ ý" },
      { simplified: "不管", traditional: "不管", pinyin: "bùguǎn", meaning: "Cho dù, bất kể" },
      { simplified: "联系", traditional: "聯繫", pinyin: "liánxì", meaning: "Liên lạc" }
    ],
    quizzes: [
      {
        question: "Ý kiến của nhân vật A khi gặp trường hợp trời mưa là gì?",
        options: [
          { text: "Vẫn kiên quyết leo núi dưới mưa", isCorrect: false },
          { text: "Đi thư viện trung tâm đọc sách hoặc rạp chiếu phim xem phim", isCorrect: true },
          { text: "Ở nhà ngủ và hủy bỏ mọi liên lạc", isCorrect: false }
        ],
        explanation: "A chia sẻ: '如果下雨，我们就去市中心的图书馆看书，或者去电影院看新电影' (Nếu mưa, chúng ta sẽ đến thư viện trung tâm đọc sách hoặc rạp chiếu phim xem phim mới)."
      },
      {
        question: "Nhân vật B biểu thị thái độ như thế nào đối với các phương án của A?",
        options: [
          { text: "B phàn nàn và từ chối đi cùng", isCorrect: false },
          { text: "B sẵn lòng đồng hành cùng A dù là leo núi hay đi chơi trong nhà", isCorrect: true },
          { text: "B yêu cầu A tự đi một mình", isCorrect: false }
        ],
        explanation: "B khẳng định: '不管是爬山还是看电影，我都愿意陪你一起去' (Cho dù leo núi hay xem phim, tôi đều sẵn lòng đi cùng bạn)."
      }
    ]
  },
  {
    id: "r31",
    level: 3,
    titleSimplified: "健康好习惯",
    titleTraditional: "健康好習慣",
    pinyinTitle: "Jiànkāng hǎo xíguàn",
    translationTitle: "Thói quen tốt cho sức khỏe",
    contentSimplified: "现代人的生活节奏很快，工作压力也很大，因此保持身体健康非常重要。首先，我们每天必须喝足够的水，多吃新鲜的蔬菜和水果。其次，要养成坚持锻炼的习惯，比如跑步或者游泳。最后，保证充足的睡眠和轻松愉快的心情，也是保持健康的秘诀。",
    contentTraditional: "現代人的生活節奏很快，工作壓力也很大，因此保持身體健康非常重要。首先，我們每天必須喝足夠的水，多吃新鮮的蔬菜和水果。其次，要養成堅持鍛煉的習慣，比如跑步或者游泳。最後，保證充足的睡眠和輕鬆愉快的心情，也是保持健康的秘訣。",
    pinyinText: "Xiàndàirén de shēnghuó jiézòu hěn kuài, gōngzuò yālì yě hěn dà, yīncǐ bǎochí shēntǐ jiànkāng fēicháng zhòngyào. Shǒuxiān, wǒmen měitiān bìxū hē zúgòu de shuǐ, duō chī xīnxian de shūcài hé shuǐguǒ. Qícì, yào yǎngchéng jiānchí duànliàn de xíguàn, bǐrú pǎobù huòzhě yóuyǒng. Zuìhòu, bǎozhèng chōngzú de shuìmian hé qīngsōng yúkuài de xīnqíng, yě shì bǎochí jiànkāng de mìjué.",
    translationText: "Nhịp sống của con người hiện đại rất nhanh, áp lực công việc cũng rất lớn, do đó việc duy trì sức khỏe cơ thể vô cùng quan trọng. Trước hết, chúng ta mỗi ngày phải uống đủ nước, ăn nhiều rau quả và trái cây tươi. Thứ hai, cần hình thành thói quen kiên trì rèn luyện, ví dụ như chạy bộ hoặc bơi lội. Cuối cùng, bảo đảm giấc ngủ đầy đủ và tâm trạng thư thái, vui vẻ cũng là bí quyết để duy trì sức khỏe.",
    vocabulary: [
      { simplified: "节奏", traditional: "節奏", pinyin: "jiézòu", meaning: "Nhịp điệu, nhịp sống" },
      { simplified: "保持", traditional: "保持", pinyin: "bǎochí", meaning: "Duy trì, giữ gìn" },
      { simplified: "蔬菜", traditional: "蔬菜", pinyin: "shūcài", meaning: "Rau xanh, rau quả" },
      { simplified: "锻炼", traditional: "鍛煉", pinyin: "duànliàn", meaning: "Rèn luyện, tập luyện" },
      { simplified: "睡眠", traditional: "睡眠", pinyin: "shuìmian", meaning: "Giấc ngủ" },
      { simplified: "秘诀", traditional: "秘訣", pinyin: "mìjué", meaning: "Bí quyết" }
    ],
    quizzes: [
      {
        question: "Theo bài viết, người hiện đại gặp phải vấn đề gì?",
        options: [
          { text: "Có quá nhiều thời gian rảnh rỗi ở nhà", isCorrect: false },
          { text: "Nhịp sống diễn ra rất nhanh và áp lực công việc lớn", isCorrect: true },
          { text: "Không có thực phẩm tươi ngon để mua sắm", isCorrect: false }
        ],
        explanation: "Đoạn văn mở đầu: '现代人的生活节奏很快，工作压力也很大' (Nhịp sống của con người hiện đại rất nhanh, áp lực công việc cũng rất lớn)."
      },
      {
        question: "Đâu là một trong các bí quyết giữ gìn sức khỏe được nhắc tới cuối bài?",
        options: [
          { text: "Làm việc thâu đêm suốt sáng để tăng thu nhập", isCorrect: false },
          { text: "Bảo đảm ngủ đủ giấc và duy trì tâm trạng vui vẻ thoải mái", isCorrect: true },
          { text: "Uống nước ngọt thay cho nước lọc hàng ngày", isCorrect: false }
        ],
        explanation: "Đoạn cuối viết: '保证充足的睡眠和轻松愉快的心情，也是保持健康的秘诀' (Bảo đảm giấc ngủ đầy đủ và tâm trạng thư thái, vui vẻ cũng là bí quyết để giữ gìn sức khỏe)."
      }
    ]
  },

  // --- LEVEL 4 (HSK 4 / TOCFL 4) ---
  {
    id: "r32",
    level: 4,
    titleSimplified: "保护环境与垃圾分类",
    titleTraditional: "保護環境與垃圾分類",
    pinyinTitle: "Bǎohù huánjìng yǔ lājī fēnlèi",
    translationTitle: "Bảo vệ môi trường và phân loại rác",
    contentSimplified: "随着城市化进程加快，垃圾处理成为了一个严重的问题。为了保护环境，许多城市开始推行垃圾分类政策。垃圾分类不仅能减少污染，还能让许多废弃物得到循环利用。我们每个人都应该从身边的小事做起，养成垃圾分类的好习惯，为城市的可持续发展贡献一份力量。",
    contentTraditional: "隨著城市化進程加快，垃圾處理成爲了一個嚴重的問題。為了保護環境，許多城市開始推行垃圾分類政策。垃圾分類不僅能減少污染，還能讓許多廢棄物得到循環利用。我們每個人都應該從身邊的小事做起，養成垃圾分類的好習慣，為城市的可持續發展貢獻一份力量。",
    pinyinText: "Suízhe chéngshìhuà jìnchéng jiākuài, lājī chǔlǐ chéngwéi le yí gè yánzhòng de wèntǐ. Wèile bǎohù huánjìng, xǔduō chéngshì kāishǐ tuīxíng lājī fēnlèi zhèngcè. Lājī fēnlèi bùjǐn néng jiǎnshǎo wūrǎn, hái néng ràng xǔduō fèiqìwù dédào xúnhuán lìyòng. Wǒmen měi gè rén dōu yīnggāi cóng shēnbiān de xiǎoshì zuò qǐ, yǎngchéng lājī fēnlèi de hǎo xíguàn, wèi chéngshì de kěchíxù fāzhǎn gòngxiàn yí fèn lìliàng.",
    translationText: "Cùng với tiến trình đô thị hóa gia tăng, xử lý rác thải đã trở thành một vấn đề nghiêm trọng. Để bảo vệ môi trường, nhiều thành phố đã bắt đầu thực hiện chính sách phân loại rác. Phân loại rác không chỉ giảm thiểu ô nhiễm mà còn giúp nhiều phế thải được tuần hoàn sử dụng. Mỗi người chúng ta đều nên bắt đầu từ những việc nhỏ xung quanh mình, hình thành thói quen tốt phân loại rác, đóng góp một phần sức lực cho sự phát triển bền vững của thành phố.",
    vocabulary: [
      { simplified: "进程", traditional: "進程", pinyin: "jìnchéng", meaning: "Tiến trình, quá trình" },
      { simplified: "垃圾分类", traditional: "垃圾分類", pinyin: "lājī fēnlèi", meaning: "Phân loại rác" },
      { simplified: "污染", traditional: "污染", pinyin: "wūrǎn", meaning: "Ô nhiễm" },
      { simplified: "循环利用", traditional: "循環利用", pinyin: "xúnhuán lìyòng", meaning: "Tuần hoàn sử dụng, tái chế" },
      { simplified: "可持续", traditional: "可持續", pinyin: "kěchíxù", meaning: "Bền vững" },
      { simplified: "贡献", traditional: "貢獻", pinyin: "gòngxiàn", meaning: "Cống hiến, đóng góp" }
    ],
    quizzes: [
      {
        question: "Biện pháp nào được nhắc tới để giải quyết vấn đề rác thải đô thị?",
        options: [
          { text: "Thu phí vứt rác thật cao đối với người dân", isCorrect: false },
          { text: "Thực hiện chính sách phân loại rác tại các thành phố", isCorrect: true },
          { text: "Cấm tuyệt đối mọi hoạt động xả thải của nhà máy", isCorrect: false }
        ],
        explanation: "Bài viết nêu rõ: '为了保护环境，许多城市开始推行垃圾分类政策' (Để bảo vệ môi trường, nhiều thành phố bắt đầu thực hiện chính sách phân loại rác)."
      },
      {
        question: "Lợi ích nổi bật nhất của việc phân loại rác thải là gì?",
        options: [
          { text: "Giúp giảm thiểu ô nhiễm và đưa phế thải vào tái chế tuần hoàn", isCorrect: true },
          { text: "Làm cho đường phố trông rộng rãi, thênh thang hơn", isCorrect: false },
          { text: "Tạo nguồn thu nhập trực tiếp cực cao cho người dân", isCorrect: false }
        ],
        explanation: "Đoạn văn viết: '垃圾分类不仅能减少污染，还能让许多废弃物得到循环利用' (Phân loại rác không chỉ giảm ô nhiễm mà còn giúp phế thải được tuần hoàn sử dụng)."
      }
    ]
  },
  {
    id: "r33",
    level: 4,
    titleSimplified: "旅行的真正意义",
    titleTraditional: "旅行的真正意義",
    pinyinTitle: "Lǚxíng de zhēnzhèng yìyì",
    translationTitle: "Ý nghĩa thực sự của du lịch",
    contentSimplified: "现在，越来越多的人选择在假期出门旅行。然而，旅行的真正意义不仅在于去著名的景点拍照打卡，更在于体验当地的生活，了解不同的历史与文化。通过旅行，我们可以跳出现有的生活圈子，开阔眼界，并学会以更加包容的心态去面对世界。",
    contentTraditional: "現在，越來越多的人選擇在假期出門旅行。然而，旅行的真正意義不僅在於去著名的景點拍照打卡，更在於體驗當地的生活，了解不同的歷史與文化。通過旅行，我們可以跳出現有的生活圈子，開闊眼界，並學會以更加包容的心態去面對世界。",
    pinyinText: "Xiànzài, yuèláiyuè duō de rén xuǎnzé zài jiàqī chūmén lǚxíng. Rán'ér, lǚxíng de zhēnzhèng yìyì bùjǐn zàiyú qù zhùmíng de jǐngdiǎn pāizhào dǎkǎ, gèng zàiyú tǐyàn dāngdì de shēnghuó, liǎojiě bùtóng de lìshǐ yǔ wénhuà. Tōngguò lǚxíng, wǒmen kěyǐ tiào chū xiànyǒu de shēnghuó quānzi, kāikuò yǎnjiè, bìng xuéhuì yǐ gèngjiā bāoróng de xīntài qù miànduì shìjiè.",
    translationText: "Hiện nay ngày càng có nhiều người lựa chọn đi du lịch vào các kỳ nghỉ. Thế nhưng, ý nghĩa thực sự của du lịch không chỉ nằm ở việc đến những địa điểm nổi tiếng chụp ảnh check-in, mà hơn hết là ở chỗ trải nghiệm cuộc sống bản địa, tìm hiểu lịch sử và văn hóa khác nhau. Thông qua du lịch, chúng ta có thể nhảy ra khỏi vòng tròn cuộc sống hiện tại, mở rộng tầm mắt, và học cách đối mặt với thế giới bằng một tâm thế bao dung hơn.",
    vocabulary: [
      { simplified: "意义", traditional: "意義", pinyin: "yìyì", meaning: "Ý nghĩa" },
      { simplified: "打卡", traditional: "打卡", pinyin: "dǎkǎ", meaning: "Check-in, điểm danh" },
      { simplified: "体验", traditional: "體驗", pinyin: "tǐyàn", meaning: "Trải nghiệm" },
      { simplified: "圈子", traditional: "圈子", pinyin: "quānzi", meaning: "Vòng tròn, phạm vi" },
      { simplified: "开阔眼界", traditional: "開闊眼界", pinyin: "kāikuò yǎnjiè", meaning: "Mở rộng tầm mắt" },
      { simplified: "包容", traditional: "包容", pinyin: "bāoróng", meaning: "Bao dung, dung nạp" }
    ],
    quizzes: [
      {
        question: "Theo quan điểm của bài viết, ý nghĩa thực sự của du lịch là gì?",
        options: [
          { text: "Đi check-in chụp thật nhiều ảnh đẹp đăng mạng xã hội", isCorrect: false },
          { text: "Trải nghiệm cuộc sống, tìm hiểu lịch sử và văn hóa bản địa", isCorrect: true },
          { text: "Tìm kiếm các món đồ hiệu giá rẻ để mua sắm", isCorrect: false }
        ],
        explanation: "Bài viết chỉ rõ: '旅行的真正意义... 更在于体验当地的生活，了解不同的历史与文化' (Ý nghĩa thực sự của du lịch... hơn hết là trải nghiệm cuộc sống, tìm hiểu lịch sử và văn hóa bản địa)."
      },
      {
        question: "Du lịch giúp ích gì cho nhận thức và tâm lý của con người?",
        options: [
          { text: "Giúp chúng ta kiếm thêm nhiều cơ hội kinh doanh tại chỗ", isCorrect: false },
          { text: "Giúp mở rộng tầm mắt, rèn luyện thái độ bao dung hơn với thế giới", isCorrect: true },
          { text: "Làm cho chúng ta không còn muốn quay trở về quê hương nữa", isCorrect: false }
        ],
        explanation: "Văn bản nêu: '开阔眼界，并学会以更加包容的心态去面对世界' (mở rộng tầm mắt, học cách đối mặt thế giới bằng tâm thế bao dung hơn)."
      }
    ]
  },
  {
    id: "r34",
    level: 4,
    titleSimplified: "如何缓解工作压力？",
    titleTraditional: "如何緩解工作壓力？",
    pinyinTitle: "Rúhé huǎnjiě gōngzuò yālì?",
    translationTitle: "Làm thế nào để giảm bớt áp lực công việc?",
    contentSimplified: "面对激烈的职场竞争，许多上班族都感到压力巨大。长期处于高压状态会损害身体健康，因此学会缓解压力至关重要。我们可以通过定期运动来释放负面情绪，或者在周末与朋友聚会聊天。此外合理安排时间、避免拖延，也能有效减轻工作带来的焦虑感。",
    contentTraditional: "面對激烈的職場競爭，許多上班族都感到壓力巨大。長期處於高壓狀態會損害身體健康，因此學會緩解壓力至關重要。我們可以通過定期運動來釋放負面情緒，或者在週末與朋友聚會聊天。此外合理安排時間、避免拖延，也能有效減輕工作帶來的焦慮感。",
    pinyinText: "Miànduì jīliè de zhíchǎng jìngzhēng, xǔduō shàngbānzú dōu gǎndào yālì jùdà. Chángqī chǔyú gāoyā zhuàngtài huì sǔnhài shēntǐ jiànkāng, yīncǐ xuéhuì huǎnjiě yālì zhìguān zhòngyào. Wǒmen kěyǐ tōngguò dìngqī yùndòng lái shìfàng fùmiàn qíngxù, huòzhě zài zhōumò yǔ péngyou jùhuì liáotiān. Cǐwài, hélǐ ānpái shíjiān, bìmiǎn tuōyán, yě néng yǒuxiào jiǎnqīng gōngzuò dài lái de jiāolǜgǎn.",
    translationText: "Đối mặt với sự cạnh tranh khốc liệt nơi công sở, nhiều nhân viên văn phòng đều cảm thấy áp lực to lớn. Việc nằm trong trạng thái áp lực cao kéo dài sẽ tổn hại đến sức khỏe, vì thế học cách giảm bớt áp lực là cực kỳ quan trọng. Chúng ta có thể thông qua vận động định kỳ để giải phóng cảm xúc tiêu cực, hoặc tụ tập trò chuyện cùng bạn bè vào cuối tuần. Ngoài ra, sắp xếp thời gian hợp lý và tránh trì hoãn cũng có thể giảm bớt cảm giác lo âu do công việc mang lại một cách hiệu quả.",
    vocabulary: [
      { simplified: "竞争", traditional: "競爭", pinyin: "jìngzhēng", meaning: "Cạnh tranh" },
      { simplified: "缓解", traditional: "緩解", pinyin: "huǎnjiě", meaning: "Làm dịu, giảm bớt" },
      { simplified: "释放", traditional: "釋放", pinyin: "shìfàng", meaning: "Giải phóng, giải tỏa" },
      { simplified: "拖延", traditional: "拖延", pinyin: "tuōyán", meaning: "Trì hoãn" },
      { simplified: "焦虑", traditional: "焦慮", pinyin: "jiāolǜ", meaning: "Lo âu, lo lắng" },
      { simplified: "聚会", traditional: "聚會", pinyin: "jùhuì", meaning: "Tụ tập, tụ hội" }
    ],
    quizzes: [
      {
        question: "Tác hại của việc chịu áp lực công việc cao kéo dài là gì?",
        options: [
          { text: "Gây tổn hại trực tiếp đến sức khỏe cơ thể (损害身体健康)", isCorrect: true },
          { text: "Giúp đạt được sự thăng tiến công sở nhanh hơn", isCorrect: false },
          { text: "Làm tăng năng suất lao động vượt mức", isCorrect: false }
        ],
        explanation: "Bài khóa viết: '长期处于高压状态会损害身体健康' (Trạng thái áp lực cao kéo dài sẽ tổn hại đến sức khỏe)."
      },
      {
        question: "Biện pháp tự kiểm soát công việc nào được nhắc tới để giảm lo âu?",
        options: [
          { text: "Thực hiện làm thêm giờ thâu đêm", isCorrect: false },
          { text: "Sắp xếp thời gian hợp lý và tránh thói quen trì hoãn", isCorrect: true },
          { text: "Bỏ bê mọi nhiệm vụ dự án để đi chơi", isCorrect: false }
        ],
        explanation: "Đoạn cuối khuyên: '合理安排时间、避免拖延，也能有效减轻工作带来的焦虑感' (sắp xếp thời gian hợp lý, tránh trì hoãn cũng giảm hiệu quả lo âu)."
      }
    ]
  },

  // --- LEVEL 5 (HSK 5 / TOCFL 5) ---
  {
    id: "r35",
    level: 5,
    titleSimplified: "商业谈判与合同签署",
    titleTraditional: "商業談判與合同簽署",
    pinyinTitle: "Shāngyè tánpàn yǔ hétóng qiānshǔ",
    translationTitle: "Đàm phán thương mại và ký kết hợp đồng",
    contentSimplified: "A: 关于这次合作项目的核心条款，贵公司是否还有其他意见？\nB: 我们对价格和交货时间没有异议，但希望在售后服务和技术支持方面增加保障条款。\nA: 这完全合理。为了达成双赢，我们可以在合同中补充相关细节。如果你们同意，我们今天下午就可以正式签署合作合同。\nB: 非常好！我们非常期待与贵方的深度合作，共同开拓新的市场。",
    contentTraditional: "A: 關於這次合作項目的核心條款，貴公司是否還有其他意見？\nB: 我們對價格和交貨時間沒有異議，但希望在售後服務和技術支持方面增加保障條款。\nA: 這完全合理。為了達成雙贏，我們可以在合同中補充相關細節。如果你們同意，我們今天下午就可以正式簽署合作合同。\nB: 非常好！我們非常期待與貴方的深度合作，共同開拓新的市場。",
    pinyinText: "A: Guānyú zhè cì hézuò xiàngmù de héxīn tiáokuǎn, guì gōngsī shìfǒu hái yǒu qítā yìjiàn?\nB: Wǒmen duì jiàgé hé jiāohuò shíjiān méiyǒu yìyì, dàn xīwàng zài shòuhòu fúwù hé jìshù zhīchí fāngmiàn zēngjiā bǎozhàng tiáokuǎn.\nA: Zhè wánquán hélǐ. Wèile dáchéng shuāngyíng, wǒmen kěyǐ zài hétóng zhōng bǔchōng xiāngguān xìjié. Rúguǒ nǐmen tóngyì, wǒmen jīntiān xiàwǔ jiù kěyǐ zhèngshì qiānshǔ hézuò hétóng.\nB: Fēicháng hǎo! Wǒmen fēicháng qītài yǔ guìfāng de shēndù hézuò, gòngtóng kāituò xīn de shìchǎng.",
    translationText: "A: Về các điều khoản cốt lõi của dự án hợp tác lần này, quý công ty có còn ý kiến nào khác không?\nB: Chúng tôi không có dị nghị về giá cả và thời gian giao hàng, nhưng hy vọng tăng thêm điều khoản bảo đảm ở khía cạnh dịch vụ sau bán hàng và hỗ trợ kỹ thuật.\nA: Điều này hoàn toàn hợp lý. Để đạt được đôi bên cùng có lợi, chúng ta có thể bổ sung các chi tiết liên quan vào hợp đồng. Nếu các vị đồng ý, chiều hôm nay chúng ta có thể chính thức ký kết hợp đồng hợp tác.\nB: Rất tốt! Chúng tôi rất mong chờ sự hợp tác sâu rộng với quý công ty, cùng nhau khai phá các thị trường mới.",
    vocabulary: [
      { simplified: "条款", traditional: "條款", pinyin: "tiáokuǎn", meaning: "Điều khoản" },
      { simplified: "异议", traditional: "異議", pinyin: "yìyì", meaning: "Dị nghị, phản đối" },
      { simplified: "售后服务", traditional: "售後服務", pinyin: "shòuhòu fúwù", meaning: "Dịch vụ sau bán hàng" },
      { simplified: "双赢", traditional: "雙贏", pinyin: "shuāngyíng", meaning: "Đôi bên cùng có lợi, win-win" },
      { simplified: "签署", traditional: "簽署", pinyin: "qiānshǔ", meaning: "Ký kết, ký tên" },
      { simplified: "开拓", traditional: "開拓", pinyin: "kāituò", meaning: "Khai phá, mở rộng" }
    ],
    quizzes: [
      {
        question: "Phía công ty B muốn bổ sung thêm điều khoản bảo vệ ở khía cạnh nào?",
        options: [
          { text: "Giá cả sản phẩm và chất lượng gia công", isCorrect: false },
          { text: "Dịch vụ sau bán hàng và hỗ trợ mặt kỹ thuật (售后服务和技术支持)", isCorrect: true },
          { text: "Thời gian giao hàng và phương thức vận chuyển", isCorrect: false }
        ],
        explanation: "B nói: '希望在售后服务和技术支持方面增加保障条款' (Hy vọng tăng thêm điều khoản bảo đảm ở khía cạnh dịch vụ sau bán hàng và hỗ trợ kỹ thuật)."
      },
      {
        question: "A và B thống nhất thời gian chính thức ký kết hợp đồng vào khi nào?",
        options: [
          { text: "Chiều ngày hôm nay (今天下午)", isCorrect: true },
          { text: "Đầu tuần sau sau khi kiểm toán lại", isCorrect: false },
          { text: "Cuối tháng sau tại hội nghị quốc tế", isCorrect: false }
        ],
        explanation: "A đề nghị: '我们今天下午就可以正式签署合作合同' (Chiều nay chúng ta có thể chính thức ký kết hợp đồng hợp tác) và B đồng tình."
      }
    ]
  },
  {
    id: "r36",
    level: 5,
    titleSimplified: "大学本科的价值与挑战",
    titleTraditional: "大學本科的價值與挑戰",
    pinyinTitle: "Dàxué běnkē de jiàzhí yǔ tiǎozhàn",
    translationTitle: "Giá trị và thử thách của đại học chính quy",
    contentSimplified: "接受大学本科教育，不仅是为了获取专业知识和一张毕业证书，更是为了培养独立思考和解决复杂问题的能力。在现代社会，随着科技的飞速发展，许多传统岗位正在消失。这要求本科生在学习期间不仅要打好理论基础，还要积极参与社会实践，提升跨学科学习与终身学习的能力，以应对未来的就业挑战。",
    contentTraditional: "接受大學本科教育，不僅是為了獲取專業知識和一張畢業證書，更是為了培養獨立思考和解決複雜問題的能力。在現代社會，隨著科技的飛速發展，許多傳統崗位正在消失。這要求本科生在學習期間不僅要打好理論基礎，還要積極參與社會實踐，提升跨學科學習與終身學習的能力，以應對未來的就業挑戰。",
    pinyinText: "Jiēshòu dàxué běnkē jiàoyù, bùjǐn -shì wèile huòqǔ zhuānyè zhīshi hé yì zhāng bìyè zhèngshū, gèng -shì wèile péiyǎng dúlì sīkǎo hé jiějué fùzá wèntǐ de nénglì. Zài xiàndài shèhuì, suízhe kējì de fēisù fāzhǎn, xǔduō chuántǒng gǎngwèi zhèngzài xiāoshī. Zhè yāoqiú běnkēshēng zài xuéxí qījiān bùjǐn yào dǎ hǎo lǐlùn jīchǔ, hái yào jījí cānyù shèhuì shíjiàn, tíshēng kuà xuékē xuéxí yǔ zhōngshēn xuéxí de nénglì, yǐ yìngduì wèilái de jiùyè tiǎozhàn.",
    translationText: "Tiếp nhận giáo dục đại học chính quy không chỉ để tích lũy kiến thức chuyên môn và một tấm bằng tốt nghiệp, mà quan trọng hơn là nuôi dưỡng năng lực tư duy độc lập và giải quyết các vấn đề phức tạp. Trong xã hội hiện đại, cùng với sự phát triển thần tốc của khoa học công nghệ, nhiều vị trí công việc truyền thống đang dần biến mất. Điều này yêu cầu sinh viên đại học trong thời gian học tập không chỉ đặt vững nền tảng lý thuyết, mà còn phải tích cực tham gia thực tiễn xã hội, nâng cao năng lực học tập liên ngành và học tập suốt đời để ứng phó với các thử thách việc làm trong tương lai.",
    vocabulary: [
      { simplified: "本科", traditional: "本科", pinyin: "běnkē", meaning: "Đại học chính quy, cử nhân" },
      { simplified: "独立思考", traditional: "獨立思考", pinyin: "dúlì sīkǎo", meaning: "Tư duy độc lập" },
      { simplified: "岗位", traditional: "崗位", pinyin: "gǎngwèi", meaning: "Vị trí công việc, cương vị" },
      { simplified: "理论基础", traditional: "理論基礎", pinyin: "lǐlùn jīchǔ", meaning: "Nền tảng lý thuyết" },
      { simplified: "跨学科", traditional: "跨學科", pinyin: "kuà xuékē", meaning: "Liên ngành, đa ngành" },
      { simplified: "终身学习", traditional: "終身學習", pinyin: "zhōngshēn xuéxí", meaning: "Học tập suốt đời" }
    ],
    quizzes: [
      {
        question: "Mục đích lớn nhất của việc tiếp nhận giáo dục đại học chính quy theo bài viết là gì?",
        options: [
          { text: "Để có được tấm bằng tốt nghiệp đi làm giàu nhanh chóng", isCorrect: false },
          { text: "Nuôi dưỡng năng lực tư duy độc lập và giải quyết vấn đề phức tạp", isCorrect: true },
          { text: "Học thuộc lòng toàn bộ giáo trình của tất cả các môn", isCorrect: false }
        ],
        explanation: "Văn bản nêu rõ: '更是为了培养独立思考和解决复杂问题的能力' (hơn hết là nuôi dưỡng tư duy độc lập và giải quyết vấn đề phức tạp)."
      },
      {
        question: "Trước thách thức công nghệ biến đổi nghề nghiệp, sinh viên cần tích lũy thêm gì?",
        options: [
          { text: "Lên kế hoạch đi du lịch khắp thế giới chụp ảnh sống ảo", isCorrect: false },
          { text: "Vững lý thuyết, thực hành thực tiễn xã hội, học liên ngành và học tập suốt đời", isCorrect: true },
          { text: "Chỉ tập trung lý thuyết và hạn chế tối đa tham gia hoạt động xã hội", isCorrect: false }
        ],
        explanation: "Bài viết khuyên: '打好理论基础，还要积极参与社会实践，提升跨学科学习与终身学习的能力' (vững lý thuyết, tích cực tham gia thực tiễn, nâng cao năng lực liên ngành và học suốt đời)."
      }
    ]
  },
  {
    id: "r37",
    level: 5,
    titleSimplified: "网络技术对传统博物馆的影响",
    titleTraditional: "網路技術對傳統博物館的影響",
    pinyinTitle: "Wǎngluò jìshù duì chuántǒng bówùguǎn de yǐngxiǎng",
    translationTitle: "Ảnh hưởng của công nghệ mạng đối với bảo tàng truyền thống",
    contentSimplified: "网络技术的发展极大地改变了传统博物馆的运营方式。通过数字展览和虚拟现实技术，观众足不出户就可以欣赏到世界各地的珍贵文物。这种数字化的传播方式打破了时间和空间的限制，吸引了更多年轻观众。然而，虚拟浏览无法完全替代现场参观的独特体验，真实的文物所蕴含的历史感和艺术魅力，依然需要观众亲临现场去感受。",
    contentTraditional: "網路技術的發展極大地改變了傳統博物館的運營方式。通過數字展覽和虛擬現實技術，觀眾足不出戶就可以欣賞到世界各地的珍貴文物。這種數位化的傳播方式打破了時間和空間的限制，吸引了更多年輕觀眾。然而，虛擬瀏覽無法完全替代現場參觀的獨特體驗，真實的文物所蘊含的历史感和藝術魅力，依然需要觀眾親臨現場去感受。",
    pinyinText: "Wǎngluò jìshù de fāzhǎn jídàde gǎibiàn le chuántǒng bówùguǎn de yùnyíng fāngshì. Tōngguò shùzì zhǎnlǎn hé xūnǐ xiànshí jìshù, guānzhòng zúbùchūhù jiù kěyǐ xīnshǎng dào shìjiè gèdì de zhēnguì wénwù. Zhèzhǒng shùzìhuà de chuánbō fāngshì dǎpò le shíjiān hé kōngjiān de xiànzhì, xīyǐn le gèng duō niánqīng guānzhòng. Rán'ér, xūnǐ liúlǎn wúfǎ wánquán tìdài xiànchǎng cānguān de dútè tǐyàn, zhēnshí de wénwù suǒ yùnhán de lìshǐgǎn hé yìshù mèilì, yīrán xūyào guānzhòng qīnlín xiànchǎng qù gǎnshòu.",
    translationText: "Sự phát triển của công nghệ mạng đã thay đổi sâu sắc phương thức vận hành của các bảo tàng truyền thống. Thông qua triển lãm số và công nghệ thực tế ảo, người xem không cần bước chân ra khỏi cửa cũng có thể thưởng thức các di vật quý hiếm từ khắp nơi trên thế giới. Phương thức truyền bá số hóa này phá vỡ ranh giới về thời gian và không gian, thu hút nhiều khán giả trẻ tuổi hơn. Thế nhưng, duyệt thế giới ảo không thể thay thế hoàn toàn trải nghiệm độc đáo khi tham quan trực tiếp tại hiện trường; cảm giác lịch sử và sức lôi cuốn nghệ thuật mà những di vật thực sự chứa đựng vẫn cần người xem trực tiếp đến tận nơi để cảm nhận.",
    vocabulary: [
      { simplified: "运营", traditional: "運營", pinyin: "yùnyíng", meaning: "Vận hành, kinh doanh" },
      { simplified: "虚拟现实", traditional: "虛擬現實", pinyin: "xūnǐ xiànshí", meaning: "Thực tế ảo, VR" },
      { simplified: "文物", traditional: "文物", pinyin: "wénwù", meaning: "Di vật, cổ vật" },
      { simplified: "数字化", traditional: "數位化", pinyin: "shùzìhuà", meaning: "Số hóa" },
      { simplified: "替代", traditional: "替代", pinyin: "tìdài", meaning: "Thay thế" },
      { simplified: "亲临现场", traditional: "親臨現場", pinyin: "qīnlín xiànchǎng", meaning: "Trực tiếp đến tận nơi" }
    ],
    quizzes: [
      {
        question: "Phương tiện kỹ thuật số nào giúp khán giả thưởng thức cổ vật không cần ra khỏi cửa?",
        options: [
          { text: "Các chương trình ca nhạc trực tuyến", isCorrect: false },
          { text: "Triển lãm số và công nghệ thực tế ảo VR (数字展览和虚拟现实技术)", isCorrect: true },
          { text: "Ứng dụng trò chuyện nhắn tin công sở", isCorrect: false }
        ],
        explanation: "Bài khóa viết: '通过数字展览和虚拟现实技术，观众足不出户就可以欣赏到世界各地的珍贵文物' (Thông qua triển lãm số và công nghệ thực tế ảo VR, khán giả ở nhà vẫn ngắm được di vật)."
      },
      {
        question: "Tại sao tham quan qua mạng không thể thay thế hoàn toàn việc đến bảo tàng thật?",
        options: [
          { text: "Vì các bức hình chụp qua mạng có chất lượng rất mờ", isCorrect: false },
          { text: "Vì sức hút nghệ thuật và cảm xúc lịch sử của di vật thật cần được cảm nhận trực tiếp", isCorrect: true },
          { text: "Vì xem qua mạng đòi hỏi máy tính cấu hình quá mạnh", isCorrect: false }
        ],
        explanation: "Bài khóa khẳng định: '真实的文物所蕴含的历史感和艺术魅力，依然需要观众亲临现场去感受' (di vật thật chứa đựng cảm giác lịch sử và mị lực nghệ thuật cần khán giả trực tiếp đến nơi để cảm thụ)."
      }
    ]
  },
  {
    id: "r38",
    level: 5,
    titleSimplified: "职场沟通的艺术",
    titleTraditional: "職場溝通的藝術",
    pinyinTitle: "Zhíchǎng gōutōng de yìshù",
    translationTitle: "Nghệ thuật giao tiếp công sở",
    contentSimplified: "优秀的职场沟通不仅是表达自己的想法，更是倾听别人的建议。在团队合作中，缺乏有效沟通往往会导致项目延期甚至发生冲突。为了建立高效的团队，我们应当推行“多方协调”和“主动沟通”的原则。当遇到不同意见时，应当保持冷静，通过坦诚对话找到共同点，以确保项目的顺利进行。",
    contentTraditional: "優秀的職場溝通不僅是表達自己的想法，更是傾聽別人的建議。在團隊合作中，缺乏有效溝通往往會導致項目延期甚至發生衝突。為了建立高效的團隊，我們應當推行“多方協調”和“主動溝通”的原則。當遇到不同意見時，應當保持冷靜，通過坦誠對話找到共同點，以確保項目的順利進行。",
    pinyinText: "Yōuxiù de zhíchǎng gōutōng bùjǐn -shì biǎodá zìjǐ de xiǎngfǎ, gèng -shì qīngtīng biérén de jiànyì. Zài tuánduì hézuò zhōng, quēfá yǒuxiào gōutōng wǎngwǎng huì dǎozhì xiàngmù yánqī shènzhì fāshēng chōngtū. Wèile jiànlì gāoxiào de tuánduì, wǒmen yīnggāi tuīxíng 'duōfāng xiétiáo' hé 'zhǔdòng gōutōng' de yuánzé. Dāng yùdào bùtóng yìjiàn shí, yīngdāng bǎochí lěngjìng, tōngguò tǎncéng duìhuà zhǎodào gòngtóngdiǎn, yǐ quèbǎo xiàngmù de shùnlì jìnxíng.",
    translationText: "Giao tiếp ưu tú nơi công sở không chỉ là biểu đạt suy nghĩ của riêng mình, mà hơn hết còn là lắng nghe kiến nghị của người khác. Trong hợp tác đội nhóm, việc thiếu đi giao tiếp hiệu quả thường dẫn đến dự án bị chậm tiến độ, thậm chí phát sinh xung đột. Để xây dựng một đội ngũ làm việc hiệu quả cao, chúng ta nên thúc đẩy nguyên tắc 'phối hợp đa bên' và 'chủ động giao tiếp'. Khi gặp những ý kiến khác biệt, nên giữ sự bình tĩnh, tìm kiếm điểm chung thông qua đối thoại thẳng thắn để bảo đảm dự án được tiến hành thuận lợi.",
    vocabulary: [
      { simplified: "倾听", traditional: "傾聽", pinyin: "qīngtīng", meaning: "Lắng nghe" },
      { simplified: "延期", traditional: "延期", pinyin: "yánqī", meaning: "Chậm tiến độ, kéo dài thời hạn" },
      { simplified: "冲突", traditional: "衝突", pinyin: "chōngtū", meaning: "Xung đột, va chạm" },
      { simplified: "坦诚", traditional: "坦誠", pinyin: "tǎncéng", meaning: "Thẳng thắn, thành thật" },
      { simplified: "顺利", traditional: "順利", pinyin: "shùnlì", meaning: "Thuận lợi" },
      { simplified: "共同点", traditional: "共同點", pinyin: "gòngtóngdiǎn", meaning: "Điểm chung, nét tương đồng" }
    ],
    quizzes: [
      {
        question: "Việc thiếu giao tiếp hiệu quả trong đội ngũ sẽ gây ra hậu quả trực tiếp nào?",
        options: [
          { text: "Thành viên trong nhóm được tăng lương hàng năm", isCorrect: false },
          { text: "Dự án bị chậm tiến độ, thậm chí phát sinh xung đột (项目延期甚至发生冲突)", isCorrect: true },
          { text: "Năng suất công việc tự động thăng cấp vượt mức", isCorrect: false }
        ],
        explanation: "Bài khóa viết: '缺乏有效沟通往往会导致项目延期甚至发生冲突' (Thiếu đi giao tiếp hiệu quả thường dẫn tới dự án chậm tiến độ, thậm chí phát sinh xung đột)."
      },
      {
        question: "Phương pháp ứng xử khoa học khi gặp những ý kiến trái chiều là gì?",
        options: [
          { text: "Giữ thái độ im lặng hoàn toàn và từ bỏ dự án", isCorrect: false },
          { text: "Giữ bình tĩnh, đối thoại thẳng thắn để tìm ra điểm chung", isCorrect: true },
          { text: "Tranh cãi dữ dội để khẳng định cái tôi cá nhân", isCorrect: false }
        ],
        explanation: "Đoạn cuối viết: '应当保持冷静，通过坦诚对话找到共同点，以确保项目的顺利进行' (nên giữ bình tĩnh, đối thoại thẳng thắn tìm kiếm điểm chung để bảo đảm dự án thuận lợi)."
      }
    ]
  },

  // --- LEVEL 6 (HSK 6 / TOCFL 6) ---
  {
    id: "r39",
    level: 6,
    titleSimplified: "全球化背景下的跨国企业战略",
    titleTraditional: "全球化背景下的跨國企業戰略",
    pinyinTitle: "Quánqiúhuà bèijǐng xià de kuàguó qǐyè zhànlüè",
    translationTitle: "Chiến lược doanh nghiệp đa quốc gia trong bối cảnh toàn cầu hóa",
    contentSimplified: "在全球化和经济一体化深入发展的今天，跨国企业面临着前所未有的机遇与挑战。为了在激烈的国际竞争中立于不败之地，企业必须建立灵活多变的全球战略。一方面，企业要推进本地化运营，深入研究当地法律法规和风俗习惯，减少文化冲突；另一方面，要通过建立多方协调机制，持续监测全球市场波动的金融风险，确保集团资金链与供应链的稳固。",
    contentTraditional: "在全球化和經濟一體化深入發展的今天，跨國企業面臨著前所未有的機遇與挑戰。為了在激烈的國際競爭中立於不敗之地，企業必須建立靈活多變的全球戰略。一方面，企業要推進本地化運營，深入研究當地法律法規和風俗習慣，減少文化衝突；另一方面，要通過建立多方協調機制，持續監測全球市場波動的金融風險，確保集團資金鏈與供應鏈的穩固。",
    pinyinText: "Zài quánqiúhuà hé jīngjì yìtǐhuà shēnrù fāzhǎn de jīntiān, kuàguó qǐyè miànlín zhe qiánsuǒwèiyǒu de jīyù yǔ tiǎozhàn. Wèile zài jīliè de guójì jìngzhēng zhōng lìyú búbài zhī dì, qǐyè bìxū jiànlì línghuó duōbiàn de quánqiú zhànlüè. Yì fāngmiàn, qǐyè yào tuījìn běndìhuà yùnyíng, shēnrù yánjiū dāngdì fǎlǜ fǎguī hé fēngsú xíguàn, jiǎnshǎo wénhuà chōngtū; lìng yì fāngmiàn, yào tōngguò jiànlì duōfāng xiétiáo jīzhì, chíxù jiāncè quánqiú shìchǎng bōdòng de jīnróng fengxiǎn, quèbǎo jítuán zījīnliàn yǔ gōngyìngliàn de wěngù.",
    translationText: "Trong thời đại ngày nay khi toàn cầu hóa và nhất thể hóa kinh tế phát triển sâu rộng, các doanh nghiệp đa quốc gia đang đối mặt với những cơ hội và thách thức chưa từng có. Để đứng vững và không thất bại trước sự cạnh tranh quốc tế khốc liệt, doanh nghiệp phải thiết lập chiến lược toàn cầu linh hoạt và đa dạng. Một mặt, doanh nghiệp cần đẩy mạnh vận hành bản địa hóa, nghiên cứu sâu sắc luật pháp, quy định cũng như phong tục tập quán địa phương để giảm thiểu xung đột văn hóa; mặt khác, phải thiết lập cơ chế phối hợp đa bên, liên tục giám sát các rủi ro tài chính do biến động của thị trường toàn cầu nhằm bảo đảm dòng tiền và chuỗi cung ứng của tập đoàn được vững chắc.",
    vocabulary: [
      { simplified: "跨国企业", traditional: "跨國企業", pinyin: "kuàguó qǐyè", meaning: "Doanh nghiệp đa quốc gia" },
      { simplified: "不败之地", traditional: "不敗之地", pinyin: "búbài zhī dì", meaning: "Thế bất bại, vị trí không thua" },
      { simplified: "本地化", traditional: "本地化", pinyin: "běndìhuà", meaning: "Bản địa hóa" },
      { simplified: "法律法规", traditional: "法律法規", pinyin: "fǎlǜ fǎguī", meaning: "Luật pháp quy định" },
      { simplified: "资金链", traditional: "資金鏈", pinyin: "zījīnliàn", meaning: "Chuỗi nguồn vốn, dòng vốn" },
      { simplified: "供应链", traditional: "供應鏈", pinyin: "gōngyìngliàn", meaning: "Chuỗi cung ứng" }
    ],
    quizzes: [
      {
        question: "Để giảm bớt các xung đột về văn hóa, doanh nghiệp đa quốc gia cần làm gì?",
        options: [
          { text: "Bản địa hóa vận hành, nghiên cứu kỹ luật pháp và phong tục tập quán địa phương", isCorrect: true },
          { text: "Bỏ qua toàn bộ phong tục tập quán để tối ưu hóa quy trình làm việc", isCorrect: false },
          { text: "Chỉ tuyển dụng nhân sự từ quốc gia gốc sang quản lý chi nhánh", isCorrect: false }
        ],
        explanation: "Bài khóa nêu rõ: '企业要推进本地化运营，深入研究当地法律法规 and 风俗习惯，减少文化冲突' (Doanh nghiệp cần đẩy mạnh vận hành bản địa hóa, nghiên cứu sâu sắc luật pháp quy định cũng như phong tục tập quán địa phương để giảm thiểu xung đột văn hóa)."
      },
      {
        question: "Biện pháp nào giúp bảo đảm vững chắc chuỗi cung ứng và nguồn vốn tập đoàn?",
        options: [
          { text: "Hạn chế mở rộng quốc tế và tập trung kinh doanh nội địa", isCorrect: false },
          { text: "Thiết lập cơ chế phối hợp đa bên, liên tục giám sát biến động thị trường toàn cầu", isCorrect: true },
          { text: "Vay mượn tối đa các khoản tín dụng không qua đánh giá rủi ro", isCorrect: false }
        ],
        explanation: "Bài khóa chỉ ra: '通过建立多方协调机制，持续监测全球市场波动的金融风险，确保集团资金链与供应链的稳固' (Phối hợp đa bên, giám sát biến động rủi ro tài chính để đảm bảo vững chắc chuỗi cung ứng và nguồn vốn)."
      }
    ]
  },
  {
    id: "r40",
    level: 6,
    titleSimplified: "生态文明与可持续发展的长远规划",
    titleTraditional: "生態文明與可持續發展的長遠規劃",
    pinyinTitle: "Shēngtài wénmíng yǔ kěchíxù fāzhǎn de chángyuǎn guīhuà",
    translationTitle: "Quy hoạch lâu dài của văn minh sinh thái và phát triển bền vững",
    contentSimplified: "面对全球气候变化和资源枯竭的严峻形势，推动生态文明建设已成为各国政府的共识。可持续发展的长远规划，要求我们将保护生态环境放在经济发展的突出位置。政府需要出台强有力的生态保护法案，推行绿色GDP核算体系；同时，企业也应加快产业升级，限制高耗能高污染项目，从而在保护自然生态的前提下，实现社会经济的协调与健康发展。",
    contentTraditional: "面對全球氣候變化和資源枯竭的嚴峻形勢，推動生態文明建設已成為各國政府的共識。可持續發展的長遠規劃，要求我們將保護生態環境放在經濟發展的突出位置。政府需要出台強有力的生態保護法案，推行綠色GDP核算體系；同時，企業也應加快產業升級，限制高耗能高污染項目，從而在保護自然生態的前提下，實現社會經濟的協調與健康發展。",
    pinyinText: "Miànduì quánqiú qìhòu biànhuà hé zīyuán kūjié de yánjùn xíngshì, tuīdòng shēngtài wénmíng jiànshè yǐ chéngwéi gèguó zhèngfǔ de gòngshí. Kěchíxù fāzhǎn de chángyuǎn guīhuà, yāoqiú wǒmen jiāng bǎohù shēngtài huánjìng fàng zài jīngjì fāzhǎn de tūchū wèizhì. Zhèngfǔ xūyào chūtái qiángyǒulì de shēngtài bǎohù fǎ'àn, tuīxíng lǜsè GDP hésuàn tǐxì; tóngshí, qǐyè yě yīng jiākuài chǎnyè shēngjí, xiànzhì gāo hàonéng gāo wūrǎn xiàngmù, cóng'ér zài bǎohù zìrán shēngtài de qiántí xià, shíxiàn shèhuì jīngjì de xiétiáo yǔ jiànkāng fāzhǎn.",
    translationText: "Đối mặt với tình hình nghiêm trọng của biến đổi khí hậu toàn cầu và cạn kiệt tài nguyên, việc thúc đẩy xây dựng văn minh sinh thái đã trở thành đồng thuận của chính phủ các nước. Quy hoạch lâu dài về phát triển bền vững yêu cầu chúng ta phải đặt việc bảo vệ môi trường sinh thái ở vị trí nổi bật trong phát triển kinh tế. Chính phủ cần ban hành các pháp án bảo hộ sinh thái mạnh mẽ và thực hiện hệ thống hạch toán GDP xanh; đồng thời, các doanh nghiệp cũng cần đẩy nhanh nâng cấp ngành nghề, hạn chế các dự án tiêu thụ năng lượng cao và ô nhiễm cao, từ đó hiện thực hóa sự phát triển hài hòa, khỏe mạnh của kinh tế xã hội dưới tiền đề bảo hộ sinh thái tự nhiên.",
    vocabulary: [
      { simplified: "生态文明", traditional: "生態文明", pinyin: "shēngtài wénmíng", meaning: "Văn minh sinh thái" },
      { simplified: "资源枯竭", traditional: "資源枯竭", pinyin: "zīyuán kūjié", meaning: "Cạn kiệt tài nguyên" },
      { simplified: "绿色GDP", traditional: "綠色GDP", pinyin: "lǜsè GDP", meaning: "GDP xanh" },
      { simplified: "核算体系", traditional: "核算體系", pinyin: "hésuàn tǐxì", meaning: "Hệ thống hạch toán" },
      { simplified: "产业升级", traditional: "產業升級", pinyin: "chǎnyè shēngjí", meaning: "Nâng cấp công nghiệp" },
      { simplified: "协调", traditional: "協調", pinyin: "xiétiáo", meaning: "Hài hòa, phối hợp" }
    ],
    quizzes: [
      {
        question: "Quy hoạch phát triển bền vững đòi hỏi chúng ta phải ưu tiên bảo vệ sinh thái ở mức nào?",
        options: [
          { text: "Đặt việc bảo vệ sinh thái ở vị trí thứ yếu sau sự bùng nổ tài chính ngắn hạn", isCorrect: false },
          { text: "Đặt việc bảo vệ sinh thái ở vị trí nổi bật, quan trọng hàng đầu trong phát triển kinh tế", isCorrect: true },
          { text: "Bỏ qua hoàn toàn vấn đề sinh thái để tập trung tối đa công nghiệp nặng", isCorrect: false }
        ],
        explanation: "Bài khóa viết: '可持续发展的长远规划，要求我们将保护生态环境放在经济发展的突出位置' (Phát triển bền vững yêu cầu đặt bảo vệ sinh thái ở vị trí nổi bật trong phát triển kinh tế)."
      },
      {
        question: "Ở tầm vĩ mô, chính phủ cần đưa ra các quyết sách nào?",
        options: [
          { text: "Dừng hoàn toàn việc hoạt động của các xí nghiệp thương mại", isCorrect: false },
          { text: "Ban hành các pháp án bảo vệ sinh thái mạnh mẽ và thực hiện hệ thống GDP xanh", isCorrect: true },
          { text: "Cắt giảm toàn bộ chi phí dành cho bảo tồn tài nguyên tự nhiên", isCorrect: false }
        ],
        explanation: "Bài khóa ghi: '政府需要出台强有力的生态保护法案，推行绿色GDP核算体系' (Chính phủ cần xuất đài pháp án bảo vệ sinh thái mạnh mẽ, đẩy mạnh hạch toán GDP xanh)."
      }
    ]
  },
  {
    id: "r41",
    level: 6,
    titleSimplified: "老龄化社会与宏观经济结构调整",
    titleTraditional: "老齡化社會與宏觀經濟結構調整",
    pinyinTitle: "Lǎolínghuà shèhuì yǔ hóngguān jīngjì jiégòu tiáozhěng",
    translationTitle: "Xã hội già hóa và điều chỉnh cơ cấu kinh tế vĩ mô",
    contentSimplified: "随着生育率下降 and 人均寿命延长，全球许多国家已逐步步入老龄化社会。老龄化不仅给社会保障和医疗体系带来沉重负担，还将导致劳动力人口萎缩，影响经济潜在增长率。应对这一危机，需要政府从宏观经济层面进行结构调整。一方面，可以通过适当延迟退休年龄、鼓励生育来缓解劳动力供给压力；另一方面，应大力发展“银发经济”和智能化替代，将老龄化带来的压力转化为产业升级的新动力。",
    contentTraditional: "隨著生育率下降與人均壽命延長，全球許多國家已逐步步入老齡化社會。老齡化不僅給社會保障和醫療體系帶來沉重負擔，還將導致勞動人口萎縮，影響經濟潛在增長率。應對這一危機，需要政府從宏觀經濟層面進行結構調整。一方面，可以通過適當延遲退休年齡、鼓勵生育來緩解勞動力供給壓力；另一方面，應大力發展“銀髮經濟”和智能化替代，將老齡化帶來的壓力轉化為產業升級的新動力。",
    pinyinText: "Suízhe shēngyùlǜ xiàjiàng hé rénjūn shòumìng yáncháng, quánqiú xǔduō guójiā yǐ zhúbù bùrù lǎolínghuà shèhuì. Lǎolínghuà bùjǐn gěi shèhuì bǎozhàng hé yīliáo tǐxì dài lái chénzhòng fùdān, hái jiāng dǎozhì láodònglì rénkǒu wěisuō, yǐngxiǎng jīngjì qiánzài zēngzhǎnglǜ. Yìngduì zhè yī wēijī, xūyào zhèngfǔ cóng hóngguān jīngjì céngmiàn jìnxíng jiégòu tiáozhěng. Yì fāngmiàn, kěyǐ tōngguò shìdàng yánchí tuìxiū niánlíng, gǔlì shēngyù lái huǎnjiě láodònglì gōnggǐ yālì; lìng yì fāngmiàn, yīng dàlì fāzhǎn 'yínfà jīngjì' hé zhìnénghuà tìdài, jiāng lǎolínghuà dài lái de yālì zhuǎnhuà wéi chǎnyè shēngjí de xīn dònglì.",
    translationText: "Cùng với việc tỷ lệ sinh giảm sút và tuổi thọ trung bình tăng lên, nhiều quốc gia trên thế giới đã dần bước vào xã hội già hóa. Già hóa không chỉ đem lại gánh nặng nặng nề cho hệ thống an sinh xã hội và y tế, mà còn dẫn đến việc thu hẹp dân số lao động, ảnh hưởng đến tốc độ tăng trưởng kinh tế tiềm năng. Ứng phó với cuộc khủng hoảng này yêu cầu chính phủ tiến hành điều chỉnh cơ cấu từ cấp độ kinh tế vĩ mô. Một mặt, có thể giảm bớt áp lực cung lao động thông qua việc trì hoãn tuổi nghỉ hưu một cách thích hợp và khuyến khích sinh sản; mặt khác, cần phát triển mạnh mẽ 'nền kinh tế bạc' và thay thế bằng trí tuệ nhân tạo, chuyển hóa áp lực do già hóa mang lại thành động lực mới cho nâng cấp ngành nghề.",
    vocabulary: [
      { simplified: "老龄化", traditional: "老齡化", pinyin: "lǎolínghuà", meaning: "Già hóa dân số" },
      { simplified: "劳动力", traditional: "勞動力", pinyin: "láodònglì", meaning: "Lực lượng lao động" },
      { simplified: "宏观经济", traditional: "宏觀經濟", pinyin: "hóngguān jīngjì", meaning: "Kinh tế vĩ mô" },
      { simplified: "延迟退休", traditional: "延遲退休", pinyin: "yánchí tuìxiū", meaning: "Trì hoãn nghỉ hưu" },
      { simplified: "银发经济", traditional: "銀髮經濟", pinyin: "yínfà jīngjì", meaning: "Nền kinh tế tóc bạc" },
      { simplified: "转化为", traditional: "轉化為", pinyin: "zhuǎnhuà wéi", meaning: "Chuyển hóa thành, biến thành" }
    ],
    quizzes: [
      {
        question: "Già hóa dân số đem lại các tác động tiêu cực nào đối với nền kinh tế vĩ mô?",
        options: [
          { text: "Làm gia tăng nhanh số lượng nhân lực trẻ tuổi chất lượng cao", isCorrect: false },
          { text: "Tạo gánh nặng lớn cho an sinh xã hội, y tế, và thu hẹp dân số lao động", isCorrect: true },
          { text: "Làm giảm hoàn toàn tỉ lệ nợ công và nợ tư của nhà nước", isCorrect: false }
        ],
        explanation: "Bài khóa viết: '老龄化不仅给社会保障和医疗体系带来沉重负担，还将导致劳动力人口萎缩，影响经济潜在增长率' (Già hóa mang lại gánh nặng nặng nề cho an sinh xã hội, y tế, thu hẹp dân số lao động và giảm tốc độ tăng trưởng kinh tế)."
      },
      {
        question: "Để biến áp lực già hóa thành động lực thăng cấp công nghiệp, giải pháp được đề xuất là gì?",
        options: [
          { text: "Cắt giảm toàn bộ chi phí phúc lợi y tế của người già", isCorrect: false },
          { text: "Phát triển mạnh mẽ 'nền kinh tế bạc' và tự động hóa/trí tuệ nhân tạo thay thế", isCorrect: true },
          { text: "Cấm tất cả người cao tuổi tham gia bất cứ hoạt động lao động nào", isCorrect: false }
        ],
        explanation: "Đoạn cuối viết: '应大力发展“银发经济”和智能化替代，将老龄化带来的压力转化为产业升级的新动力' (Cần phát triển 'nền kinh tế bạc' và tự động hóa thay thế để chuyển hóa áp lực thành động lực mới)."
      }
    ]
  },
  {
    id: "r42",
    level: 6,
    titleSimplified: "科技创新与知识产权保护的博弈",
    titleTraditional: "科技創新與知識產權保護的博弈",
    pinyinTitle: "Kējì chuàngxīn yǔ zhīshi chǎnquán bǎohù de bóyì",
    translationTitle: "Cuộc đấu trí giữa đổi mới khoa học công nghệ và bảo hộ quyền sở hữu trí tuệ",
    contentSimplified: "科技创新是推动现代国家实现产业升级的核心引擎，而知识产权保护则是激发创新活力的重要保障。然而，在国际科技竞争中，保护与分享之间存在着微妙的博弈关系。过度严格的保护会导致技术垄断，阻碍中小企业的技术引进与二次创新；而保护不足则会损害原创开发者的商业利润，进而打击研发投资的积极性。建立平衡且合理的知识产权保护机制，是推动全球科技合作与产业升级的关键所在。",
    contentTraditional: "科技創新是推動現代國家實現產業升級的核心引擎，而知識產權保護則是激發創新活力的重要保障。然而，在國際科技競爭中，保護與分享之間存在著微妙的博弈關係。過度嚴格的保護會導致技術壟斷，阻礙中小企業的技術引進與二次創新；而保護不足則會損害原創開發者的商業利潤，進而打擊研發投資的積極性。建立平衡且合理的知識產權保護機制，是推動全球科技合作與產業升級的關鍵所在。",
    pinyinText: "Kējì chuàngxīn shì tuīdòng xindài guójiā shíxiàn chǎnyè shēngjí de héxīn yǐnqíng, ér zhīshi chǎnquán bǎohù zé shì jīfā chuàngxīn huólì de zhòngyào bǎozhàng. Rán'ér, zài guójì kējì jìngzhēng zhōng, bǎohù yǔ fēnxiǎng zhījiān cúnzài zhe wēimiào de bóyì guānxi. Guòdù yángé de bǎohù huì dǎozhì jìshù lǒngduàn, zǔ'ài zhōngxiǎo qǐyè de jìshù yǐnjìn yǔ èrcì chuàngxīn; ér bǎohù bùzú zé huì sǔnhài yuánchuàng kāifāzhě de shāngyè lìrùn, jìn'ér dǎjī yánfā tóuzī de jījíxìng. Jiànlì pínghéng qiě hélǐ de zhīshi chǎnquán bǎohù jīzhì, shì tuīdòng quánqiú kējì hézuò yǔ chǎnyè shēngjí de guānjiàn suǒzài.",
    translationText: "Đổi mới khoa học công nghệ là động cơ cốt lõi thúc đẩy các quốc gia hiện đại thực hiện nâng cấp ngành nghề, trong khi bảo hộ quyền sở hữu trí tuệ là sự bảo đảm quan trọng để kích hoạt sức sống của đổi mới sáng tạo. Thế nhưng, trong cạnh tranh khoa học công nghệ quốc tế, luôn tồn tại mối quan hệ đấu trí tinh tế giữa bảo hộ và chia sẻ. Việc bảo hộ quá nghiêm ngặt sẽ dẫn đến độc quyền công nghệ, cản trở việc chuyển giao công nghệ và đổi mới lần hai của các doanh nghiệp vừa và nhỏ; ngược lại, bảo hộ không đủ sẽ gây tổn hại đến lợi nhuận thương mại của các nhà phát triển gốc, từ đó đánh đòn tâm lý vào tính tích cực đầu tư nghiên cứu phát triển. Xây dựng một cơ chế bảo hộ sở hữu trí tuệ cân bằng và hợp lý là chìa khóa để thúc đẩy hợp tác khoa học công nghệ và nâng cấp ngành nghề toàn cầu.",
    vocabulary: [
      { simplified: "知识产权", traditional: "知識產權", pinyin: "zhīshi chǎnquán", meaning: "Quyền sở hữu trí tuệ" },
      { simplified: "引擎", traditional: "引擎", pinyin: "yǐnqíng", meaning: "Động cơ, công cụ thúc đẩy" },
      { simplified: "博弈", traditional: "博弈", pinyin: "bóyì", meaning: "Đấu trí, cuộc đấu" },
      { simplified: "垄断", traditional: "壟斷", pinyin: "lǒngduàn", meaning: "Độc quyền" },
      { simplified: "二次创新", traditional: "二次創新", pinyin: "èrcì chuàngxīn", meaning: "Đổi mới lần hai" },
      { simplified: "平衡", traditional: "平衡", pinyin: "pínghéng", meaning: "Cân bằng" }
    ],
    quizzes: [
      {
        question: "Biểu hiện tiêu cực nào xảy ra khi thực hiện bảo hộ quyền sở hữu trí tuệ quá nghiêm ngặt?",
        options: [
          { text: "Giúp các doanh nghiệp vừa và nhỏ thâm nhập thị trường dễ dàng hơn", isCorrect: false },
          { text: "Dẫn đến độc quyền công nghệ, cản trở chuyển giao và phát triển thứ cấp", isCorrect: true },
          { text: "Đánh tụt hoàn toàn lợi nhuận thương mại của nhà nghiên cứu phát triển gốc", isCorrect: false }
        ],
        explanation: "Bài khóa viết: '过度严格的保护会导致技术垄断，阻碍中小企业的技术引进与二次创新' (Bảo hộ quá nghiêm ngặt dẫn đến độc quyền công nghệ, cản trở chuyển giao và đổi mới lần hai của doanh nghiệp vừa và nhỏ)."
      },
      {
        question: "Theo tác giả, làm thế nào để thúc đẩy bền vững hợp tác khoa học và phát triển nâng cấp?",
        options: [
          { text: "Hủy bỏ toàn bộ các điều ước thương mại liên quốc gia", isCorrect: false },
          { text: "Xây dựng cơ chế bảo hộ quyền sở hữu trí tuệ cân bằng và hợp lý", isCorrect: true },
          { text: "Cho phép sao chép tự do tuyệt đối không cần xin phép", isCorrect: false }
        ],
        explanation: "Đoạn cuối viết: '建立平衡且合理的知识产权保护机制，是推动全球科技合作与产业升级的关键所在' (Xây dựng một cơ chế bảo hộ sở hữu trí tuệ cân bằng và hợp lý là chìa khóa để thúc đẩy hợp tác khoa học công nghệ)."
      }
    ]
  }
];

// 3. Combine processed original lessons with new lessons
const combinedLessons = [...processedReadingData, ...newLessons];

// Sort lessons by level, and then by ID (numeric comparison based on ID number)
combinedLessons.sort((a, b) => {
  if (a.level !== b.level) {
    return a.level - b.level;
  }
  const idNumA = parseInt(a.id.replace('r', ''), 10);
  const idNumB = parseInt(b.id.replace('r', ''), 10);
  return idNumA - idNumB;
});

console.log(`Total combined lessons count: ${combinedLessons.length}`);
const counts = {};
combinedLessons.forEach(l => {
  counts[l.level] = (counts[l.level] || 0) + 1;
});
console.log('Per level counts:', counts);

// 4. Custom Serializer to output beautiful unquoted key JavaScript object strings
function serialize(val, indent = '') {
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    // Format simple arrays inline if small, or block otherwise
    const items = val.map(item => serialize(item, indent + '  '));
    const isSimple = val.every(item => typeof item !== 'object');
    if (isSimple && items.join(', ').length < 80) {
      return '[ ' + items.join(', ') + ' ]';
    }
    return '[\n' + items.map(item => indent + '  ' + item).join(',\n') + '\n' + indent + ']';
  } else if (typeof val === 'object' && val !== null) {
    const keys = Object.keys(val);
    const parts = keys.map(key => {
      const escapedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      return `${escapedKey}: ${serialize(val[key], indent + '  ')}`;
    });
    // Check if small object that can be formatted inline (like vocabulary items)
    if (keys.length <= 4 && keys.every(k => typeof val[k] !== 'object') && parts.join(', ').length < 80) {
      return '{ ' + parts.join(', ') + ' }';
    }
    return '{\n' + parts.map(part => indent + '  ' + part).join(',\n') + '\n' + indent + '}';
  } else if (typeof val === 'string') {
    // Avoid double escapes and make newlines output beautifully
    return JSON.stringify(val);
  } else {
    return String(val);
  }
}

// 5. Generate the replacement string
let readingDataString = 'export const readingData = [\n';
for (let lvl = 1; lvl <= 6; lvl++) {
  readingDataString += `  // LEVEL ${lvl} (HSK ${lvl} / TOCFL ${lvl})\n`;
  const levelLessons = combinedLessons.filter(x => x.level === lvl);
  levelLessons.forEach((lesson, index) => {
    const lessonStr = serialize(lesson, '  ');
    readingDataString += '  ' + lessonStr;
    if (lvl === 6 && index === levelLessons.length - 1) {
      readingDataString += '\n';
    } else {
      readingDataString += ',\n';
    }
  });
}
readingDataString += '];\n\n\n';

// 6. Read vocabulary.js file content
const originalContent = fs.readFileSync(vocabularyPath, 'utf8');

// Find boundaries
const startPattern = 'export const readingData = [';
const endPattern = '// --- 🎧 KỸ NĂNG NGHE (LISTENING) ---';

const startIndex = originalContent.indexOf(startPattern);
const endIndex = originalContent.indexOf(endPattern);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find start or end pattern in vocabulary.js!');
  process.exit(1);
}

console.log(`Found start pattern at index ${startIndex}, end pattern at index ${endIndex}`);

// Perform replacement
const updatedContent = originalContent.slice(0, startIndex) + readingDataString + originalContent.slice(endIndex);

// Write back to vocabulary.js
fs.writeFileSync(vocabularyPath, updatedContent, 'utf8');
console.log('Successfully updated vocabulary.js with 42 lessons!');
