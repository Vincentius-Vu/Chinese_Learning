import os
import re

file_path = r"c:\Users\T14\Documents\GitHub\Chinese_Learning\src\data\readingData.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_stories = """
  ,{
    id: "r43",
    level: 1,
    titleSimplified: "我的家人",
    titleTraditional: "我的家人",
    pinyinTitle: "Wǒ de jiārén",
    translationTitle: "Gia đình của tôi",
    contentSimplified: "A: 你好！这是你的家人吗？\\nB: 是的，这是我爸爸和我妈妈。\\nA: 你有哥哥或者姐姐吗？\\nB: 我没有哥哥，我有一个妹妹。她今年八岁。\\nA: 你的妹妹很漂亮！\\nB: 谢谢你！",
    contentTraditional: "A: 你好！這是你的家人嗎？\\nB: 是的，這是我爸爸和我媽媽。\\nA: 你有哥哥或者姐姐嗎？\\nB: 我沒有哥哥，我有一個妹妹。她今年八歲。\\nA: 你的妹妹很漂亮！\\nB: 謝謝你！",
    pinyinText: "A: Nǐ hǎo! Zhè shì nǐ de jiārén ma?\\nB: Shì de, zhè shì wǒ bàba hé wǒ māma.\\nA: Nǐ yǒu gēge huòzhě jiějie ma?\\nB: Wǒ méiyǒu gēge, wǒ yǒu yí ge mèimei. Tā jīnnián bā suì.\\nA: Nǐ de mèimei hěn piàoliang!\\nB: Xièxie nǐ!",
    translationText: "A: Xin chào! Đây là người nhà của bạn phải không?\\nB: Đúng vậy, đây là bố tôi và mẹ tôi.\\nA: Bạn có anh trai hay chị gái không?\\nB: Tôi không có anh trai, tôi có một em gái. Em ấy năm nay tám tuổi.\\nA: Em gái của bạn rất xinh đẹp!\\nB: Cảm ơn bạn!",
    vocabulary: [
      { simplified: "家人", traditional: "家人", pinyin: "jiārén", meaning: "Người nhà, gia đình" },
      { simplified: "爸爸", traditional: "爸爸", pinyin: "bàba", meaning: "Bố, ba" },
      { simplified: "妈妈", traditional: "媽媽", pinyin: "māma", meaning: "Mẹ, má" },
      { simplified: "妹妹", traditional: "妹妹", pinyin: "mèimei", meaning: "Em gái" },
      { simplified: "漂亮", traditional: "漂亮", pinyin: "piàoliang", meaning: "Xinh đẹp" }
    ],
    quizzes: [
      {
        question: "B có anh trai không?",
        options: [
          { text: "Có, B có một anh trai", isCorrect: False },
          { text: "Không, B chỉ có một em gái", isCorrect: True },
          { text: "Không, B có một chị gái", isCorrect: False }
        ],
        explanation: "Trong bài, B nói '我没有哥哥，我有一个妹妹' (Tôi không có anh trai, tôi có một em gái)."
      },
      {
        question: "Em gái của B năm nay bao nhiêu tuổi?",
        options: [
          { text: "Tám tuổi (8)", isCorrect: True },
          { text: "Chín tuổi (9)", isCorrect: False },
          { text: "Mười tuổi (10)", isCorrect: False }
        ],
        explanation: "B nói '她今年八岁' (Em ấy năm nay tám tuổi - 八岁)."
      }
    ]
  },
  {
    id: "r44",
    level: 1,
    titleSimplified: "去商店买水果",
    titleTraditional: "去商店買水果",
    pinyinTitle: "Qù shāngdiàn mǎi shuǐguǒ",
    translationTitle: "Đi cửa hàng mua hoa quả",
    contentSimplified: "A: 老板，你好！苹果怎么卖？\\nB: 苹果十块钱一个。你想买多少？\\nA: 太贵了！八块钱可以吗？\\nB: 好吧。你要几个？\\nA: 我买五个苹果，再买一些茶。一共多少钱？\\nB: 苹果四十块，茶二十块。一共六十块。\\nA: 给你钱，谢谢！",
    contentTraditional: "A: 老闆，你好！蘋果怎麼賣？\\nB: 蘋果十塊錢一個。你想買多少？\\nA: 太貴了！八塊錢可以嗎？\\nB: 好吧。你要幾個？\\nA: 我買五個蘋果，再買一些茶。一共多少錢？\\nB: 蘋果四十塊，茶二十塊。一共六十塊。\\nA: 給你錢，謝謝！",
    pinyinText: "A: Lǎobǎn, nǐ hǎo! Píngguǒ zěnme mài?\\nB: Píngguǒ shí kuài qián yí ge. Nǐ xiǎng mǎi duōshao?\\nA: Tài guì le! Bā kuài qián kěyǐ ma?\\nB: Hǎo ba. Nǐ yào jǐ ge?\\nA: Wǒ mǎi wǔ ge píngguǒ, zài mǎi yìxiē chá. Yígòng duōshao qián?\\nB: Píngguǒ sìshí kuài, chá èrshí kuài. Yígòng liùshí kuài.\\nA: Gěi nǐ qián, xièxie!",
    translationText: "A: Ông chủ, xin chào! Táo bán thế nào vậy?\\nB: Táo 10 tệ một quả. Bạn muốn mua bao nhiêu?\\nA: Đắt quá! 8 tệ được không?\\nB: Được thôi. Bạn lấy mấy quả?\\nA: Tôi mua 5 quả táo, mua thêm một ít trà. Tổng cộng bao nhiêu tiền?\\nB: Táo 40 tệ, trà 20 tệ. Tổng cộng 60 tệ.\\nA: Gửi ông tiền, cảm ơn!",
    vocabulary: [
      { simplified: "苹果", traditional: "蘋果", pinyin: "píngguǒ", meaning: "Quả táo" },
      { simplified: "卖", traditional: "賣", pinyin: "mài", meaning: "Bán" },
      { simplified: "买", traditional: "買", pinyin: "mǎi", meaning: "Mua" },
      { simplified: "钱", traditional: "錢", pinyin: "qián", meaning: "Tiền" },
      { simplified: "多少", traditional: "多少", pinyin: "duōshao", meaning: "Bao nhiêu" }
    ],
    quizzes: [
      {
        question: "Giá táo cuối cùng A mua là bao nhiêu?",
        options: [
          { text: "10 tệ một quả", isCorrect: False },
          { text: "8 tệ một quả", isCorrect: True },
          { text: "5 tệ một quả", isCorrect: False }
        ],
        explanation: "A mặc cả '八块钱可以吗？' (8 tệ được không?) và ông chủ đồng ý '好吧' (Được thôi)."
      },
      {
        question: "Tổng số tiền A phải trả là bao nhiêu?",
        options: [
          { text: "40 tệ", isCorrect: False },
          { text: "60 tệ", isCorrect: True },
          { text: "80 tệ", isCorrect: False }
        ],
        explanation: "Táo 40 tệ, trà 20 tệ, tổng cộng là 60 tệ (一共六十块)."
      }
    ]
  },
  {
    id: "r45",
    level: 1,
    titleSimplified: "在饭店吃饭",
    titleTraditional: "在飯店吃飯",
    pinyinTitle: "Zài fàndiàn chīfàn",
    translationTitle: "Ăn cơm ở nhà hàng",
    contentSimplified: "A: 服务员，请给我菜单。\\nB: 好的，这是菜单。你想吃什么？\\nA: 我想吃米饭和中国菜。这儿有什么好吃的菜？\\nB: 我们的鱼很好吃。你要吃鱼吗？\\nA: 好，我要一个鱼，两碗米饭。再来一杯水。\\nB: 好的，请等一下。\\nA: 谢谢！",
    contentTraditional: "A: 服務員，請給我菜單。\\nB: 好的，這是菜單。你想吃什麼？\\nA: 我想吃米飯和中國菜。這兒有什麼好吃的菜？\\nB: 我們的魚很好吃。你要吃魚嗎？\\nA: 好，我要一個魚，兩碗米飯。再來一杯水。\\nB: 好的，請等一下。\\nA: 謝謝！",
    pinyinText: "A: Fúwùyuán, qǐng gěi wǒ càidān.\\nB: Hǎo de, zhè shì càidān. Nǐ xiǎng chī shénme?\\nA: Wǒ xiǎng chī mǐfàn hé Zhōngguó cài. Zhèr yǒu shénme hǎochī de cài?\\nB: Wǒmen de yú hěn hǎochī. Nǐ yào chī yú ma?\\nA: Hǎo, wǒ yào yí ge yú, liǎng wǎn mǐfàn. Zài lái yì bēi shuǐ.\\nB: Hǎo de, qǐng děng yíxià.\\nA: Xièxie!",
    translationText: "A: Phục vụ, vui lòng cho tôi thực đơn.\\nB: Vâng, đây là thực đơn. Quý khách muốn ăn gì?\\nA: Tôi muốn ăn cơm trắng và món ăn Trung Quốc. Ở đây có món gì ngon?\\nB: Món cá của chúng tôi rất ngon. Quý khách có muốn ăn cá không?\\nA: Được, tôi lấy một phần cá, hai bát cơm trắng. Thêm một cốc nước lọc.\\nB: Vâng, xin đợi một lát.\\nA: Cảm ơn!",
    vocabulary: [
      { simplified: "吃", traditional: "吃", pinyin: "chī", meaning: "Ăn" },
      { simplified: "米饭", traditional: "米飯", pinyin: "mǐfàn", meaning: "Cơm trắng" },
      { simplified: "菜", traditional: "菜", pinyin: "cài", meaning: "Món ăn, rau" },
      { simplified: "鱼", traditional: "魚", pinyin: "yú", meaning: "Con cá, thịt cá" },
      { simplified: "水", traditional: "水", pinyin: "shuǐ", meaning: "Nước" }
    ],
    quizzes: [
      {
        question: "A đã gọi những món gì?",
        options: [
          { text: "Cá, 2 bát cơm trắng và 1 cốc nước", isCorrect: True },
          { text: "Cá, 1 bát cơm trắng và trà", isCorrect: False },
          { text: "Thịt bò, cơm trắng và nước ép", isCorrect: False }
        ],
        explanation: "A nói '我要一个鱼，两碗米饭。再来一杯水' (Tôi lấy một phần cá, hai bát cơm trắng. Thêm một cốc nước)."
      }
    ]
  },
  {
    id: "r46",
    level: 1,
    titleSimplified: "今天天气怎么样？",
    titleTraditional: "今天天氣怎麼樣？",
    pinyinTitle: "Jīntiān tiānqì zěnmeyàng?",
    translationTitle: "Hôm nay thời tiết thế nào?",
    contentSimplified: "A: 昨天下雨了，今天天气怎么样？\\nB: 今天天气很好，不下雨。很热。\\nA: 太好了！下午我们去哪儿玩？\\nB: 我们去朋友家看电影，怎么样？\\nA: 对不起，我下午要去医院看医生。\\nB: 你生病了吗？\\nA: 是的，我有点儿不舒服。\\nB: 那你多喝水，多休息！",
    contentTraditional: "A: 昨天下雨了，今天天氣怎麼樣？\\nB: 今天天氣很好，不下雨。很熱。\\nA: 太好了！下午我們去哪兒玩？\\nB: 我們去朋友家看電影，怎麼樣？\\nA: 對不起，我下午要去醫院看醫生。\\nB: 你生病了嗎？\\nA: 是的，我有點兒不舒服。\\nB: 那你多喝水，多休息！",
    pinyinText: "A: Zuótiān xiàyǔ le, jīntiān tiānqì zěnmeyàng?\\nB: Jīntiān tiānqì hěn hǎo, bú xiàyǔ. Hěn rè.\\nA: Tài hǎo le! Xiàwǔ wǒmen qù nǎr wán?\\nB: Wǒmen qù péngyǒu jiā kàn diànyǐng, zěnmeyàng?\\nA: Duìbùqǐ, wǒ xiàwǔ yào qù yīyuàn kàn yīshēng.\\nB: Nǐ shēngbìng le ma?\\nA: Shì de, wǒ yǒudiǎnr bù shūfu.\\nB: Nà nǐ duō hē shuǐ, duō xiūxi!",
    translationText: "A: Hôm qua trời mưa, hôm nay thời tiết thế nào?\\nB: Hôm nay thời tiết rất đẹp, không mưa. Rất nóng.\\nA: Tốt quá! Buổi chiều chúng ta đi đâu chơi?\\nB: Chúng ta đến nhà bạn xem phim, thấy sao?\\nA: Xin lỗi, chiều nay tôi phải đến bệnh viện gặp bác sĩ.\\nB: Bạn bị ốm hả?\\nA: Đúng vậy, tôi hơi khó chịu một chút.\\nB: Vậy bạn uống nhiều nước, nghỉ ngơi nhiều nhé!",
    vocabulary: [
      { simplified: "昨天", traditional: "昨天", pinyin: "zuótiān", meaning: "Hôm qua" },
      { simplified: "今天", traditional: "今天", pinyin: "jīntiān", meaning: "Hôm nay" },
      { simplified: "天气", traditional: "天氣", pinyin: "tiānqì", meaning: "Thời tiết" },
      { simplified: "下雨", traditional: "下雨", pinyin: "xiàyǔ", meaning: "Trời mưa" },
      { simplified: "医院", traditional: "醫院", pinyin: "yīyuàn", meaning: "Bệnh viện" },
      { simplified: "看电影", traditional: "看電影", pinyin: "kàn diànyǐng", meaning: "Xem phim" }
    ],
    quizzes: [
      {
        question: "Thời tiết hôm nay thế nào?",
        options: [
          { text: "Trời mưa và lạnh", isCorrect: False },
          { text: "Thời tiết đẹp, không mưa và rất nóng", isCorrect: True },
          { text: "Trời có tuyết", isCorrect: False }
        ],
        explanation: "B nói '今天天气很好，不下雨。很热' (Hôm nay thời tiết rất đẹp, không mưa. Rất nóng)."
      },
      {
        question: "Tại sao A không đi xem phim được?",
        options: [
          { text: "Vì A phải đi làm", isCorrect: False },
          { text: "Vì A phải đến bệnh viện gặp bác sĩ", isCorrect: True },
          { text: "Vì A phải ở nhà học bài", isCorrect: False }
        ],
        explanation: "A nói '我下午要去医院看医生' (Chiều nay tôi phải đến bệnh viện gặp bác sĩ)."
      }
    ]
  },
  {
    id: "r47",
    level: 1,
    titleSimplified: "打电话给老师",
    titleTraditional: "打電話給老師",
    pinyinTitle: "Dǎ diànhuà gěi lǎoshī",
    translationTitle: "Gọi điện thoại cho thầy giáo",
    contentSimplified: "A: 喂，请问是王老师吗？\\nB: 我是。你是谁？\\nA: 老师，你好。我是大卫。\\nB: 大卫，你好。有什么事吗？\\nA: 老师，对不起。我今天生病了，不能去学校。\\nB: 没关系。你在家好好休息。明天能来吗？\\nA: 我想明天可以。谢谢老师！\\nB: 不客气，再见。",
    contentTraditional: "A: 喂，請問是王老師嗎？\\nB: 我是。你是誰？\\nA: 老師，你好。我是大衛。\\nB: 大衛，你好。有什麼事嗎？\\nA: 老師，對不起。我今天生病了，不能去學校。\\nB: 沒關係。你在家好好休息。明天能來嗎？\\nA: 我想明天可以。謝謝老師！\\nB: 不客氣，再見。",
    pinyinText: "A: Wéi, qǐngwèn shì Wáng lǎoshī ma?\\nB: Wǒ shì. Nǐ shì shéi?\\nA: Lǎoshī, nǐ hǎo. Wǒ shì Dàwèi.\\nB: Dàwèi, nǐ hǎo. Yǒu shénme shì ma?\\nA: Lǎoshī, duìbùqǐ. Wǒ jīntiān shēngbìng le, bù néng qù xuéxiào.\\nB: Méi guānxi. Nǐ zài jiā hǎohǎo xiūxi. Míngtiān néng lái ma?\\nA: Wǒ xiǎng míngtiān kěyǐ. Xièxie lǎoshī!\\nB: Bú kèqì, zàijiàn.",
    translationText: "A: Alo, xin hỏi có phải thầy Vương không ạ?\\nB: Là tôi. Em là ai vậy?\\nA: Chào thầy ạ. Em là David.\\nB: Chào David. Có chuyện gì không em?\\nA: Thầy ơi, xin lỗi thầy. Hôm nay em bị ốm, không thể đến trường được.\\nB: Không sao đâu. Em ở nhà nghỉ ngơi cho tốt nhé. Ngày mai có thể đến không?\\nA: Em nghĩ ngày mai là được ạ. Cảm ơn thầy!\\nB: Không có gì, tạm biệt em.",
    vocabulary: [
      { simplified: "老师", traditional: "老師", pinyin: "lǎoshī", meaning: "Giáo viên, thầy cô" },
      { simplified: "学校", traditional: "學校", pinyin: "xuéxiào", meaning: "Trường học" },
      { simplified: "对不起", traditional: "對不起", pinyin: "duìbùqǐ", meaning: "Xin lỗi" },
      { simplified: "没关系", traditional: "沒關係", pinyin: "méi guānxi", meaning: "Không sao đâu" },
      { simplified: "再见", traditional: "再見", pinyin: "zàijiàn", meaning: "Tạm biệt" }
    ],
    quizzes: [
      {
        question: "Tại sao David hôm nay không đến trường?",
        options: [
          { text: "Vì David phải đi mua đồ", isCorrect: False },
          { text: "Vì David đi du lịch", isCorrect: False },
          { text: "Vì David bị ốm", isCorrect: True }
        ],
        explanation: "David nói '我今天生病了，不能去学校' (Hôm nay em bị ốm, không thể đến trường được)."
      }
    ]
  }
"""

# Insert the new stories right before the final ];
last_bracket_idx = content.rfind("];")
if last_bracket_idx != -1:
    new_content = content[:last_bracket_idx] + new_stories + "\n];"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Added 5 new conversational stories successfully!")
else:
    print("Error: Could not find the closing bracket in readingData.js")
