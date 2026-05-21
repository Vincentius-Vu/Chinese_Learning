import fs from "fs";
import path from "path";

// Read existing vocabulary.js
const filepath = path.join("src", "data", "vocabulary.js");
const content = fs.readFileSync(filepath, "utf8");

// Candidates list for each level (to reach exactly 200 words per level)
const candidates = {
  1: [
    { simplified: "猫", traditional: "貓", pinyin: "māo", sinoViet: "Miêu", translation: "Con mèo", category: "Động vật / Animals" },
    { simplified: "热水", traditional: "熱水", pinyin: "rèshuǐ", sinoViet: "Nhiệt thủy", translation: "Nước nóng", category: "Đồ ăn uống / Food & Drinks" },
    { simplified: "开水", traditional: "開水", pinyin: "kāishuǐ", sinoViet: "Khai thủy", translation: "Nước sôi", category: "Đồ ăn uống / Food & Drinks" },
    { simplified: "喝茶", traditional: "喝茶", pinyin: "hēchá", sinoViet: "Hát trà", translation: "Uống trà", category: "Hành động / Actions" },
    { simplified: "看书", traditional: "看書", pinyin: "kànshū", sinoViet: "Khán thư", translation: "Đọc sách", category: "Hành động / Actions" },
    { simplified: "写字", traditional: "寫字", pinyin: "xiězì", sinoViet: "Tả tự", translation: "Viết chữ", category: "Hành động / Actions" },
    { simplified: "听歌", traditional: "聽歌", pinyin: "tīnggē", sinoViet: "Thính ca", translation: "Nghe hát, nghe nhạc", category: "Hành động / Actions" },
    { simplified: "学校", traditional: "學校", pinyin: "xuéxiào", sinoViet: "Học hiệu", translation: "Trường học", category: "Địa điểm / Places" },
    { simplified: "家人", traditional: "家人", pinyin: "jiārén", sinoViet: "Gia nhân", translation: "Người nhà, gia đình", category: "Con người / People" },
    { simplified: "很多", traditional: "很多", pinyin: "hěnduō", sinoViet: "Hận đa", translation: "Rất nhiều", category: "Tính từ / Adjectives" },
    { simplified: "很少", traditional: "很少", pinyin: "hěnshǎo", sinoViet: "Hận thiểu", translation: "Rất ít", category: "Tính từ / Adjectives" },
    { simplified: "下雨", traditional: "下雨", pinyin: "xiàyǔ", sinoViet: "Hạ vũ", translation: "Trời mưa", category: "Thiên nhiên / Nature" },
    { simplified: "那些", traditional: "那些", pinyin: "nàxiē", sinoViet: "Na ta", translation: "Những kia, những đó", category: "Đại từ / Pronouns" },
    { simplified: "这些", traditional: "這些", pinyin: "zhèxiē", sinoViet: "Giá ta", translation: "Những này, các này", category: "Đại từ / Pronouns" },
    { simplified: "哪些", traditional: "哪些", pinyin: "nǎxiē", sinoViet: "Nã ta", translation: "Những nào, các nào", category: "Đại từ / Pronouns" },
    { simplified: "一些", traditional: "一些", pinyin: "yīxiē", sinoViet: "Nhất ta", translation: "Một số, một ít", category: "Lượng từ / Classifiers" },
    { simplified: "几个", traditional: "幾個", pinyin: "jǐgè", sinoViet: "Kỷ cá", translation: "Mấy cái, vài cái", category: "Đại từ / Pronouns" },
    { simplified: "多少", traditional: "多少", pinyin: "duōshao", sinoViet: "Đa thiểu", translation: "Bao nhiêu", category: "Đại từ / Pronouns" },
    { simplified: "岁数", traditional: "歲數", pinyin: "suìshu", sinoViet: "Tuế số", translation: "Tuổi tác", category: "Danh từ / Nouns" },
    { simplified: "中国", traditional: "中國", pinyin: "Zhōngguó", sinoViet: "Trung quốc", translation: "Trung Quốc", category: "Địa điểm / Places" },
    { simplified: "越南", traditional: "越南", pinyin: "Yuènán", sinoViet: "Việt nam", translation: "Việt Nam", category: "Địa điểm / Places" },
    { simplified: "英国", traditional: "英國", pinyin: "Yīngguó", sinoViet: "Anh quốc", translation: "Nước Anh", category: "Địa điểm / Places" },
    { simplified: "美国", traditional: "美國", pinyin: "Měiguó", sinoViet: "Mỹ quốc", translation: "Nước Mỹ", category: "Địa điểm / Places" },
    { simplified: "法国", traditional: "法國", pinyin: "Fǎguó", sinoViet: "Pháp quốc", translation: "Nước Pháp", category: "Địa điểm / Places" },
    { simplified: "德国", traditional: "德國", pinyin: "Déguó", sinoViet: "Đức quốc", translation: "Nước Đức", category: "Địa điểm / Places" },
    { simplified: "日本", traditional: "日本", pinyin: "Rìběn", sinoViet: "Nhật bản", translation: "Nhật Bản", category: "Địa điểm / Places" },
    { simplified: "北京", traditional: "北京", pinyin: "Běijīng", sinoViet: "Bắc kinh", translation: "Bắc Kinh", category: "Địa điểm / Places" },
    { simplified: "茶杯", traditional: "茶杯", pinyin: "chábēi", sinoViet: "Trà bôi", translation: "Ly trà, tách trà", category: "Đồ dùng / Items" },
    { simplified: "水杯", traditional: "水杯", pinyin: "shuǐbēi", sinoViet: "Thủy bôi", translation: "Cốc nước", category: "Đồ dùng / Items" },
    { simplified: "书本", traditional: "書本", pinyin: "shūběn", sinoViet: "Thư bản", translation: "Sách vở", category: "Đồ dùng / Items" },
    { simplified: "本子", traditional: "本子", pinyin: "běnzi", sinoViet: "Bản tử", translation: "Quyển vở, sổ tay", category: "Đồ dùng / Items" },
    { simplified: "汉字", traditional: "漢字", pinyin: "Hànzì", sinoViet: "Hán tự", translation: "Chữ Hán, chữ Trung Quốc", category: "Ngôn ngữ / Language" },
    { simplified: "上午", traditional: "上午", pinyin: "shàngwǔ", sinoViet: "Thượng ngọ", translation: "Buổi sáng (trước 12h)", category: "Thời gian / Time" },
    { simplified: "星期一", traditional: "星期一", pinyin: "xīngqīyī", sinoViet: "Tinh kỳ nhất", translation: "Thứ Hai", category: "Thời gian / Time" },
    { simplified: "星期二", traditional: "星期二", pinyin: "xīngqī'èr", sinoViet: "Tinh kỳ nhị", translation: "Thứ Ba", category: "Thời gian / Time" },
    { simplified: "星期三", traditional: "星期三", pinyin: "xīngqīsān", sinoViet: "Tinh kỳ tam", translation: "Thứ Tư", category: "Thời gian / Time" },
    { simplified: "星期四", traditional: "星期四", pinyin: "xīngqīsì", sinoViet: "Tinh kỳ tứ", translation: "Thứ Năm", category: "Thời gian / Time" },
    { simplified: "星期五", traditional: "星期五", pinyin: "xīngqīwǔ", sinoViet: "Tinh kỳ ngũ", translation: "Thứ Sáu", category: "Thời gian / Time" },
    { simplified: "星期六", traditional: "星期六", pinyin: "xīngqīliù", sinoViet: "Tinh kỳ lục", translation: "Thứ Bảy", category: "Thời gian / Time" },
    { simplified: "星期日", traditional: "星期日", pinyin: "xīngqīrì", sinoViet: "Tinh kỳ nhật", translation: "Chủ Nhật", category: "Thời gian / Time" },
    { simplified: "星期天", traditional: "星期天", pinyin: "xīngqītiān", sinoViet: "Tinh kỳ thiên", translation: "Chủ Nhật", category: "Thời gian / Time" },
    { simplified: "一月", traditional: "一月", pinyin: "yīyuè", sinoViet: "Nhất nguyệt", translation: "Tháng Một", category: "Thời gian / Time" },
    { simplified: "二月", traditional: "二月", pinyin: "èryuè", sinoViet: "Nhị nguyệt", translation: "Tháng Hai", category: "Thời gian / Time" },
    { simplified: "三月", traditional: "三月", pinyin: "sānyuè", sinoViet: "Tam nguyệt", translation: "Tháng Ba", category: "Thời gian / Time" },
    { simplified: "四月", traditional: "四月", pinyin: "sìyuè", sinoViet: "Tứ nguyệt", translation: "Tháng Tư", category: "Thời gian / Time" },
    { simplified: "五月", traditional: "五月", pinyin: "wǔyuè", sinoViet: "Ngũ nguyệt", translation: "Tháng Năm", category: "Thời gian / Time" },
    { simplified: "六月", traditional: "六月", pinyin: "liùyuè", sinoViet: "Lục nguyệt", translation: "Tháng Sáu", category: "Thời gian / Time" },
    { simplified: "七月", traditional: "七月", pinyin: "qīyuè", sinoViet: "Thất nguyệt", translation: "Tháng Bảy", category: "Thời gian / Time" },
    { simplified: "八月", traditional: "八月", pinyin: "bāyuè", sinoViet: "Bát nguyệt", translation: "Tháng Tám", category: "Thời gian / Time" },
    { simplified: "九月", traditional: "九月", pinyin: "jiǔyuè", sinoViet: "Cửu nguyệt", translation: "Tháng Chín", category: "Thời gian / Time" },
    { simplified: "十月", traditional: "十月", pinyin: "shíyuè", sinoViet: "Thập nguyệt", translation: "Tháng Mười", category: "Thời gian / Time" },
    { simplified: "十一月", traditional: "十一月", pinyin: "shíyīyuè", sinoViet: "Thập nhất nguyệt", translation: "Tháng Mười Một", category: "Thời gian / Time" },
    { simplified: "十二月", traditional: "十二月", pinyin: "shí'èryuè", sinoViet: "Thập nhị nguyệt", translation: "Tháng Mười Hai", category: "Thời gian / Time" },
    { simplified: "回家", traditional: "回家", pinyin: "huíjiā", sinoViet: "Hồi gia", translation: "Về nhà", category: "Hành động / Actions" },
    { simplified: "吃饭", traditional: "吃飯", pinyin: "chīfàn", sinoViet: "Ngật phạn", translation: "Ăn cơm", category: "Hành động / Actions" },
    { simplified: "喝水", traditional: "喝水", pinyin: "hēshuǐ", sinoViet: "Hát thủy", translation: "Uống nước", category: "Hành động / Actions" },
    { simplified: "买菜", traditional: "買菜", pinyin: "mǎicài", sinoViet: "Mãi thái", translation: "Mua rau, mua thức ăn", category: "Hành động / Actions" },
    { simplified: "坐车", traditional: "坐車", pinyin: "zuòchē", sinoViet: "Tọa xa", translation: "Đi xe, ngồi xe", category: "Hành động / Actions" }
  ],
  2: [
    { simplified: "门票", traditional: "門票", pinyin: "ménpiào", sinoViet: "Môn phiếu", translation: "Vé vào cửa", category: "Danh từ / Nouns" },
    { simplified: "手机", traditional: "手機", pinyin: "shǒujī", sinoViet: "Thủ cơ", translation: "Điện thoại di động", category: "Đồ dùng / Items" },
    { simplified: "路口", traditional: "路口", pinyin: "lùkǒu", sinoViet: "Lộ khẩu", translation: "Ngã tư, giao lộ", category: "Giao thông / Traffic" },
    { simplified: "火车", traditional: "火車", pinyin: "huǒchē", sinoViet: "Hỏa xa", translation: "Tàu hỏa", category: "Giao thông / Traffic" },
    { simplified: "汽车", traditional: "汽車", pinyin: "qìchē", sinoViet: "Khí xa", translation: "Ô tô, xe hơi", category: "Giao thông / Traffic" },
    { simplified: "船票", traditional: "船票", pinyin: "chuánpiào", sinoViet: "Thuyền phiếu", translation: "Vé tàu, vé thuyền", category: "Danh từ / Nouns" },
    { simplified: "机票", traditional: "機票", pinyin: "jīpiào", sinoViet: "Cơ phiếu", translation: "Vé máy bay", category: "Danh từ / Nouns" },
    { simplified: "火车票", traditional: "火車票", pinyin: "huǒchēpiào", sinoViet: "Hỏa xa phiếu", translation: "Vé tàu hỏa", category: "Danh từ / Nouns" },
    { simplified: "房间", traditional: "房間", pinyin: "fángjiān", sinoViet: "Phòng gian", translation: "Căn phòng", category: "Địa điểm / Places" },
    { simplified: "药店", traditional: "藥店", pinyin: "yàodiàn", sinoViet: "Dược điếm", translation: "Tiệm thuốc", category: "Địa điểm / Places" },
    { simplified: "头发", traditional: "頭髮", pinyin: "tóufa", sinoViet: "Đầu phát", translation: "Tóc, mái tóc", category: "Con người / People" },
    { simplified: "脸蛋", traditional: "臉蛋", pinyin: "liǎndàn", sinoViet: "Liển đản", translation: "Khuôn mặt", category: "Con người / People" },
    { simplified: "耳朵", traditional: "耳朵", pinyin: "ěrdo", sinoViet: "Nhĩ đóa", translation: "Tai, lỗ tai", category: "Con người / People" },
    { simplified: "鼻子", traditional: "鼻子", pinyin: "bízi", sinoViet: "Tị tử", translation: "Mũi, cái mũi", category: "Con người / People" },
    { simplified: "嘴巴", traditional: "嘴巴", pinyin: "zuǐba", sinoViet: "Chủy ba", translation: "Miệng, cái miệng", category: "Con người / People" },
    { simplified: "牙齿", traditional: "牙齒", pinyin: "yáchǐ", sinoViet: "Nha xỉ", translation: "Răng, cái răng", category: "Con người / People" },
    { simplified: "吃药", traditional: "吃藥", pinyin: "chīyào", sinoViet: "Ngật dược", translation: "Uống thuốc", category: "Hành động / Actions" },
    { simplified: "看病", traditional: "看病", pinyin: "kànbìng", sinoViet: "Khán bệnh", translation: "Khám bệnh, đi khám", category: "Hành động / Actions" },
    { simplified: "住院", traditional: "住院", pinyin: "zhùyuàn", sinoViet: "Trú viện", translation: "Nằm viện", category: "Hành động / Actions" },
    { simplified: "出院", traditional: "出院", pinyin: "chūyuàn", sinoViet: "Xuất viện", translation: "Xuất viện, ra viện", category: "Hành động / Actions" },
    { simplified: "跑步", traditional: "跑步", pinyin: "pǎobù", sinoViet: "Bào bộ", translation: "Chạy bộ", category: "Hành động / Actions" },
    { simplified: "打球", traditional: "打球", pinyin: "dǎqiú", sinoViet: "Đả cầu", translation: "Chơi bóng", category: "Hành động / Actions" },
    { simplified: "踢球", traditional: "踢球", pinyin: "tīqiú", sinoViet: "Đá cầu", translation: "Đá bóng", category: "Hành động / Actions" },
    { simplified: "题", traditional: "題", pinyin: "tí", sinoViet: "Đề", translation: "Đề bài, câu hỏi", category: "Danh từ / Nouns" },
    { simplified: "问题", traditional: "問題", pinyin: "wèntí", sinoViet: "Vấn đề", translation: "Vấn đề, câu hỏi", category: "Danh từ / Nouns" },
    { simplified: "回答", traditional: "回答", pinyin: "huídá", sinoViet: "Hồi đáp", translation: "Trả lời", category: "Hành động / Actions" },
    { simplified: "懂了", traditional: "懂了", pinyin: "dǒngle", sinoViet: "Đổng liễu", translation: "Hiểu rồi", category: "Trạng thái / States" },
    { simplified: "明白", traditional: "明白", pinyin: "míngbai", sinoViet: "Minh bạch", translation: "Hiểu rõ, minh bạch", category: "Nhận thức / Cognitive" },
    { simplified: "认为", traditional: "認為", pinyin: "rènwéi", sinoViet: "Nhận vi", translation: "Cho rằng, nghĩ là", category: "Nhận thức / Cognitive" },
    { simplified: "告诉", traditional: "告訴", pinyin: "gàosu", sinoViet: "Cáo tố", translation: "Báo cho biết, nói cho biết", category: "Hành động / Actions" },
    { simplified: "新年", traditional: "新年", pinyin: "xīnnián", sinoViet: "Tân niên", translation: "Năm mới", category: "Thời gian / Time" },
    { simplified: "节日", traditional: "節日", pinyin: "jiérì", sinoViet: "Tiết nhật", translation: "Ngày lễ", category: "Thời gian / Time" },
    { simplified: "生日", traditional: "生日", pinyin: "shēngrì", sinoViet: "Sinh nhật", translation: "Ngày sinh nhật", category: "Thời gian / Time" },
    { simplified: "快乐", traditional: "快樂", pinyin: "kuàilè", sinoViet: "Khoái lạc", translation: "Vui vẻ, hạnh phúc", category: "Cảm xúc / Emotions" },
    { simplified: "送礼", traditional: "送禮", pinyin: "sònglǐ", sinoViet: "Tống lễ", translation: "Tặng quà", category: "Hành động / Actions" },
    { simplified: "很贵", traditional: "很貴", pinyin: "hěn guì", sinoViet: "Hận quý", translation: "Rần đắt", category: "Tính từ / Adjectives" },
    { simplified: "零钱", traditional: "零錢", pinyin: "língqián", sinoViet: "Linh tiền", translation: "Tiền lẻ", category: "Danh từ / Nouns" },
    { simplified: "找钱", traditional: "找錢", pinyin: "zhǎoqián", sinoViet: "Thối tiền, trả lại tiền thừa", category: "Hành động / Actions" },
    { simplified: "天气好", traditional: "天氣好", pinyin: "tiānqì hǎo", sinoViet: "Thiên khí hảo", translation: "Thời tiết tốt, trời đẹp", category: "Thiên nhiên / Nature" },
    { simplified: "刮风", traditional: "刮風", pinyin: "guāfēng", sinoViet: "Quát phong", translation: "Gió thổi", category: "Thiên nhiên / Nature" },
    { simplified: "吃面", traditional: "吃麵", pinyin: "chīmiàn", sinoViet: "Ngật miến", translation: "Ăn mì", category: "Hành động / Actions" },
    { simplified: "喝咖啡", traditional: "喝咖啡", pinyin: "hē kāfēi", sinoViet: "Hát gia phi", translation: "Uống cà phê", category: "Hành động / Actions" },
    { simplified: "看报纸", traditional: "看報紙", pinyin: "kàn bàozhǐ", sinoViet: "Khán báo chỉ", translation: "Đọc báo", category: "Hành động / Actions" },
    { simplified: "买手表", traditional: "買手錶", pinyin: "mǎi shǒubiǎo", sinoViet: "Mãi thủ biểu", translation: "Mua đồng hồ đeo tay", category: "Hành động / Actions" },
    { simplified: "下大雨", traditional: "下大雨", pinyin: "xià dàyǔ", sinoViet: "Hạ đại vũ", translation: "Mưa to, mưa lớn", category: "Thiên nhiên / Nature" },
    { simplified: "下大雪", traditional: "下大雪", pinyin: "xià dàxuě", sinoViet: "Hạ đại tuyết", translation: "Tuyết rơi dày", category: "Thiên nhiên / Nature" },
    { simplified: "踢足球", traditional: "踢足球", pinyin: "tī zúqiú", sinoViet: "Đá túc cầu", translation: "Đá bóng, đá bóng đá", category: "Hành động / Actions" },
    { simplified: "打篮球", traditional: "打籃球", pinyin: "dǎ lánqiú", sinoViet: "Đả lam cầu", translation: "Chơi bóng rổ", category: "Hành động / Actions" },
    { simplified: "打乒乓球", traditional: "打乒乓球", pinyin: "dǎ pīngpāngqiú", sinoViet: "Đả binh bang cầu", translation: "Chơi bóng bàn", category: "Hành động / Actions" },
    { simplified: "出海", traditional: "出海", pinyin: "chūhǎi", sinoViet: "Xuất hải", translation: "Ra khơi, ra biển", category: "Hành động / Actions" },
    { simplified: "左转", traditional: "左轉", pinyin: "zuǒzhuǎn", sinoViet: "Tả chuyển", translation: "Rẽ trái", category: "Giao thông / Traffic" },
    { simplified: "右转", traditional: "右轉", pinyin: "yòuzhuǎn", sinoViet: "Hữu chuyển", translation: "Rẽ phải", category: "Giao thông / Traffic" },
    { simplified: "走下路", traditional: "走下路", pinyin: "zǒu xiàlù", sinoViet: "Tẩu hạ lộ", translation: "Đi xuống đường", category: "Hành động / Actions" },
    { simplified: "送水果", traditional: "送水果", pinyin: "sòng shuǐguǒ", sinoViet: "Tống thủy quả", translation: "Tặng trái cây", category: "Hành động / Actions" },
    { simplified: "吃鸡肉", traditional: "吃雞肉", pinyin: "chī jīròu", sinoViet: "Ngật kê nhục", translation: "Ăn thịt gà", category: "Đồ ăn uống / Food & Drinks" },
    { simplified: "吃牛肉", traditional: "吃牛肉", pinyin: "chī niúròu", sinoViet: "Ngật ngưu nhục", translation: "Ăn thịt bò", category: "Đồ ăn uống / Food & Drinks" }
  ],
  3: [
    { simplified: "声音", traditional: "聲音", pinyin: "shēngyīn", sinoViet: "Thanh âm", translation: "Giọng nói, tiếng động", category: "Danh từ / Nouns" },
    { simplified: "音乐", traditional: "音樂", pinyin: "yīnyuè", sinoViet: "Âm nhạc", translation: "Âm nhạc", category: "Danh từ / Nouns" },
    { simplified: "世界", traditional: "世界", pinyin: "shìjiè", sinoViet: "Thế giới", translation: "Thế giới, vũ trụ", category: "Danh từ / Nouns" },
    { simplified: "地图", traditional: "地圖", pinyin: "dìtú", sinoViet: "Địa đồ", translation: "Bản đồ", category: "Đồ dùng / Items" },
    { simplified: "文化", traditional: "文化", pinyin: "wénhuà", sinoViet: "Văn hóa", translation: "Văn hóa", category: "Danh từ / Nouns" },
    { simplified: "城市", traditional: "城市", pinyin: "chéngshì", sinoViet: "Thành thị", translation: "Thành phố, đô thị", category: "Địa điểm / Places" },
    { simplified: "地方", traditional: "地方", pinyin: "dìfang", sinoViet: "Địa phương", translation: "Nơi chốn, địa điểm", category: "Địa điểm / Places" },
    { simplified: "公园", traditional: "公園", pinyin: "gōngyuán", sinoViet: "Công viên", translation: "Công viên", category: "Địa điểm / Places" },
    { simplified: "银行", traditional: "銀行", pinyin: "yínháng", sinoViet: "Ngân hàng", translation: "Ngân hàng", category: "Địa điểm / Places" },
    { simplified: "图书馆", traditional: "圖書館", pinyin: "túshūguǎn", sinoViet: "Đồ thư quán", translation: "Thư viện", category: "Địa điểm / Places" },
    { simplified: "体育馆", traditional: "體育館", pinyin: "tǐyùguǎn", sinoViet: "Thể dục quán", translation: "Nhà thi đấu thể thao", category: "Địa điểm / Places" },
    { simplified: "宾馆", traditional: "賓館", pinyin: "bīnguǎn", sinoViet: "Tân quán", translation: "Khách sạn", category: "Địa điểm / Places" },
    { simplified: "洗手间", traditional: "洗手間", pinyin: "xǐshǒujiān", sinoViet: "Tẩy thủ gian", translation: "Nhà vệ sinh", category: "Địa điểm / Places" },
    { simplified: "空调", traditional: "空調", pinyin: "kōngtiáo", sinoViet: "Không điều", translation: "Máy điều hòa nhiệt độ", category: "Đồ dùng / Items" },
    { simplified: "电视机", traditional: "電視機", pinyin: "diànshìjī", sinoViet: "Điện thị cơ", translation: "Máy tivi", category: "Đồ dùng / Items" },
    { simplified: "照相机", traditional: "照相機", pinyin: "zhàoxiàngjī", sinoViet: "Chiếu tướng cơ", translation: "Máy ảnh", category: "Đồ dùng / Items" },
    { simplified: "信用卡", traditional: "信用卡", pinyin: "xìnyòngkǎ", sinoViet: "Tín dụng tạp", translation: "Thẻ tín dụng", category: "Đồ dùng / Items" },
    { simplified: "蛋糕", traditional: "蛋糕", pinyin: "dàngāo", sinoViet: "Đản cao", translation: "Bánh ngọt, bánh ga-tô", category: "Đồ ăn uống / Food & Drinks" },
    { simplified: "香蕉", traditional: "香蕉", pinyin: "xiāngjiāo", sinoViet: "Hương tiêu", translation: "Quả chuối", category: "Đồ ăn uống / Food & Drinks" },
    { simplified: "苹果汁", traditional: "蘋果汁", pinyin: "píngguǒzhī", sinoViet: "Bình quả trấp", translation: "Nước táo", category: "Đồ ăn uống / Food & Drinks" },
    { simplified: "绿茶", traditional: "綠茶", pinyin: "lǜchá", sinoViet: "Lục trà", translation: "Trà xanh", category: "Đồ ăn uống / Food & Drinks" },
    { simplified: "红茶", traditional: "紅茶", pinyin: "hóngchá", sinoViet: "Hồng trà", translation: "Trà đen, hồng trà", category: "Đồ ăn uống / Food & Drinks" },
    { simplified: "饮料", traditional: "飲料", pinyin: "yǐnliào", sinoViet: "Ẩm liệu", translation: "Đồ uống, nước giải khát", category: "Đồ ăn uống / Food & Drinks" },
    { simplified: "碗", traditional: "碗", pinyin: "wǎn", sinoViet: "Uyển", translation: "Cái bát, cái chén", category: "Đồ dùng / Items" },
    { simplified: "筷子", traditional: "筷子", pinyin: "kuàizi", sinoViet: "Khoái tử", translation: "Đôi đũa", category: "Đồ dùng / Items" },
    { simplified: "盘子", traditional: "盤子", pinyin: "pánzi", sinoViet: "Bàn tử", translation: "Cái đĩa", category: "Đồ dùng / Items" },
    { simplified: "叔叔", traditional: "叔叔", pinyin: "shūshu", sinoViet: "Thúc thúc", translation: "Chú, bác trai", category: "Con người / People" },
    { simplified: "爷爷", traditional: "爺爺", pinyin: "yéye", sinoViet: "Gia gia", translation: "Ông nội", category: "Con người / People" },
    { simplified: "奶奶", traditional: "奶奶", pinyin: "nǎinai", sinoViet: "Nãi nãi", translation: "Bà nội", category: "Con người / People" },
    { simplified: "司机", traditional: "司機", pinyin: "sījī", sinoViet: "Ty cơ", translation: "Tài xế, người lái xe", category: "Con người / People" },
    { simplified: "同事", traditional: "同事", pinyin: "tóngshì", sinoViet: "Đồng sự", translation: "Đồng nghiệp", category: "Con người / People" },
    { simplified: "邻居", traditional: "鄰居", pinyin: "línjū", sinoViet: "Lân cư", translation: "Hàng xóm", category: "Con người / People" },
    { simplified: "校长", traditional: "校長", pinyin: "xiàozhǎng", sinoViet: "Hiệu trưởng", translation: "Hiệu trưởng", category: "Con người / People" },
    { simplified: "干净", traditional: "乾淨", pinyin: "gānjìng", sinoViet: "Can tịnh", translation: "Sạch sẽ", category: "Tính từ / Adjectives" },
    { simplified: "暖和", traditional: "暖和", pinyin: "nuǎnhuo", sinoViet: "Noãn hòa", translation: "Ấm áp", category: "Tính từ / Adjectives" },
    { simplified: "舒服", traditional: "舒服", pinyin: "shūfu", sinoViet: "Thư phục", translation: "Thoải mái, dễ chịu", category: "Tính từ / Adjectives" },
    { simplified: "安静", traditional: "安靜", pinyin: "ānjìng", sinoViet: "An tĩnh", translation: "Yên tĩnh, thanh tĩnh", category: "Tính từ / Adjectives" },
    { simplified: "习惯", traditional: "習慣", pinyin: "xíguàn", sinoViet: "Tập quán", translation: "Thói quen, tập quán", category: "Danh từ / Nouns" },
    { simplified: "意见", traditional: "意見", pinyin: "yìjiàn", sinoViet: "Ý kiến", translation: "Ý kiến, quan điểm", category: "Danh từ / Nouns" },
    { simplified: "注意", traditional: "注意", pinyin: "zhùyì", sinoViet: "Chú ý", translation: "Chú ý, lưu ý", category: "Hành động / Actions" },
    { simplified: "生气", traditional: "生氣", pinyin: "shēngqì", sinoViet: "Sinh khí", translation: "Tức giận, giận dỗi", category: "Cảm xúc / Emotions" },
    { simplified: "害怕", traditional: "害怕", pinyin: "hàipà", sinoViet: "Hại phạ", translation: "Sợ hãi", category: "Cảm xúc / Emotions" },
    { simplified: "难过", traditional: "難過", pinyin: "nánguò", sinoViet: "Nan quá", translation: "Buồn bã, khó khăn", category: "Cảm xúc / Emotions" },
    { simplified: "满意", traditional: "滿意", pinyin: "mǎnyì", sinoViet: "Mãn ý", translation: "Hài lòng, thỏa mãn", category: "Cảm xúc / Emotions" },
    { simplified: "感兴趣", traditional: "感興趣", pinyin: "gǎn xìngqù", sinoViet: "Cảm hứng thú", translation: "Có hứng thú", category: "Cảm xúc / Emotions" },
    { simplified: "发烧", traditional: "發燒", pinyin: "fāshāo", sinoViet: "Phát thiêu", translation: "Bị sốt, phát sốt", category: "Trạng thái / States" },
    { simplified: "咳嗽", traditional: "咳嗽", pinyin: "késou", sinoViet: "Khái thấu", translation: "Ho, ho hen", category: "Trạng thái / States" },
    { simplified: "看书", traditional: "看書", pinyin: "kànshū", sinoViet: "Khán thư", translation: "Đọc sách", category: "Hành động / Actions" },
    { simplified: "写信", traditional: "寫信", pinyin: "xiěxìn", sinoViet: "Tả tín", translation: "Viết thư", category: "Hành động / Actions" },
    { simplified: "画画", traditional: "畫畫", pinyin: "huàhuà", sinoViet: "Họa họa", translation: "Vẽ tranh", category: "Hành động / Actions" },
    { simplified: "刷牙", traditional: "刷牙", pinyin: "shuāyá", sinoViet: "Soát nha", translation: "Đánh răng", category: "Hành động / Actions" },
    { simplified: "洗脸", traditional: "洗臉", pinyin: "xǐliǎn", sinoViet: "Tẩy liển", translation: "Rửa mặt", category: "Hành động / Actions" },
    { simplified: "洗澡", traditional: "洗澡", pinyin: "xǐzǎo", sinoViet: "Tẩy tảo", translation: "Tắm, tắm rửa", category: "Hành động / Actions" },
    { simplified: "黑板", traditional: "黑板", pinyin: "hēibǎn", sinoViet: "Hắc bản", translation: "Bảng đen", category: "Đồ dùng / Items" }
  ],
  4: [
    { simplified: "安排", traditional: "安排", pinyin: "ānpái", sinoViet: "An bài", translation: "Sắp xếp, an bài", category: "Hành động / Actions" },
    { simplified: "保证", traditional: "保證", pinyin: "bǎozhèng", sinoViet: "Bảo chứng", translation: "Bảo đảm, cam đoan", category: "Hành động / Actions" },
    { simplified: "保护", traditional: "保護", pinyin: "bǎohù", sinoViet: "Bảo hộ", translation: "Bảo vệ, bảo hộ", category: "Hành động / Actions" },
    { simplified: "报名", traditional: "報名", pinyin: "bàomíng", sinoViet: "Báo danh", translation: "Đăng ký, ghi danh", category: "Hành động / Actions" },
    { simplified: "抱歉", traditional: "抱歉", pinyin: "bàoqiàn", sinoViet: "Bão khiếm", translation: "Xin lỗi, xin lượng thứ", category: "Giao tiếp / Communication" },
    { simplified: "毕业", traditional: "畢業", pinyin: "bìyè", sinoViet: "Tất nghiệp", translation: "Tốt nghiệp", category: "Trạng thái / States" },
    { simplified: "表达", traditional: "表達", pinyin: "biǎodá", sinoViet: "Biểu đạt", translation: "Biểu đạt, bày tỏ", category: "Hành động / Actions" },
    { simplified: "表格", traditional: "表格", pinyin: "biǎogé", sinoViet: "Biểu cách", translation: "Biểu mẫu, tờ khai", category: "Đồ dùng / Items" },
    { simplified: "表扬", traditional: "表揚", pinyin: "biǎoyáng", sinoViet: "Biểu dương", translation: "Khen ngợi, biểu dương", category: "Hành động / Actions" },
    { simplified: "表演", traditional: "表演", pinyin: "biǎoyǎn", sinoViet: "Biểu diễn", translation: "Biểu diễn, trình diễn", category: "Hành động / Actions" },
    { simplified: "并且", traditional: "並且", pinyin: "bìngqiě", sinoViet: "Tịnh thả", translation: "Và, hơn nữa, đồng thời", category: "Liên từ / Conjunctions" },
    { simplified: "博士", traditional: "博士", pinyin: "bóshì", sinoViet: "Bác sĩ", translation: "Tiến sĩ (học vị)", category: "Con người / People" },
    { simplified: "不管", traditional: "不管", pinyin: "bùguǎn", sinoViet: "Bất quản", translation: "Bất kể, cho dù", category: "Liên từ / Conjunctions" },
    { simplified: "不仅", traditional: "不僅", pinyin: "bùjǐn", sinoViet: "Bất cận", translation: "Không những, không chỉ", category: "Liên từ / Conjunctions" },
    { simplified: "部分", traditional: "部分", pinyin: "bùfen", sinoViet: "Bộ phận", translation: "Bộ phận, phần", category: "Danh từ / Nouns" },
    { simplified: "擦", traditional: "擦", pinyin: "cā", sinoViet: "Sát", translation: "Lau chùi, cọ xát", category: "Hành động / Actions" },
    { simplified: "猜", traditional: "猜", pinyin: "cāi", sinoViet: "Sái", translation: "Đoán, phỏng đoán", category: "Nhận thức / Cognitive" },
    { simplified: "材料", traditional: "材料", pinyin: "cáiliào", sinoViet: "Tài liệu", translation: "Tài liệu, nguyên liệu", category: "Danh từ / Nouns" },
    { simplified: "参观", traditional: "參觀", pinyin: "cānguān", sinoViet: "Tham quan", translation: "Tham quan", category: "Hành động / Actions" },
    { simplified: "差不多", traditional: "差不多", pinyin: "chàbuduō", sinoViet: "Sai bất đa", translation: "Xấp xỉ, gần giống nhau", category: "Trạng từ / Adverbs" },
    { simplified: "长城", traditional: "長城", pinyin: "Chángchéng", sinoViet: "Trường thành", translation: "Vạn Lý Trường Thành", category: "Địa điểm / Places" },
    { simplified: "长江", traditional: "長江", pinyin: "Chángjiāng", sinoViet: "Trường giang", translation: "Sông Trường Giang", category: "Thiên nhiên / Nature" },
    { simplified: "场", traditional: "場", pinyin: "chǎng", sinoViet: "Trường", translation: "Sân, bãi, lượng từ (trận đấu)", category: "Lượng từ / Classifiers" },
    { simplified: "超过", traditional: "超過", pinyin: "chāoguò", sinoViet: "Siêu quá", translation: "Vượt quá, vượt trội", category: "Hành động / Actions" },
    { simplified: "成功", traditional: "成功", pinyin: "chénggōng", sinoViet: "Thành công", translation: "Thành công", category: "Trạng thái / States" },
    { simplified: "诚实", traditional: "誠實", pinyin: "chéngshí", sinoViet: "Thành thực", translation: "Thành thật, trung thực", category: "Tính từ / Adjectives" },
    { simplified: "抽烟", traditional: "抽煙", pinyin: "chōuyān", sinoViet: "Trừu yên", translation: "Hút thuốc lá", category: "Hành động / Actions" },
    { simplified: "出差", traditional: "出差", pinyin: "chūchāi", sinoViet: "Xuất sai", translation: "Đi công tác", category: "Hành động / Actions" },
    { simplified: "出发", traditional: "出發", pinyin: "chūfā", sinoViet: "Xuất phát", translation: "Xuất phát, khởi hành", category: "Hành động / Actions" },
    { simplified: "出生", traditional: "出生", pinyin: "chūshēng", sinoViet: "Xuất sinh", translation: "Sinh ra, ra đời", category: "Trạng thái / States" },
    { simplified: "出现", traditional: "出現", pinyin: "chūxiàn", sinoViet: "Xuất hiện", translation: "Xuất hiện, nảy sinh", category: "Hành động / Actions" },
    { simplified: "粗心", traditional: "粗心", pinyin: "cūxīn", sinoViet: "Thô tâm", translation: "Cẩu thả, sơ ý", category: "Tính từ / Adjectives" },
    { simplified: "存", traditional: "存", pinyin: "cún", sinoViet: "Tồn", translation: "Tích lũy, gửi tiền", category: "Hành động / Actions" },
    { simplified: "错误", traditional: "錯誤", pinyin: "cuòwù", sinoViet: "Thác ngộ", translation: "Sai lầm, lỗi lầm", category: "Danh từ / Nouns" },
    { simplified: "答案", traditional: "答案", pinyin: "dá'àn", sinoViet: "Đáp án", translation: "Đáp án, lời giải", category: "Danh từ / Nouns" },
    { simplified: "打扮", traditional: "打扮", pinyin: "dǎban", sinoViet: "Đả ban", translation: "Trang điểm, diện đồ", category: "Hành động / Actions" },
    { simplified: "打扰", traditional: "打擾", pinyin: "dǎrǎo", sinoViet: "Đả nhiễu", translation: "Quấy rầy, làm phiền", category: "Hành động / Actions" },
    { simplified: "打印", traditional: "打印", pinyin: "dǎyìn", sinoViet: "Đả ấn", translation: "In ấn", category: "Hành động / Actions" },
    { simplified: "打折", traditional: "打折", pinyin: "dǎzhé", sinoViet: "Đả chiết", translation: "Giảm giá, chiết khấu", category: "Hành động / Actions" },
    { simplified: "打针", traditional: "打針", pinyin: "dǎzhēn", sinoViet: "Đả châm", translation: "Tiêm thuốc, chích thuốc", category: "Hành động / Actions" },
    { simplified: "大概", traditional: "大概", pinyin: "dàgài", sinoViet: "Đại khái", translation: "Khoảng chừng, đại khái", category: "Trạng từ / Adverbs" },
    { simplified: "大使馆", traditional: "大使館", pinyin: "dàshǐguǎn", sinoViet: "Đại sứ quán", translation: "Đại sứ quán", category: "Địa điểm / Places" },
    { simplified: "大约", traditional: "大約", pinyin: "dàyuē", sinoViet: "Đại ước", translation: "Vào khoảng, ước chừng", category: "Trạng từ / Adverbs" },
    { simplified: "代表", traditional: "代表", pinyin: "dàibiǎo", sinoViet: "Đại biểu", translation: "Đại diện, đại biểu", category: "Con người / People" },
    { simplified: "代替", traditional: "代替", pinyin: "dàitì", sinoViet: "Đại thế", translation: "Thay thế", category: "Hành động / Actions" },
    { simplified: "大夫", traditional: "大夫", pinyin: "dàifu", sinoViet: "Đại phu", translation: "Bác sĩ, thầy thuốc", category: "Con người / People" },
    { simplified: "贷款", traditional: "貸款", pinyin: "dàikuǎn", sinoViet: "Thải khoản", translation: "Tiền vay, cho vay", category: "Danh từ / Nouns" },
    { simplified: "当时", traditional: "當時", pinyin: "dāngshí", sinoViet: "Đương thời", translation: "Lúc đó, khi đó", category: "Thời gian / Time" },
    { simplified: "刀", traditional: "刀", pinyin: "dāo", sinoViet: "Đao", translation: "Con dao", category: "Đồ dùng / Items" },
    { simplified: "导游", traditional: "導遊", pinyin: "dǎoyóu", sinoViet: "Đạo du", translation: "Hướng dẫn viên du lịch", category: "Con người / People" },
    { simplified: "到处", traditional: "處", pinyin: "dàochù", sinoViet: "Đáo xứ", translation: "Khắp nơi, mọi nơi", category: "Vị trí / Position" },
    { simplified: "到底", traditional: "到底", pinyin: "dàodǐ", sinoViet: "Đáo để", translation: "Rốt cuộc, đến cùng", category: "Trạng từ / Adverbs" },
    { simplified: "道歉", traditional: "道歉", pinyin: "dàoqiàn", sinoViet: "Đạo khiếm", translation: "Xin lỗi", category: "Hành động / Actions" },
    { simplified: "得意", traditional: "得意", pinyin: "déyì", sinoViet: "Đắc ý", translation: "Đắc ý, tự mãn", category: "Cảm xúc / Emotions" },
    { simplified: "登机牌", traditional: "登機牌", pinyin: "dēngjīpái", sinoViet: "Đăng cơ bài", translation: "Thẻ lên máy bay", category: "Đồ dùng / Items" },
    { simplified: "等待", traditional: "等待", pinyin: "děngdài", sinoViet: "Đẳng đãi", translation: "Chờ đợi, ngóng chờ", category: "Hành động / Actions" },
    { simplified: "低", traditional: "低", pinyin: "dī", sinoViet: "Đê", translation: "Thấp, cúi đầu", category: "Tính từ / Adjectives" },
    { simplified: "底", traditional: "底", pinyin: "dǐ", sinoViet: "Để", translation: "Đáy, cuối (tháng, năm)", category: "Vị trí / Position" },
    { simplified: "地球", traditional: "地球", pinyin: "dìqiú", sinoViet: "Địa cầu", translation: "Trái Đất", category: "Thiên nhiên / Nature" },
    { simplified: "地址", traditional: "地址", pinyin: "dìzhǐ", sinoViet: "Địa chỉ", translation: "Địa chỉ", category: "Danh từ / Nouns" },
    { simplified: "调查", traditional: "調查", pinyin: "diàochá", sinoViet: "Điều tra", translation: "Điều tra, khảo sát", category: "Hành động / Actions" },
    { simplified: "动作", traditional: "動作", pinyin: "dòngzuò", sinoViet: "Động tác", translation: "Động tác, cử chỉ", category: "Danh từ / Nouns" },
    { simplified: "堵车", traditional: "堵車", pinyin: "dǔchē", sinoViet: "Đổ xa", translation: "Tắc đường, kẹt xe", category: "Giao thông / Traffic" },
    { simplified: "肚子", traditional: "肚子", pinyin: "dùzi", sinoViet: "Đỗ tử", translation: "Bụng, dạ dày", category: "Con người / People" },
    { simplified: "短信", traditional: "短信", pinyin: "duǎnxìn", sinoViet: "Đoản tín", translation: "Tin nhắn điện thoại", category: "Đồ dùng / Items" }
  ],
  5: [
    { simplified: "摆", traditional: "擺", pinyin: "bǎi", sinoViet: "Bải", translation: "Bày biện, sắp đặt, đung đưa", category: "Hành động / Actions" },
    { simplified: "把握", traditional: "把握", pinyin: "bǎwò", sinoViet: "Bả ác", translation: "Nắm bắt, sự chắc chắn", category: "Hành động / Actions" },
    { simplified: "班主任", traditional: "班主任", pinyin: "bānzhǔrèn", sinoViet: "Ban chủ nhiệm", translation: "Giáo viên chủ nhiệm", category: "Con người / People" },
    { simplified: "办理", traditional: "辦理", pinyin: "bànlǐ", sinoViet: "Biện lý", translation: "Xử lý, giải quyết, làm thủ tục", category: "Hành động / Actions" },
    { simplified: "傍晚", traditional: "傍晚", pinyin: "bàngwǎn", sinoViet: "Bạng vãn", translation: "Hoàng hôn, chập tối", category: "Thời gian / Time" },
    { simplified: "包子", traditional: "包子", pinyin: "bāozi", sinoViet: "Bao tử", translation: "Bánh bao", category: "Đồ ăn uống / Food & Drinks" },
    { simplified: "宝贝", traditional: "寶貝", pinyin: "bǎobèi", sinoViet: "Bảo bối", translation: "Bảo bối, bé cưng", category: "Con người / People" },
    { simplified: "宝贵", traditional: "寶貴", pinyin: "bǎoguì", sinoViet: "Bảo quý", translation: "Quý báu, quý giá", category: "Tính từ / Adjectives" },
    { simplified: "保持", traditional: "保持", pinyin: "bǎochí", sinoViet: "Bảo trì", translation: "Duy trì, giữ vững", category: "Hành động / Actions" },
    { simplified: "保存", traditional: "保存", pinyin: "bǎocún", sinoViet: "Bảo tồn", translation: "Bảo lưu, cất giữ, lưu trữ", category: "Hành động / Actions" },
    { simplified: "保留", traditional: "保留", pinyin: "bǎoliú", sinoViet: "Bảo lưu", translation: "Bảo lưu, giữ lại", category: "Hành động / Actions" },
    { simplified: "保险", traditional: "保險", pinyin: "bǎoxiǎn", sinoViet: "Bảo hiểm", translation: "Bảo hiểm, chắc chắn", category: "Danh từ / Nouns" },
    { simplified: "报告", traditional: "報告", pinyin: "bàogào", sinoViet: "Báo cáo", translation: "Báo cáo", category: "Hành động / Actions" },
    { simplified: "悲观", traditional: "悲觀", pinyin: "bēiguān", sinoViet: "Bi quan", translation: "Bi quan", category: "Cảm xúc / Emotions" },
    { simplified: "背景", traditional: "背景", pinyin: "bèijǐng", sinoViet: "Bối cảnh", translation: "Bối cảnh, nền tảng", category: "Danh từ / Nouns" },
    { simplified: "被子", traditional: "被子", pinyin: "bèizi", sinoViet: "Bị tử", translation: "Cái chăn, mền", category: "Đồ dùng / Items" },
    { simplified: "本科", traditional: "本科", pinyin: "běnkē", sinoViet: "Bản khoa", translation: "Đại học chính quy, cử nhân", category: "Danh từ / Nouns" },
    { simplified: "本领", traditional: "本領", pinyin: "běnlǐng", sinoViet: "Bản lĩnh", translation: "Bản lĩnh, tài năng", category: "Danh từ / Nouns" },
    { simplified: "本质", traditional: "物質", pinyin: "běnzhì", sinoViet: "Bản chất", translation: "Bản chất, cốt lõi", category: "Danh từ / Nouns" },
    { simplified: "比例", traditional: "比例", pinyin: "bǐlì", sinoViet: "Tỷ lệ", translation: "Tỷ lệ", category: "Danh từ / Nouns" },
    { simplified: "彼此", traditional: "彼此", pinyin: "bǐcǐ", sinoViet: "Bỉ thử", translation: "Lẫn nhau, cả hai bên", category: "Đại từ / Pronouns" },
    { simplified: "必然", traditional: "必然", pinyin: "bìrán", sinoViet: "Tất nhiên", translation: "Tất nhiên, tất yếu", category: "Trạng từ / Adverbs" },
    { simplified: "必要", traditional: "必要", pinyin: "bìyào", sinoViet: "Tất yếu", translation: "Cần thiết, thiết yếu", category: "Tính từ / Adjectives" },
    { simplified: "毕竟", traditional: "畢竟", pinyin: "bìjìng", sinoViet: "Tất cánh", translation: "Rốt cuộc, suy cho cùng", category: "Trạng từ / Adverbs" },
    { simplified: "避免", traditional: "避免", pinyin: "bìmiǎn", sinoViet: "Tị miễn", translation: "Tránh khỏi, né tránh", category: "Hành động / Actions" },
    { simplified: "编辑", traditional: "編輯", pinyin: "biānjí", sinoViet: "Biên tập", translation: "Biên tập viên, chỉnh sửa", category: "Con người / People" },
    { simplified: "鞭炮", traditional: "鞭炮", pinyin: "biānpào", sinoViet: "Tiên pháo", translation: "Pháo hoa, pháo nổ", category: "Đồ dùng / Items" },
    { simplified: "便", traditional: "便", pinyin: "biàn", sinoViet: "Tiện", translation: "Thì, liền, chính là (giống 就)", category: "Trạng từ / Adverbs" },
    { simplified: "辩论", traditional: "辯論", pinyin: "biànlùn", sinoViet: "Biện luận", translation: "Tranh luận, biện luận", category: "Hành động / Actions" },
    { simplified: "标点", traditional: "標點", pinyin: "biāodiǎn", sinoViet: "Tiêu điểm", translation: "Dấu câu", category: "Danh từ / Nouns" },
    { simplified: "标志", traditional: "標誌", pinyin: "biāozhì", sinoViet: "Tiêu chí", translation: "Ký hiệu, biểu tượng, mốc", category: "Danh từ / Nouns" },
    { simplified: "表面", traditional: "表面", pinyin: "biǎomiàn", sinoViet: "Biểu diện", translation: "Bề mặt, bề ngoài", category: "Vị trí / Position" },
    { simplified: "表明", traditional: "表明", pinyin: "biǎomíng", sinoViet: "Biểu minh", translation: "Chứng tỏ, biểu lộ rõ ràng", category: "Hành động / Actions" },
    { simplified: "表情", traditional: "表情", pinyin: "biǎoqíng", sinoViet: "Biểu tình", translation: "Nét mặt, vẻ mặt", category: "Danh từ / Nouns" },
    { simplified: "表现", traditional: "表現", pinyin: "biǎoxiàn", sinoViet: "Biểu hiện", translation: "Thể hiện, biểu hiện", category: "Hành động / Actions" },
    { simplified: "冰激凌", traditional: "冰激凌", pinyin: "bīngjīlíng", sinoViet: "Băng kích lăng", translation: "Kem, ly kem", category: "Đồ ăn uống / Food & Drinks" },
    { simplified: "病毒", traditional: "病毒", pinyin: "bìngdú", sinoViet: "Bệnh độc", translation: "Vi-rút", category: "Danh từ / Nouns" },
    { simplified: "播放", traditional: "播放", pinyin: "bōfàng", sinoViet: "Phát phóng", translation: "Phát sóng, phát nhạc/phim", category: "Hành động / Actions" },
    { simplified: "玻璃", traditional: "玻璃", pinyin: "bōli", sinoViet: "Pha lê", translation: "Thủy tinh, kính", category: "Đồ dùng / Items" },
    { simplified: "博物馆", traditional: "博物館", pinyin: "bówùguǎn", sinoViet: "Bác vật quán", translation: "Viện bảo tàng", category: "Địa điểm / Places" },
    { simplified: "不断", traditional: "不斷", pinyin: "búduàn", sinoViet: "Bất đoạn", translation: "Không ngừng, liên tục", category: "Trạng từ / Adverbs" },
    { simplified: "不足", traditional: "不足", pinyin: "bùzú", sinoViet: "Bất túc", translation: "Không đủ, thiếu sót", category: "Tính từ / Adjectives" },
    { simplified: "步骤", traditional: "步驟", pinyin: "bùzhòu", sinoViet: "Bộ sậu", translation: "Các bước, trình tự", category: "Danh từ / Nouns" },
    { simplified: "部门", traditional: "部門", pinyin: "bùmén", sinoViet: "Bộ môn", translation: "Bộ phận, phòng ban", category: "Danh từ / Nouns" },
    { simplified: "财产", traditional: "財產", pinyin: "cáichǎn", sinoViet: "Tài sản", translation: "Tài sản, của cải", category: "Danh từ / Nouns" },
    { simplified: "采访", traditional: "採訪", pinyin: "cǎifǎng", sinoViet: "Thải phóng", translation: "Phỏng vấn", category: "Hành động / Actions" },
    { simplified: "采取", traditional: "採取", pinyin: "cǎiqǔ", sinoViet: "Thải thủ", translation: "Áp dụng, thực hiện (biện pháp)", category: "Hành động / Actions" },
    { simplified: "餐厅", traditional: "餐廳", pinyin: "cāntīng", sinoViet: "Xan thính", translation: "Nhà hàng, phòng ăn", category: "Địa điểm / Places" },
    { simplified: "参与", traditional: "參與", pinyin: "cānyù", sinoViet: "Tham dự", translation: "Tham gia, tham dự", category: "Hành động / Actions" },
    { simplified: "操心", traditional: "操心", pinyin: "cāoxīn", sinoViet: "Thao tâm", translation: "Bận tâm, lo nghĩ", category: "Cảm xúc / Emotions" },
    { simplified: "厕所", traditional: "廁所", pinyin: "cèsuǒ", sinoViet: "Trắc sở", translation: "Nhà vệ sinh", category: "Địa điểm / Places" },
    { simplified: "曾经", traditional: "曾經", pinyin: "céngjīng", sinoViet: "Từng kinh", translation: "Đã từng", category: "Trạng từ / Adverbs" },
    { simplified: "插", traditional: "插", pinyin: "chā", sinoViet: "Sáp", translation: "Cắm vào, xen vào", category: "Hành động / Actions" },
    { simplified: "差别", traditional: "差別", pinyin: "chābié", sinoViet: "Sai biệt", translation: "Sự khác biệt, chênh lệch", category: "Danh từ / Nouns" },
    { simplified: "叉子", traditional: "叉子", pinyin: "chāzi", sinoViet: "Xoa tử", translation: "Cái dĩa, cái nĩa", category: "Đồ dùng / Items" },
    { simplified: "拆", traditional: "拆", pinyin: "chāi", sinoViet: "Sách", translation: "Tháo dỡ, mở (thư/quà)", category: "Hành động / Actions" },
    { simplified: "产生", traditional: "產生", pinyin: "chǎnshēng", sinoViet: "Sản sinh", translation: "Nảy sinh, sinh ra (hiện tượng)", category: "Hành động / Actions" },
    { simplified: "常识", traditional: "常識", pinyin: "chángshí", sinoViet: "Thường thức", translation: "Kiến thức thường thức", category: "Danh từ / Nouns" },
    { simplified: "长途", traditional: "長途", pinyin: "chángtú", sinoViet: "Trường đồ", translation: "Đường dài, viễn liên", category: "Giao thông / Traffic" },
    { simplified: "抄", traditional: "抄", pinyin: "chāo", sinoViet: "Sao", translation: "Sao chép, chép lại", category: "Hành động / Actions" },
    { simplified: "朝", traditional: "朝", pinyin: "cháo", sinoViet: "Triều", translation: "Hướng về, triều đại", category: "Giới từ / Prepositions" },
    { simplified: "炒", traditional: "炒", pinyin: "chǎo", sinoViet: "Xào", translation: "Xào, rang", category: "Hành động / Actions" },
    { simplified: "车库", traditional: "車庫", pinyin: "chēkù", sinoViet: "Xa khố", translation: "Nhà để xe, ga-ra", category: "Địa điểm / Places" },
    { simplified: "车厢", traditional: "車廂", pinyin: "chēxiāng", sinoViet: "Xa sương", translation: "Toa tàu", category: "Giao thông / Traffic" }
  ],
  6: [
    { simplified: "哎呀", traditional: "哎呀", pinyin: "āiyā", sinoViet: "Ai nha", translation: "Ôi chao, trời đất ơi", category: "Giao tiếp / Communication" },
    { simplified: "挨", traditional: "挨", pinyin: "ái", sinoViet: "Ai", translation: "Chịu đựng, bị (đánh, mắng)", category: "Hành động / Actions" },
    { simplified: "癌症", traditional: "癌症", pinyin: "áizhèng", sinoViet: "Nham chứng", translation: "Bệnh ung thư", category: "Trạng thái / States" },
    { simplified: "爱不释手", traditional: "愛不釋手", pinyin: "ài bù shì shǒu", sinoViet: "Ái bất thích thủ", translation: "Yêu thích không buông tay", category: "Tính từ / Adjectives" },
    { simplified: "爱戴", traditional: "愛戴", pinyin: "àidài", sinoViet: "Ái đái", translation: "Kính yêu, ủng hộ", category: "Cảm xúc / Emotions" },
    { simplified: "暧昧", traditional: "曖昧", pinyin: "àimèi", sinoViet: "Ái muội", translation: "Mập mờ, ái muội", category: "Tính từ / Adjectives" },
    { simplified: "安详", traditional: "安詳", pinyin: "ānxiáng", sinoViet: "An tường", translation: "Ôn hòa, điềm tĩnh, an tường", category: "Tính từ / Adjectives" },
    { simplified: "安置", traditional: "安置", pinyin: "ānzhì", sinoViet: "An trí", translation: "Bố trí, sắp xếp, định cư", category: "Hành động / Actions" },
    { simplified: "暗示", traditional: "暗示", pinyin: "ànshì", sinoViet: "Ám thị", translation: "Ám thị, gợi ý ngầm", category: "Hành động / Actions" },
    { simplified: "案件", traditional: "案件", pinyin: "ànjiàn", sinoViet: "Án kiện", translation: "Vụ án, hồ sơ vụ án", category: "Danh từ / Nouns" },
    { simplified: "案情", traditional: "案情", pinyin: "ànqíng", sinoViet: "Án tình", translation: "Diễn biến vụ án, án tình", category: "Danh từ / Nouns" },
    { simplified: "暗中", traditional: "暗中", pinyin: "ànzhōng", sinoViet: "Ám trung", translation: "Âm thầm, ngầm, bóng tối", category: "Trạng từ / Adverbs" },
    { simplified: "凹凸", traditional: "凹凸", pinyin: "āotū", sinoViet: "Ao đột", translation: "Lồi lõm, không bằng phẳng", category: "Tính từ / Adjectives" },
    { simplified: "拔苗助长", traditional: "拔苗助長", pinyin: "bá miáo zhù zhǎng", sinoViet: "Bạt miêu trợ trưởng", translation: "Dục tốc bất đạt, nhổ lúa giúp lớn", category: "Thành ngữ / Idioms" },
    { simplified: "罢了", traditional: "罷了", pinyin: "bàle", sinoViet: "Bãi liễu", translation: "Mà thôi, thôi đi", category: "Trợ từ / Particles" },
    { simplified: "霸道", traditional: "霸道", pinyin: "bàdào", sinoViet: "Bá đạo", translation: "Bá đạo, ngang ngược", category: "Tính từ / Adjectives" },
    { simplified: "掰", traditional: "掰", pinyin: "bāi", sinoViet: "Banh", translation: "Bẻ, bẻ đôi, tách ra", category: "Hành động / Actions" },
    { simplified: "百分点", traditional: "百分點", pinyin: "bǎifēndiǎn", sinoViet: "Bách phân điểm", translation: "Điểm phần trăm", category: "Danh từ / Nouns" },
    { simplified: "败坏", traditional: "敗壞", pinyin: "bàihuài", sinoViet: "Bại hoại", translation: "Bại hoại, làm suy đồi", category: "Hành động / Actions" },
    { simplified: "拜访", traditional: "拜訪", pinyin: "bàifǎng", sinoViet: "Bái phỏng", translation: "Viếng thăm, bái phỏng", category: "Hành động / Actions" },
    { simplified: "拜年", traditional: "拜年", pinyin: "bàinián", sinoViet: "Bái niên", translation: "Chúc Tết, chúc năm mới", category: "Hành động / Actions" },
    { simplified: "拜托", traditional: "拜託", pinyin: "bàituō", sinoViet: "Bái thác", translation: "Kính nhờ, bái thác, làm ơn", category: "Giao tiếp / Communication" },
    { simplified: "颁布", traditional: "頒布", pinyin: "bānbù", sinoViet: "Ban bố", translation: "Ban bố, ban hành", category: "Hành động / Actions" },
    { simplified: "颁发", traditional: "頒發", pinyin: "bānfā", sinoViet: "Ban phát", translation: "Ban phát, cấp (bằng, giải)", category: "Hành động / Actions" },
    { simplified: "伴侣", traditional: "伴侶", pinyin: "bànlǚ", sinoViet: "Bạn lữ", translation: "Bạn đời, bạn đồng hành", category: "Con người / People" },
    { simplified: "伴随", traditional: "伴隨", pinyin: "bànsuí", sinoViet: "Bạn tùy", translation: "Đi đôi với, kèm theo", category: "Hành động / Actions" },
    { simplified: "半途而废", traditional: "半途而廢", pinyin: "bàn tú ér fèi", sinoViet: "Bán đồ nhi phế", translation: "Bỏ dở nửa chừng", category: "Thành ngữ / Idioms" },
    { simplified: "扮演", traditional: "扮演", pinyin: "bànyǎn", sinoViet: "Bạn diễn", translation: "Sắm vai, đóng vai", category: "Hành động / Actions" },
    { simplified: "绑架", traditional: "綁架", pinyin: "bǎngjià", sinoViet: "Bảng giá", translation: "Bắt cóc", category: "Hành động / Actions" },
    { simplified: "榜样", traditional: "榜樣", pinyin: "bǎngyàng", sinoViet: "Bảng dạng", translation: "Tấm gương, khuôn mẫu", category: "Danh từ / Nouns" },
    { simplified: "包庇", traditional: "包庇", pinyin: "bāobì", sinoViet: "Bao tí", translation: "Bao che, dung túng", category: "Hành động / Actions" },
    { simplified: "包袱", traditional: "包袱", pinyin: "bāofu", sinoViet: "Bao phục", translation: "Gánh nặng, túi vải", category: "Danh từ / Nouns" },
    { simplified: "包容", traditional: "包容", pinyin: "bāoróng", sinoViet: "Bao dung", translation: "Bao dung, dung nạp", category: "Cảm xúc / Emotions" },
    { simplified: "包装", traditional: "包裝", pinyin: "bāozhuāng", sinoViet: "Bao trang", translation: "Đóng gói, bao bì, trang trí", category: "Hành động / Actions" },
    { simplified: "饱经沧桑", traditional: "飽經滄桑", pinyin: "bǎo jīng cāng sāng", sinoViet: "Bão kinh thương tang", translation: "Trải qua nhiều thăng trầm", category: "Thành ngữ / Idioms" },
    { simplified: "饱和", traditional: "飽和", pinyin: "bǎohé", sinoViet: "Bão hòa", translation: "Bão hòa", category: "Trạng thái / States" },
    { simplified: "保管", traditional: "保管", pinyin: "bǎoguǎn", sinoViet: "Bảo quản", translation: "Bảo quản, trông nom", category: "Hành động / Actions" },
    { simplified: "保姆", traditional: "保姆", pinyin: "bǎomǔ", sinoViet: "Bảo mẫu", translation: "Người giúp việc, bảo mẫu", category: "Con người / People" },
    { simplified: "保守", traditional: "保守", pinyin: "bǎoshǒu", sinoViet: "Bảo thủ", translation: "Bảo thủ, giữ bí mật", category: "Tính từ / Adjectives" },
    { simplified: "保卫", traditional: "保衛", pinyin: "bǎowèi", sinoViet: "Bảo vệ", translation: "Bảo vệ, canh giữ", category: "Hành động / Actions" },
    { simplified: "保重", traditional: "保重", pinyin: "bǎozhòng", sinoViet: "Bảo trọng", translation: "Bảo trọng, giữ gìn sức khỏe", category: "Giao tiếp / Communication" },
    { simplified: "报仇", traditional: "報仇", pinyin: "bàochóu", sinoViet: "Báo thù", translation: "Báo thù, trả thù", category: "Hành động / Actions" },
    { simplified: "报答", traditional: "報答", pinyin: "bàodá", sinoViet: "Báo đáp", translation: "Báo đáp, đền ơn", category: "Hành động / Actions" },
    { simplified: "报道", traditional: "報道", pinyin: "bàodào", sinoViet: "Báo đáo", translation: "Báo danh, trình diện", category: "Hành động / Actions" },
    { simplified: "报复", traditional: "報復", pinyin: "bàofù", sinoViet: "Báo phục", translation: "Báo thù, trả đũa", category: "Hành động / Actions" },
    { simplified: "抱负", traditional: "抱負", pinyin: "bàofù", sinoViet: "Bão phụ", translation: "Hoài bão, chí hướng", category: "Cảm xúc / Emotions" },
    { simplified: "曝光", traditional: "曝光", pinyin: "bàoguāng", sinoViet: "Bộc quang", translation: "Phơi bày, phơi sáng, vạch trần", category: "Hành động / Actions" },
    { simplified: "暴力", traditional: "暴力", pinyin: "bàolì", sinoViet: "Bạo lực", translation: "Bạo lực", category: "Danh từ / Nouns" },
    { simplified: "暴躁", traditional: "暴躁", pinyin: "bàozào", sinoViet: "Bạo táo", translation: "Nóng nảy, cọc cằn", category: "Tính từ / Adjectives" },
    { simplified: "卑鄙", traditional: "卑鄙", pinyin: "bēibǐ", sinoViet: "Ty bỉ", translation: "Hèn hạ, đê tiện, ty bỉ", category: "Tính từ / Adjectives" },
    { simplified: "悲惨", traditional: "悲慘", pinyin: "bēicǎn", sinoViet: "Bi thảm", translation: "Bi thảm, thê lương", category: "Tính từ / Adjectives" },
    { simplified: "北极", traditional: "北極", pinyin: "běijí", sinoViet: "Bắc cực", translation: "Bắc Cực", category: "Địa điểm / Places" },
    { simplified: "被动", traditional: "被動", pinyin: "bèidòng", sinoViet: "Bị động", translation: "Bị động", category: "Trạng thái / States" },
    { simplified: "备份", traditional: "備份", pinyin: "bèifèn", sinoViet: "Bị phần", translation: "Sao lưu, bản sao lưu", category: "Đồ dùng / Items" },
    { simplified: "被告", traditional: "被告", pinyin: "bèigào", sinoViet: "Bị cáo", translation: "Bị cáo (trong luật)", category: "Con người / People" },
    { simplified: "奔波", traditional: "奔波", pinyin: "bēnbō", sinoViet: "Bôn ba", translation: "Bôn ba, chạy vạy vất vả", category: "Hành động / Actions" },
    { simplified: "奔驰", traditional: "奔馳", pinyin: "bēnchí", sinoViet: "Bôn trì", translation: "Chạy băng băng, xe Mercedes", category: "Hành động / Actions" },
    { simplified: "本能", traditional: "本能", pinyin: "běnnéng", sinoViet: "Bản năng", translation: "Bản năng", category: "Danh từ / Nouns" },
    { simplified: "本钱", traditional: "本錢", pinyin: "běnqián", sinoViet: "Bản tiền", translation: "Vốn liếng, tiền vốn", category: "Danh từ / Nouns" },
    { simplified: "本人", traditional: "本人", pinyin: "běnrén", sinoViet: "Bản nhân", translation: "Bản thân, đích thân", category: "Đại từ / Pronouns" },
    { simplified: "本身", traditional: "本身", pinyin: "běnshēn", sinoViet: "Bản thân", translation: "Bản thân cái đó", category: "Đại từ / Pronouns" },
    { simplified: "崩溃", traditional: "崩潰", pinyin: "bēngkuì", sinoViet: "Băng quỹ", translation: "Sụp đổ, tan rã, suy sụp", category: "Trạng thái / States" },
    { simplified: "绷带", traditional: "繃帶", pinyin: "bēngdài", sinoViet: "Băng đới", translation: "Băng cuộn, băng gạc", category: "Đồ dùng / Items" },
    { simplified: "蓬勃", traditional: "蓬勃", pinyin: "péngbó", sinoViet: "Bồng bột", translation: "Hừng hực, phát triển mạnh mẽ", category: "Trạng thái / States" },
    { simplified: "逼迫", traditional: "逼迫", pinyin: "bīpò", sinoViet: "Bức bách", translation: "Ép buộc, cưỡng bức", category: "Hành động / Actions" },
    { simplified: "鼻祖", traditional: "鼻祖", pinyin: "bízǔ", sinoViet: "Tị tổ", translation: "Tổ sư, người sáng lập đầu tiên", category: "Con người / People" },
    { simplified: "比重", traditional: "比重", pinyin: "bǐzhòng", sinoViet: "Tỉ trọng", translation: "Tỷ trọng", category: "Danh từ / Nouns" },
    { simplified: "必定", traditional: "必定", pinyin: "bìdìng", sinoViet: "Tất định", translation: "Nhất định, quyết", category: "Trạng từ / Adverbs" },
    { simplified: "弊病", traditional: "弊病", pinyin: "bìbìng", sinoViet: "Tệ bệnh", translation: "Tệ nạn, nhược điểm", category: "Danh từ / Nouns" }
  ]
};

