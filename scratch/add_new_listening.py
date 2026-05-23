import os

file_path = r"c:\Users\T14\Documents\GitHub\Chinese_Learning\src\data\listeningData.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_listening = """
  ,{
    id: "l39",
    level: 1,
    simplified: "爸爸在喝茶，妈妈在看书。",
    traditional: "爸爸在喝茶，媽媽在看書。",
    pinyin: "Bàba zài hē chá, māma zài kàn shū.",
    translation: "Bố đang uống trà, mẹ đang đọc sách.",
    choices: [
      "Bố đang đọc sách, mẹ đang uống trà.",
      "Bố đang uống trà, mẹ đang đọc sách.",
      "Bố đang uống nước, mẹ đang xem tivi."
    ],
    explanation: "Phát âm: 'Bàba zài hē chá, māma zài kàn shū.' dịch nghĩa là 'Bố đang uống trà, mẹ đang đọc sách.' (喝茶 - hē chá: uống trà; 看书 - kàn shū: đọc sách)."
  },
  {
    id: "l40",
    level: 1,
    simplified: "我买了一个大苹果，五个小苹果。",
    traditional: "我買了一個大蘋果，五個小蘋果。",
    pinyin: "Wǒ mǎi le yí ge dà píngguǒ, wǔ ge xiǎo píngguǒ.",
    translation: "Tôi đã mua 1 quả táo lớn, 5 quả táo nhỏ.",
    choices: [
      "Tôi đã mua 5 quả táo lớn, 1 quả táo nhỏ.",
      "Tôi đã mua 1 quả táo lớn, 5 quả táo nhỏ.",
      "Tôi đã ăn 1 quả táo lớn và 5 quả táo nhỏ."
    ],
    explanation: "Phát âm: 'Wǒ mǎi le yí ge dà píngguǒ, wǔ ge xiǎo píngguǒ.' dịch nghĩa là 'Tôi đã mua 1 quả táo lớn, 5 quả táo nhỏ.' (大 - dà: to/lớn; 小 - xiǎo: nhỏ/bé)."
  },
  {
    id: "l41",
    level: 1,
    simplified: "今天天气很冷，不下雨。",
    traditional: "今天天氣很冷，不下雨。",
    pinyin: "Jīntiān tiānqì hěn lěng, bú xià yǔ.",
    translation: "Hôm nay thời tiết rất lạnh, không có mưa.",
    choices: [
      "Hôm nay thời tiết rất nóng, có mưa.",
      "Hôm nay thời tiết rất lạnh, không có mưa.",
      "Hôm qua thời tiết rất lạnh, có tuyết."
    ],
    explanation: "Phát âm: 'Jīntiān tiānqì hěn lěng, bú xià yǔ.' dịch nghĩa là 'Hôm nay thời tiết rất lạnh, không có mưa.' (冷 - lěng: lạnh; 不下雨 - bú xià yǔ: không mưa)."
  },
  {
    id: "l42",
    level: 1,
    simplified: "这是我的好朋友，他叫大卫。",
    traditional: "這是我的好朋友，他叫大衛。",
    pinyin: "Zhè shì wǒ de hǎo péngyǒu, tā jiào Dàwèi.",
    translation: "Đây là bạn tốt của tôi, cậu ấy tên là David.",
    choices: [
      "Đây là giáo viên của tôi, thầy ấy tên là David.",
      "Đây là anh trai của tôi, anh ấy tên là David.",
      "Đây là bạn tốt của tôi, cậu ấy tên là David."
    ],
    explanation: "Phát âm: 'Zhè shì wǒ de hǎo péngyǒu, tā jiào Dàwèi.' dịch nghĩa là 'Đây là bạn tốt của tôi, cậu ấy tên là David.' (好朋友 - hǎo péngyǒu: bạn tốt)."
  },
  {
    id: "l43",
    level: 1,
    simplified: "对不起，我明天不能去学校。",
    traditional: "對不起，我明天不能去學校。",
    pinyin: "Duìbùqǐ, wǒ míngtiān bù néng qù xuéxiào.",
    translation: "Xin lỗi, ngày mai tôi không thể đến trường học.",
    choices: [
      "Xin lỗi, hôm nay tôi không thể đến bệnh viện.",
      "Không sao đâu, ngày mai bạn không cần đến trường.",
      "Xin lỗi, ngày mai tôi không thể đến trường học."
    ],
    explanation: "Phát âm: 'Duìbùqǐ, wǒ míngtiān bù néng qù xuéxiào.' dịch nghĩa là 'Xin lỗi, ngày mai tôi không thể đến trường học.' (明天 - míngtiān: ngày mai; 学校 - xuéxiào: trường học)."
  }
"""

last_bracket_idx = content.rfind("];")
if last_bracket_idx != -1:
    new_content = content[:last_bracket_idx] + new_listening + "\n];"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Added 5 new listening items successfully!")
else:
    print("Error: Could not find the closing bracket in listeningData.js")