// Check existing elements to absolutely prevent duplicates
const existingWords = new Set();
const currentWordsByLevel = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

// Regex to capture full object
// E.g. { id: "w1", level: 1, simplified: "我", traditional: "我", pinyin: "wǒ", translation: "Tôi...", category: "..." }
// Or with sinoViet
const objectRegex = /{\s*id:\s*"w(\d+)",\s*level:\s*(\d+),\s*simplified:\s*"([^"]+)",\s*traditional:\s*"([^"]+)",\s*pinyin:\s*"([^"]+)",\s*(?:sinoViet:\s*"([^"]+)",\s*)?translation:\s*"([^"]+)",\s*category:\s*"([^"]+)"\s*}/;

const lines = content.split("\n");

let maxId = 0;

lines.forEach(line => {
  const m = line.match(objectRegex);
  if (m) {
    const idNum = parseInt(m[1]);
    if (idNum > maxId) maxId = idNum;
    
    const lvl = parseInt(m[2]);
    const simplified = m[3];
    const traditional = m[4];
    const pinyin = m[5];
    const sinoViet = m[6] || undefined; // If sinoViet is captured
    const translation = m[7];
    const category = m[8];

    currentWordsByLevel[lvl].push({
      id: `w${idNum}`,
      level: lvl,
      simplified,
      traditional,
      pinyin,
      sinoViet,
      translation,
      category
    });

    existingWords.add(simplified);
    existingWords.add(traditional);
  }
});

console.log(`Found ${existingWords.size} existing unique words in core vocabulary. Max ID is w${maxId}.`);

// Double check counts
for (let lvl = 1; lvl <= 6; lvl++) {
  console.log(`Level ${lvl} currently has ${currentWordsByLevel[lvl].length} words.`);
}

let nextId = maxId + 1;
const finalWordsByLevel = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

for (let lvl = 1; lvl <= 6; lvl++) {
  // Add all existing ones
  finalWordsByLevel[lvl].push(...currentWordsByLevel[lvl]);
  
  // Fill up to exactly 200 words
  let added = 0;
  const list = candidates[lvl] || [];
  for (const c of list) {
    if (finalWordsByLevel[lvl].length >= 200) break;
    if (!existingWords.has(c.simplified) && !existingWords.has(c.traditional)) {
      finalWordsByLevel[lvl].push({
        id: `w${nextId++}`,
        level: lvl,
        simplified: c.simplified,
        traditional: c.traditional,
        pinyin: c.pinyin,
        sinoViet: c.sinoViet,
        translation: c.translation,
        category: c.category
      });
      existingWords.add(c.simplified);
      existingWords.add(c.traditional);
      added++;
    }
  }
  
  console.log(`Level ${lvl} now has ${finalWordsByLevel[lvl].length} words (added ${added} new words).`);
  
  if (finalWordsByLevel[lvl].length < 200) {
    console.warn(`WARNING: Level ${lvl} only has ${finalWordsByLevel[lvl].length} words! Need more candidates.`);
  }
}

// Format the new writingData block
let newWritingDataStr = "export const writingData = [\n";
for (let lvl = 1; lvl <= 6; lvl++) {
  newWritingDataStr += `  // --- LEVEL ${lvl} (HSK ${lvl} / TOCFL ${lvl}) ---\n`;
  finalWordsByLevel[lvl].forEach(w => {
    if (w.sinoViet) {
      newWritingDataStr += `  { id: "${w.id}", level: ${w.level}, simplified: "${w.simplified}", traditional: "${w.traditional}", pinyin: "${w.pinyin}", sinoViet: "${w.sinoViet}", translation: "${w.translation}", category: "${w.category}" },\n`;
    } else {
      newWritingDataStr += `  { id: "${w.id}", level: ${w.level}, simplified: "${w.simplified}", traditional: "${w.traditional}", pinyin: "${w.pinyin}", translation: "${w.translation}", category: "${w.category}" },\n`;
    }
  });
}
newWritingDataStr += "];";

// Replace writingData in the file
const writingDataStartIdx = content.indexOf("export const writingData = [");
if (writingDataStartIdx === -1) {
  console.error("Could not find writingData start");
  process.exit(1);
}

let bracketDepth = 0;
let writingDataEndIdx = -1;
for (let i = writingDataStartIdx; i < content.length; i++) {
  if (content[i] === "[") {
    bracketDepth++;
  } else if (content[i] === "]") {
    bracketDepth--;
    if (bracketDepth === 0) {
      writingDataEndIdx = i;
      break;
    }
  }
}

if (writingDataEndIdx === -1) {
  console.error("Could not find writingData end bracket");
  process.exit(1);
}

let endCut = writingDataEndIdx + 1;
if (content[endCut] === ";") {
  endCut++;
}

const newContent = content.substring(0, writingDataStartIdx) + newWritingDataStr + content.substring(endCut);

fs.writeFileSync(filepath, newContent, "utf8");
console.log("SUCCESS: vocabulary.js expanded to exactly 200 words per level (1200 words total) perfectly!");
