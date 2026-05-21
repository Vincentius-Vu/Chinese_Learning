// Cơ sở dữ liệu Nguồn gốc chữ Hán (Etymology) & 214 Bộ thủ Hán tự
// Dùng cho mô-đun Luyện viết chữ Hán tương tác nâng cao

// --- 1. DANH MỤC 214 BỘ THỦ TIẾNG TRUNG ĐẦY ĐỦ (214 RADICALS) ---
export const radicalsList = [
  // 1 nét (Strokes: 1)
  { id: 1, symbol: "一", pinyin: "yī", sinoViet: "Nhất", meaning: "Số một, nét ngang đầu", strokes: 1 },
  { id: 2, symbol: "丨", pinyin: "gǔn", sinoViet: "Cổn", meaning: "Nét sổ thẳng dọc", strokes: 1 },
  { id: 3, symbol: "丶", pinyin: "zhǔ", sinoViet: "Chủ", meaning: "Điểm, nét chấm", strokes: 1 },
  { id: 4, symbol: "丿", pinyin: "piě", sinoViet: "Phiệt", meaning: "Nét phẩy, nghiêng sang trái", strokes: 1 },
  { id: 5, symbol: "乙", pinyin: "yǐ", sinoViet: "Ất", meaning: "Vị trí thứ hai trong thiên can, nét cong móc", strokes: 1 },
  { id: 6, symbol: "亅", pinyin: "jué", sinoViet: "Quyết", meaning: "Nét móc đứng", strokes: 1 },

  // 2 nét (Strokes: 2)
  { id: 7, symbol: "二", pinyin: "èr", sinoViet: "Nhị", meaning: "Số hai", strokes: 2 },
  { id: 8, symbol: "亠", pinyin: "tóu", sinoViet: "Đầu", meaning: "Nét chấm đầu, phần đỉnh", strokes: 2 },
  { id: 9, symbol: "人", pinyin: "rén", sinoViet: "Nhân", meaning: "Con người (bộ gốc)", strokes: 2 },
  { id: 10, symbol: "儿", pinyin: "ér", sinoViet: "Nhân đi", meaning: "Chân người đang đi", strokes: 2 },
  { id: 11, symbol: "入", pinyin: "rù", sinoViet: "Nhập", meaning: "Đi vào, bước vào", strokes: 2 },
  { id: 12, symbol: "八", pinyin: "bā", sinoViet: "Bát", meaning: "Số tám, phân chia ra", strokes: 2 },
  { id: 13, symbol: "冂", pinyin: "jiōng", sinoViet: "Quynh", meaning: "Vùng đất trống xa, biên giới", strokes: 2 },
  { id: 14, symbol: "冖", pinyin: "mì", sinoViet: "Mịch", meaning: "Sợi tơ bao phủ, mái trùm", strokes: 2 },
  { id: 15, symbol: "冫", pinyin: "bīng", sinoViet: "Băng", meaning: "Nước đá, lạnh giá", strokes: 2 },
  { id: 16, symbol: "几", pinyin: "jī", sinoViet: "Kỷ", meaning: "Ghế dựa, cái bàn nhỏ", strokes: 2 },
  { id: 17, symbol: "凵", pinyin: "qiǎn", sinoViet: "Khảm", meaning: "Há miệng, hố sâu rộng", strokes: 2 },
  { id: 18, symbol: "刀", pinyin: "dāo", sinoViet: "Đao", meaning: "Con dao, vũ khí sắc bén (dạng khác: 刂)", strokes: 2 },
  { id: 19, symbol: "力", pinyin: "lì", sinoViet: "Lực", meaning: "Sức mạnh, công cụ lao động", strokes: 2 },
  { id: 20, symbol: "勹", pinyin: "bāo", sinoViet: "Bao", meaning: "Bao bọc, ôm lấy", strokes: 2 },
  { id: 21, symbol: "匕", pinyin: "bǐ", sinoViet: "Chủy", meaning: "Cái thìa, muỗng múc", strokes: 2 },
  { id: 22, symbol: "匚", pinyin: "fāng", sinoViet: "Phương", meaning: "Tủ đựng đồ, vật chứa", strokes: 2 },
  { id: 23, symbol: "匸", pinyin: "xì", sinoViet: "Hệ", meaning: "Che đậy, cất giấu", strokes: 2 },
  { id: 24, symbol: "十", pinyin: "shí", sinoViet: "Thập", meaning: "Số mười, hoàn chỉnh", strokes: 2 },
  { id: 25, symbol: "卜", pinyin: "bǔ", sinoViet: "Bốc", meaning: "Xem bói, dự đoán tương lai", strokes: 2 },
  { id: 26, symbol: "卩", pinyin: "jié", sinoViet: "Tiết", meaning: "Khớp xương tre, dấu ấn quỳ gối", strokes: 2 },
  { id: 27, symbol: "厂", pinyin: "chǎng", sinoViet: "Hán", meaning: "Sườn núi, vách đá cheo leo", strokes: 2 },
  { id: 28, symbol: "厶", pinyin: "sī", sinoViet: "Khư", meaning: "Riêng tư, cá nhân", strokes: 2 },
  { id: 29, symbol: "又", pinyin: "yòu", sinoViet: "Hựu", meaning: "Lại một lần nữa, bàn tay phải", strokes: 2 },

  // 3 nét (Strokes: 3)
  { id: 30, symbol: "口", pinyin: "kǒu", sinoViet: "Khẩu", meaning: "Cái miệng, lối vào, cửa", strokes: 3 },
  { id: 31, symbol: "囗", pinyin: "wéi", sinoViet: "Vi", meaning: "Vây quanh, bờ cõi bao quanh", strokes: 3 },
  { id: 32, symbol: "土", pinyin: "tǔ", sinoViet: "Thổ", meaning: "Đất đai, mặt đất", strokes: 3 },
  { id: 33, symbol: "士", pinyin: "shì", sinoViet: "Sĩ", meaning: "Kẻ sĩ, người trí thức, chiến sĩ", strokes: 3 },
  { id: 34, symbol: "夂", pinyin: "zhǐ", sinoViet: "Truy", meaning: "Bước đi chậm rãi phía sau", strokes: 3 },
  { id: 35, symbol: "夊", pinyin: "suī", sinoViet: "Tuy", meaning: "Đi chậm rề rà", strokes: 3 },
  { id: 36, symbol: "夕", pinyin: "xī", sinoViet: "Tịch", meaning: "Đêm tối, buổi chiều tà, trăng khuyết", strokes: 3 },
  { id: 37, symbol: "大", pinyin: "dà", sinoViet: "Đại", meaning: "To lớn, vĩ đại (hình người dang tay)", strokes: 3 },
  { id: 38, symbol: "女", pinyin: "nǚ", sinoViet: "Nữ", meaning: "Người phụ nữ, con gái", strokes: 3 },
  { id: 39, symbol: "子", pinyin: "zǐ", sinoViet: "Tử", meaning: "Đứa con, trẻ con, hạt", strokes: 3 },
  { id: 40, symbol: "宀", pinyin: "mián", sinoViet: "Miên", meaning: "Mái nhà, mái che", strokes: 3 },
  { id: 41, symbol: "寸", pinyin: "cùn", sinoViet: "Thốn", meaning: "Đo lường, tấc (khoảng cách mạch cổ tay)", strokes: 3 },
  { id: 42, symbol: "小", pinyin: "xiǎo", sinoViet: "Tiểu", meaning: "Nhỏ bé, ít ỏi", strokes: 3 },
  { id: 43, symbol: "尢", pinyin: "wāng", sinoViet: "Uông", meaning: "Người thọt chân, yếu ớt", strokes: 3 },
  { id: 44, symbol: "尸", pinyin: "shī", sinoViet: "Thi", "meaning": "Xác chết, thân thể người nằm quỳ", strokes: 3 },
  { id: 45, symbol: "屮", pinyin: "chè", sinoViet: "Triệt", meaning: "Mầm cây non vừa mọc khỏi đất", strokes: 3 },
  { id: 46, symbol: "山", pinyin: "shān", sinoViet: "Sơn", meaning: "Núi non, đỉnh núi", strokes: 3 },
  { id: 47, symbol: "巛", pinyin: "chuān", sinoViet: "Xuyên", meaning: "Sông ngòi, dòng chảy lớn (dạng khác: 川)", strokes: 3 },
  { id: 48, symbol: "工", pinyin: "gōng", sinoViet: "Công", meaning: "Công cụ, công việc, thợ thủ công", strokes: 3 },
  { id: 49, symbol: "己", pinyin: "jǐ", sinoViet: "Kỷ", meaning: "Bản thân mình, đã xong", strokes: 3 },
  { id: 50, symbol: "巾", pinyin: "jīn", sinoViet: "Cân", meaning: "Khăn vải, mũ nón vải", strokes: 3 },
  { id: 51, symbol: "干", pinyin: "gān", sinoViet: "Can", meaning: "Thiên can, cái khiên, can dự", strokes: 3 },
  { id: 52, symbol: "幺", pinyin: "yāo", sinoViet: "Yêu", meaning: "Nhỏ nhắn, sợi chỉ tơ cực nhỏ", strokes: 3 },
  { id: 53, symbol: "广", pinyin: "guǎng", sinoViet: "Quảng", meaning: "Mái nhà dựa lưng vào sườn núi, rộng lớn", strokes: 3 },
  { id: 54, symbol: "廴", pinyin: "yǐn", sinoViet: "Dẫn", meaning: "Bước đi dài chân, tiến bước", strokes: 3 },
  { id: 55, symbol: "廾", pinyin: "gǒng", sinoViet: "Củng", meaning: "Chấp tay chào, dâng lên hai tay", strokes: 3 },
  { id: 56, symbol: "弋", pinyin: "yì", sinoViet: "Dực", meaning: "Cọc gỗ nhỏ, mũi tên có dây buộc", strokes: 3 },
  { id: 57, symbol: "弓", pinyin: "gōng", sinoViet: "Cung", meaning: "Cái cung bắn tên", strokes: 3 },
  { id: 58, symbol: "彐", pinyin: "jì", sinoViet: "Ký", meaning: "Đầu con nhím, bàn tay cầm nắm", strokes: 3 },
  { id: 59, symbol: "彡", pinyin: "shān", sinoViet: "Sâm", meaning: "Tóc dài, lông mao trang trí", strokes: 3 },
  { id: 60, symbol: "彳", pinyin: "chì", sinoViet: "Xích", meaning: "Bước chân trái đi đường, ngã tư", strokes: 3 },

  // 4 nét (Strokes: 4)
  { id: 61, symbol: "心", pinyin: "xīn", sinoViet: "Tâm", meaning: "Quả tim, lòng dạ, tình cảm (dạng khác: 忄)", strokes: 4 },
  { id: 62, symbol: "戈", pinyin: "gē", sinoViet: "Qua", meaning: "Cây kích cổ đại, vũ khí chiến đấu", strokes: 4 },
  { id: 63, symbol: "户", pinyin: "hù", sinoViet: "Hộ", meaning: "Một cánh cửa đơn, hộ gia đình", strokes: 4 },
  { id: 64, symbol: "手", pinyin: "shǒu", sinoViet: "Thủ", meaning: "Bàn tay, cánh tay (dạng khác: 扌)", strokes: 4 },
  { id: 65, symbol: "支", pinyin: "zhī", sinoViet: "Chi", meaning: "Cành cây, chống đỡ, chi nhánh", strokes: 4 },
  { id: 66, symbol: "攴", pinyin: "pū", sinoViet: "Phộc", meaning: "Đánh khẽ (dạng giản thể: 攵)", strokes: 4 },
  { id: 67, symbol: "文", pinyin: "wén", sinoViet: "Văn", meaning: "Chữ viết, văn chương, hoa văn", strokes: 4 },
  { id: 68, symbol: "斗", pinyin: "dǒu", sinoViet: "Đấu", meaning: "Cái đấu đong gạo, cái thìa lớn", strokes: 4 },
  { id: 69, symbol: "斤", pinyin: "jīn", sinoViet: "Cân", meaning: "Cái rìu cắt gỗ, búa sắt", strokes: 4 },
  { id: 70, symbol: "方", pinyin: "fāng", sinoViet: "Phương", meaning: "Hình vuông, phương hướng", strokes: 4 },
  { id: 71, symbol: "无", pinyin: "wú", sinoViet: "Vô", meaning: "Không có gì, hư vô", strokes: 4 },
  { id: 72, symbol: "日", pinyin: "rì", sinoViet: "Nhật", meaning: "Mặt trời, ban ngày", strokes: 4 },
  { id: 73, symbol: "曰", pinyin: "yuē", sinoViet: "Viết", meaning: "Rằng là, nói rằng (miệng hé mở nói)", strokes: 4 },
  { id: 74, symbol: "月", pinyin: "yuè", sinoViet: "Nguyệt", meaning: "Mặt trăng, tháng, thể xác (Nhục)", strokes: 4 },
  { id: 75, symbol: "木", pinyin: "mù", sinoViet: "Mộc", meaning: "Cây cối, gỗ rừng", strokes: 4 },
  { id: 76, symbol: "欠", pinyin: "qiàn", sinoViet: "Khiếm", meaning: "Thiếu thốn, ngáp dài (há miệng)", strokes: 4 },
  { id: 77, symbol: "止", pinyin: "zhǐ", sinoViet: "Chỉ", meaning: "Dừng lại, dấu bàn chân thẳng đứng", strokes: 4 },
  { id: 78, symbol: "歹", pinyin: "dǎi", sinoViet: "Tệ", meaning: "Xấu xa, xương khô rã", strokes: 4 },
  { id: 79, symbol: "殳", pinyin: "shū", sinoViet: "Thù", meaning: "Binh khí dài bằng gỗ để gõ gậy", strokes: 4 },
  { id: 80, symbol: "毋", pinyin: "wú", sinoViet: "Vô", meaning: "Chớ nên, đừng, không có", strokes: 4 },
  { id: 81, symbol: "比", pinyin: "bǐ", sinoViet: "Tỉ", meaning: "So sánh, xếp hàng đôi sát nhau", strokes: 4 },
  { id: 82, symbol: "毛", pinyin: "máo", sinoViet: "Mao", meaning: "Lông thú, tóc dài rậm", strokes: 4 },
  { id: 83, symbol: "氏", pinyin: "shì", sinoViet: "Thị", meaning: "Họ tộc, nguồn gốc dòng giống", strokes: 4 },
  { id: 84, symbol: "气", pinyin: "qì", sinoViet: "Khí", meaning: "Hơi nước bốc lên, không khí", strokes: 4 },
  { id: 85, symbol: "水", pinyin: "shuǐ", sinoViet: "Thủy", meaning: "Nước (dạng khác: 氵)", strokes: 4 },
  { id: 86, symbol: "火", pinyin: "huǒ", sinoViet: "Hỏa", meaning: "Ngọn lửa, sức nóng (dạng khác: 灬)", strokes: 4 },
  { id: 87, symbol: "爪", pinyin: "zhǎo", sinoViet: "Trảo", meaning: "Móng vuốt thú vật, chim muông (dạng khác: 爫)", strokes: 4 },
  { id: 88, symbol: "父", pinyin: "fù", sinoViet: "Phụ", meaning: "Người cha, người chủ gia đình", strokes: 4 },
  { id: 89, symbol: "爻", pinyin: "yáo", sinoViet: "Hào", meaning: "Nét vạch của quẻ Dịch cổ đại", strokes: 4 },
  { id: 90, symbol: "爿", pinyin: "qiáng", sinoViet: "Tường", meaning: "Mảnh gỗ xẻ dọc nằm bên trái", strokes: 4 },
  { id: 91, symbol: "片", pinyin: "piàn", sinoViet: "Phiến", meaning: "Lớp mỏng, thẻ gỗ bên phải", strokes: 4 },
  { id: 92, symbol: "牙", pinyin: "yá", sinoViet: "Nha", meaning: "Răng nanh, ngà voi", strokes: 4 },
  { id: 93, symbol: "牛", pinyin: "niú", sinoViet: "Ngưu", meaning: "Con bò, con trâu (dạng khác: uniú)", strokes: 4 },
  { id: 94, symbol: "犬", pinyin: "quǎn", sinoViet: "Khuyển", meaning: "Con chó săn (dạng khác: 犭)", strokes: 4 },

  // 5 nét (Strokes: 5)
  { id: 95, symbol: "玄", pinyin: "xuán", sinoViet: "Huyền", meaning: "Màu đen sâu thẳm, huyền bí", strokes: 5 },
  { id: 96, symbol: "玉", pinyin: "yù", sinoViet: "Ngọc", meaning: "Viên ngọc quý giá, đá quý (dạng khác: 王)", strokes: 5 },
  { id: 97, symbol: "瓜", pinyin: "guā", sinoViet: "Qua", meaning: "Quả dưa, cây thân dây leo", strokes: 5 },
  { id: 98, symbol: "瓦", pinyin: "wǎ", sinoViet: "Ngõa", meaning: "Ngói lợp nhà, đồ đất nung", strokes: 5 },
  { id: 99, symbol: "甘", pinyin: "gān", sinoViet: "Cam", meaning: "Ngọt ngào, tự nguyện", strokes: 5 },
  { id: 100, symbol: "生", pinyin: "shēng", sinoViet: "Sinh", meaning: "Sinh sản, phát triển, nảy nở", strokes: 5 },
  { id: 101, symbol: "用", pinyin: "yòng", sinoViet: "Dụng", meaning: "Sử dụng, công cụ hữu dụng", strokes: 5 },
  { id: 102, symbol: "田", pinyin: "tián", sinoViet: "Điền", meaning: "Ruộng đất canh tác trồng lúa", strokes: 5 },
  { id: 103, symbol: "疋", pinyin: "pǐ", sinoViet: "Thất", meaning: "Cuộn vải dài, chân đang bước", strokes: 5 },
  { id: 104, symbol: "疒", pinyin: "nè", sinoViet: "Nạch", meaning: "Tình trạng bệnh tật, ốm đau", strokes: 5 },
  { id: 105, symbol: "癶", pinyin: "bō", sinoViet: "Bát", meaning: "Hai bàn chân giẫm đi ngược hướng", strokes: 5 },
  { id: 106, symbol: "白", pinyin: "bái", sinoViet: "Bạch", meaning: "Màu trắng tinh, sáng rõ", strokes: 5 },
  { id: 107, symbol: "皮", pinyin: "pí", sinoViet: "Bì", meaning: "Lớp da động vật, vỏ bọc ngoài", strokes: 5 },
  { id: 108, symbol: "皿", pinyin: "mǐn", sinoViet: "Mãnh", meaning: "Cái bát đựng đồ ăn, cái đĩa chén", strokes: 5 },
  { id: 109, symbol: "目", pinyin: "mù", sinoViet: "Mục", meaning: "Con mắt, tiêu đề", strokes: 5 },
  { id: 110, symbol: "矛", pinyin: "máo", sinoViet: "Mâu", meaning: "Thương nhọn đâm, giáo mác", strokes: 5 },
  { id: 111, symbol: "矢", pinyin: "shǐ", sinoViet: "Thất", meaning: "Mũi tên bay thẳng", strokes: 5 },
  { id: 112, symbol: "石", pinyin: "shí", sinoViet: "Thạch", meaning: "Đá, tảng đá", strokes: 5 },
  { id: 113, symbol: "示", pinyin: "shì", sinoViet: "Thị", meaning: "Thần linh chỉ bảo, cúng tế (dạng khác: 礻)", strokes: 5 },
  { id: 114, symbol: "禸", pinyin: "róu", sinoViet: "Nhựu", meaning: "Dấu bàn chân thú bò sát", strokes: 5 },
  { id: 115, symbol: "禾", pinyin: "hé", sinoViet: "Hòa", meaning: "Cây lúa nước, ngũ cốc trĩu hạt", strokes: 5 },
  { id: 116, symbol: "穴", pinyin: "xué", sinoViet: "Huyệt", meaning: "Hang hốc, hầm đất", strokes: 5 },
  { id: 117, symbol: "立", pinyin: "lì", sinoViet: "Lập", meaning: "Đứng thẳng người trên mặt đất", strokes: 5 },

  // 6 nét (Strokes: 6)
  { id: 118, symbol: "竹", pinyin: "zhú", sinoViet: "Trúc", meaning: "Cây tre, ống tre (dạng khác: ⺮)", strokes: 6 },
  { id: 119, symbol: "米", pinyin: "mǐ", sinoViet: "Mễ", meaning: "Hạt gạo tróc vỏ, lương thực", strokes: 6 },
  { id: 120, symbol: "糸", pinyin: "mì", sinoViet: "Mịch", meaning: "Sợi chỉ tơ dài (dạng giản thể: 纟)", strokes: 6 },
  { id: 121, symbol: "缶", pinyin: "fǒu", sinoViet: "Phẫu", meaning: "Cái bình gốm đất nung cổ đại", strokes: 6 },
  { id: 122, symbol: "网", pinyin: "wǎng", sinoViet: "Võng", meaning: "Lưới đánh cá, mạng lưới (dạng khác: 罒)", strokes: 6 },
  { id: 123, symbol: "羊", pinyin: "yáng", sinoViet: "Dương", meaning: "Con dê, con cừu tốt lành", strokes: 6 },
  { id: 124, symbol: "羽", pinyin: "yǔ", sinoViet: "Vũ", meaning: "Lông vũ, đôi cánh chim", strokes: 6 },
  { id: 125, symbol: "老", pinyin: "lǎo", sinoViet: "Lão", meaning: "Người già tuổi cao, cao niên", strokes: 6 },
  { id: 126, symbol: "而", pinyin: "ér", sinoViet: "Nhi", meaning: "Râu cằm dưới miệng, liên từ và/nhưng", strokes: 6 },
  { id: 127, symbol: "耒", pinyin: "lěi", sinoViet: "Lỗi", meaning: "Cái cày gỗ bằng tay làm ruộng", strokes: 6 },
  { id: 128, symbol: "耳", pinyin: "ěr", sinoViet: "Nhĩ", meaning: "Cái tai để lắng nghe", strokes: 6 },
  { id: 129, symbol: "聿", pinyin: "yù", sinoViet: "Duật", meaning: "Cây bút lông viết thẻ tre", strokes: 6 },
  { id: 130, symbol: "肉", pinyin: "ròu", sinoViet: "Nhục", meaning: "Thịt, thể xác (trong chữ thường biến thành: 月)", strokes: 6 },
  { id: 131, symbol: "臣", pinyin: "chén", sinoViet: "Thần", meaning: "Bầy tôi, tôi tớ, quan lại cúi mặt", strokes: 6 },
  { id: 132, symbol: "自", pinyin: "zì", sinoViet: "Tự", meaning: "Bản thân tự mình (hình mũi người)", strokes: 6 },
  { id: 133, symbol: "至", pinyin: "zhì", sinoViet: "Chí", meaning: "Đến nơi, cùng cực (mũi tên cắm xuống đất)", strokes: 6 },
  { id: 134, symbol: "臼", pinyin: "jiù", sinoViet: "Cối", meaning: "Cái cối giã gạo", strokes: 6 },
  { id: 135, symbol: "舌", pinyin: "shé", sinoViet: "Thiệt", meaning: "Cái lưỡi trong miệng để nếm nói", strokes: 6 },
  { id: 136, symbol: "舛", pinyin: "chuǎn", sinoViet: "Suyễn", meaning: "Sai lệch, bước đi giẫm chéo chân", strokes: 6 },
  { id: 137, symbol: "舟", pinyin: "zhōu", sinoViet: "Chu", meaning: "Thuyền nhỏ độc mộc", strokes: 6 },
  { id: 138, symbol: "艮", pinyin: "gèn", sinoViet: "Cấn", meaning: "Quẻ Cấn, cứng cỏi, ngoảnh đầu lại nhìn", strokes: 6 },
  { id: 139, symbol: "色", pinyin: "sè", sinoViet: "Sắc", meaning: "Màu sắc, vẻ mặt, giới tính", strokes: 6 },
  { id: 140, symbol: "艹", pinyin: "cǎo", sinoViet: "Thảo", meaning: "Cỏ, cây hoa thảo mộc nhỏ", strokes: 6 },
  { id: 141, symbol: "虍", pinyin: "hū", sinoViet: "Hổ", meaning: "Vằn da hổ, hổ báo", strokes: 6 },
  { id: 142, symbol: "虫", pinyin: "chóng", sinoViet: "Trùng", meaning: "Côn trùng, sâu bọ, loài rắn rết cổ", strokes: 6 },
  { id: 143, symbol: "血", pinyin: "xuè", sinoViet: "Huyết", meaning: "Máu (trong cái chén đựng vật cúng)", strokes: 6 },
  { id: 144, symbol: "行", pinyin: "xíng", sinoViet: "Hành", meaning: "Đi lại, thi hành, ngã tư lớn", strokes: 6 },
  { id: 145, symbol: "衣", pinyin: "yī", sinoViet: "Y", meaning: "Y phục, áo dài mặc che thân (dạng khác: 衤)", strokes: 6 },
  { id: 146, symbol: "西", pinyin: "xī", sinoViet: "Tây", meaning: "Phương Tây, cái tổ chim", strokes: 6 },

  // Các bộ thủ nhiều nét tiêu biểu từ 7 đến 17 nét
  { id: 147, symbol: "见", pinyin: "jiàn", sinoViet: "Kiến", meaning: "Nhìn thấy, gặp gỡ", strokes: 7 },
  { id: 148, symbol: "角", pinyin: "jiǎo", sinoViet: "Giác", meaning: "Sừng con thú, góc nhọn", strokes: 7 },
  { id: 149, symbol: "言", pinyin: "yán", sinoViet: "Ngôn", meaning: "Lời nói, phát biểu (dạng giản thể: 讠)", strokes: 7 },
  { id: 150, symbol: "谷", pinyin: "gǔ", sinoViet: "Cốc", meaning: "Khe suối, thung lũng nước chảy", strokes: 7 },
  { id: 151, symbol: "豆", pinyin: "dòu", sinoViet: "Đậu", meaning: "Quả hạt đậu, bát cúng đựng đồ", strokes: 7 },
  { id: 152, symbol: "豕", pinyin: "shǐ", sinoViet: "Thỉ", meaning: "Con heo, lợn", strokes: 7 },
  { id: 153, symbol: "贝", pinyin: "bèi", sinoViet: "Bối", meaning: "Tiền vỏ sò quý giá, tài sản", strokes: 7 },
  { id: 154, symbol: "赤", pinyin: "chì", sinoViet: "Xích", meaning: "Màu đỏ rực, đất đỏ tươi", strokes: 7 },
  { id: 155, symbol: "走", pinyin: "zǒu", sinoViet: "Tẩu", meaning: "Chạy trốn, bước đi nhanh", strokes: 7 },
  { id: 156, symbol: "足", pinyin: "zú", sinoViet: "Túc", meaning: "Cái chân người, đầy đủ (dạng khác: ⻊)", strokes: 7 },
  { id: 157, symbol: "身", pinyin: "shēn", sinoViet: "Thân", meaning: "Thân thể người đang mang thai", strokes: 7 },
  { id: 158, symbol: "车", pinyin: "chē", sinoViet: "Xa", meaning: "Xe cộ, phương tiện bánh xoay", strokes: 7 },
  { id: 159, symbol: "辛", pinyin: "xīn", sinoViet: "Tân", meaning: "Vất vả, cay đắng, dao khắc án phạt", strokes: 7 },
  { id: 160, symbol: "辰", pinyin: "chén", sinoViet: "Thần", meaning: "Ngôi sao thiên hà, vỏ trai lớn làm ruộng", strokes: 7 },
  { id: 161, symbol: "辶", pinyin: "chuò", sinoViet: "Sước", meaning: "Chân bước đi trên con lộ lớn, di chuyển", strokes: 7 },
  { id: 162, symbol: "邑", pinyin: "yì", sinoViet: "Ấp", meaning: "Khu đất định cư, thành trì (dạng khác bên phải: 阝)", strokes: 7 },
  { id: 163, symbol: "酉", pinyin: "yǒu", sinoViet: "Dậu", meaning: "Hũ rượu ủ men chín, giờ Dậu", strokes: 7 },
  { id: 164, symbol: "里", pinyin: "lǐ", sinoViet: "Lý", meaning: "Dặm đường, xóm làng dân cư", strokes: 7 },
  { id: 165, symbol: "门", pinyin: "mén", sinoViet: "Môn", meaning: "Cánh cổng lớn hai cánh đóng mở", strokes: 8 },
  { id: 166, symbol: "阜", pinyin: "fù", sinoViet: "Phụ", meaning: "Gò đất cao nâng tầng (dạng khác bên trái: 阝)", strokes: 8 },
  { id: 167, symbol: "隹", pinyin: "zhuī", sinoViet: "Chuy", meaning: "Loài chim có đuôi ngắn bè", strokes: 8 },
  { id: 168, symbol: "雨", pinyin: "yǔ", sinoViet: "Vũ", meaning: "Mưa rơi từ đám mây", strokes: 8 },
  { id: 169, symbol: "青", pinyin: "qīng", sinoViet: "Thanh", meaning: "Màu xanh da trời, xanh ngọc bích", strokes: 8 },
  { id: 170, symbol: "非", pinyin: "fēi", sinoViet: "Phi", meaning: "Sai trái, trái ngược, đôi cánh đập ngược", strokes: 8 },
  { id: 171, symbol: "面", pinyin: "miàn", sinoViet: "Diện", meaning: "Bề mặt, nét mặt diện mạo", strokes: 9 },
  { id: 172, symbol: "革", pinyin: "gé", sinoViet: "Cách", meaning: "Da thú thuộc cạo sạch lông, cải cách", strokes: 9 },
  { id: 173, symbol: "页", pinyin: "yè", sinoViet: "Hiệt", meaning: "Cái đầu người bộc lộ trên cổ, trang sách", strokes: 9 },
  { id: 174, symbol: "风", pinyin: "fēng", sinoViet: "Phong", meaning: "Gió thổi bay trời, phong tục", strokes: 9 },
  { id: 175, symbol: "飞", pinyin: "fēi", sinoViet: "Phi", meaning: "Chim đang bay đập cánh", strokes: 9 },
  { id: 176, symbol: "食", pinyin: "shí", sinoViet: "Thực", meaning: "Thức ăn ngon, ăn uống (dạng khác: 饣)", strokes: 9 },
  { id: 177, symbol: "首", pinyin: "shǒu", sinoViet: "Thủ", meaning: "Đứng đầu, thủ lĩnh (hình đầu người có tóc)", strokes: 9 },
  { id: 178, symbol: "香", pinyin: "xiāng", sinoViet: "Hương", meaning: "Mùi hương dễ chịu của ngũ cốc chín thơm", strokes: 9 },
  { id: 179, symbol: "马", pinyin: "mǎ", sinoViet: "Mã", meaning: "Con ngựa oai phong dài bờm", strokes: 10 },
  { id: 180, symbol: "骨", pinyin: "gǔ", sinoViet: "Cốt", meaning: "Khung xương nâng đỡ cơ thể", strokes: 10 },
  { id: 181, symbol: "高", pinyin: "gāo", sinoViet: "Cao", meaning: "Tòa lầu cao vút vượt trội", strokes: 10 },
  { id: 182, symbol: "鬼", pinyin: "guǐ", sinoViet: "Quỷ", meaning: "Linh hồn, ma quỷ kỳ bí có đầu to", strokes: 10 },
  { id: 183, symbol: "鱼", pinyin: "yú", sinoViet: "Ngư", meaning: "Con cá có đuôi vây và vảy bơi nước", strokes: 11 },
  { id: 184, symbol: "鸟", pinyin: "niǎo", sinoViet: "Điểu", meaning: "Loài chim lông vũ đuôi dài", strokes: 11 },
  { id: 185, symbol: "鹿", pinyin: "lù", sinoViet: "Lộc", meaning: "Con hươu sao xinh đẹp bờm dài", strokes: 11 },
  { id: 186, symbol: "麦", pinyin: "mài", sinoViet: "Mạch", meaning: "Cây lúa mạch", strokes: 11 },
  { id: 187, symbol: "麻", pinyin: "má", sinoViet: "Ma", meaning: "Cây gai làm sợi dệt bao bố dưới mái", strokes: 11 },
  { id: 188, symbol: "黄", pinyin: "huáng", sinoViet: "Hoàng", meaning: "Màu vàng của đất đai màu mỡ", strokes: 12 },
  { id: 189, symbol: "黍", pinyin: "shǔ", sinoViet: "Thử", meaning: "Cây lúa nếp có hạt dẻo dính", strokes: 12 },
  { id: 190, symbol: "黑", pinyin: "hēi", sinoViet: "Hắc", meaning: "Màu đen tuyền của muội bếp bám đầy", strokes: 12 },
  { id: 191, symbol: "黾", pinyin: "mǐn", sinoViet: "Mãnh", meaning: "Loài ếch nhái, rùa nước to đầu", strokes: 13 },
  { id: 192, symbol: "鼎", pinyin: "dǐng", sinoViet: "Đỉnh", meaning: "Vạc đồng cúng tế ba chân hai tai oai vệ", strokes: 13 },
  { id: 193, symbol: "鼓", pinyin: "gǔ", sinoViet: "Cổ", meaning: "Cái trống gõ nhạc binh", strokes: 13 },
  { id: 194, symbol: "鼠", pinyin: "shǔ", sinoViet: "Thử", meaning: "Con chuột gặm nhấm tinh nghịch", strokes: 13 },
  { id: 195, symbol: "鼻", pinyin: "bí", sinoViet: "Tị", meaning: "Cái mũi để hít thở khí trời", strokes: 14 },
  { id: 196, symbol: "齐", pinyin: "qí", sinoViet: "Tề", meaning: "Đều đặn, ngang bằng như ruộng lúa dọn sẵn", strokes: 14 },
  { id: 197, symbol: "齿", pinyin: "chǐ", sinoViet: "Xỉ", meaning: "Bộ răng người nhai", strokes: 15 },
  { id: 198, symbol: "龙", pinyin: "lóng", sinoViet: "Long", meaning: "Con rồng uốn mình bay lượn ngậm ngọc", strokes: 16 },
  { id: 199, symbol: "龟", pinyin: "guī", sinoViet: "Quy", meaning: "Con rùa mai cứng trường thọ", strokes: 16 },
  { id: 200, symbol: "龠", pinyin: "yuè", sinoViet: "Dược", meaning: "Nhạc cụ sáo trúc nhiều lỗ ghép thổi", strokes: 17 }
];

// --- 2. CƠ SỞ DỮ LIỆU NGUỒN GỐC CHI TIẾT CỦA CÁC CHỮ HÁN CỐT LÕI (ETIMOLOGY DATA) ---
export const etymologyData = {
  // --- LEVEL 1 (HSK 1) ---
  "我": {
    radicalSymbol: "戈",
    radicalName: "Qua",
    radicalMeaning: "Vũ khí cổ đại",
    description: "Chữ '我' ban đầu là hình vẽ của một loại vũ khí có nhiều răng cưa thời cổ đại (gần giống cây đinh ba hoặc cây qua). Về sau, do phát âm giống nhau, ký tự này được mượn âm để làm đại từ nhân xưng ngôi thứ nhất (tôi, ta) và giữ nguyên tự hình cho tới nay.",
    evolution: [
      { stage: "Giáp Cốt", character: "𢦏", desc: "Hình vẽ một thứ vũ khí sắc bén có ba răng cưa ở đầu." },
      { stage: "Kim Văn", character: "𢨊", desc: "Phần răng cưa và tay cầm được làm cân đối hơn, thể hiện sự cứng cáp." },
      { stage: "Tiểu Triện", character: "我", desc: "Đường nét được uốn tròn, tích hợp cấu trúc bộ Qua (戈) bên phải." },
      { stage: "Khải Thư", character: "我", desc: "Biến đổi thành dạng nét thẳng hiện đại như hiện nay." }
    ],
    story: "Hãy tưởng tượng tay trái bạn cầm một chiếc khiên tự vệ, tay phải bạn cầm vũ khí (戈 - Qua) sắc bén để bảo vệ chính mình. Vũ khí này được dùng để bảo vệ cái 'Tôi' (我) thiêng liêng nhất!"
  },
  "你": {
    radicalSymbol: "亻",
    radicalName: "Nhân đứng",
    radicalMeaning: "Con người",
    description: "Chữ ghép hội ý - hình thanh gồm bộ Nhân đứng (亻) chỉ người bên trái, và phần hài âm '尔' (nhĩ - bạn, cậu, có nghĩa gốc là lưới lọc hoặc hoa nở) ở bên phải. Sự kết hợp này mang nghĩa người đứng đối diện đang trò chuyện với mình.",
    evolution: [
      { stage: "Tiểu Triện", character: "你", desc: "Bộ Nhân (亻) đứng bên trái làm nghĩa, chữ Nhĩ (爾) đứng bên phải hài âm." },
      { stage: "Khải Thư", character: "你", desc: "Lược giản hóa phần bên phải thành chữ '尔' (nhĩ) gọn gàng để thuận tiện viết nhanh." }
    ],
    story: "Nói về 'Bạn' (你) thì nhất định phải là Con Người (亻). Bên phải là chữ '尔' (nhĩ - có nghĩa cổ là lưới tơ mịn màng). Một người (亻) luôn quan tâm dịu dàng đến bạn như lưới tơ mịn chính là 'Bạn' (你)."
  },
  "好": {
    radicalSymbol: "女",
    radicalName: "Nữ",
    radicalMeaning: "Người phụ nữ, con gái",
    description: "Chữ hội ý vô cùng đặc sắc và nhân văn của tiếng Trung. Kết hợp từ chữ Nữ (女 - người phụ nữ) và Tử (子 - đứa con, đứa trẻ). Hình ảnh người phụ nữ sinh được con trai con gái, hoặc người mẹ dang tay ôm ấp vỗ về đứa con chính là biểu tượng cho sự tốt đẹp nhất.",
    evolution: [
      { stage: "Giáp Cốt", character: "𡇴", desc: "Hình ảnh rõ nét của một người mẹ đang quỳ gối dang tay ôm đứa con nhỏ bên cạnh." },
      { stage: "Kim Văn", character: "𡇿", desc: "Đường nét được chạm khắc to hơn trên đỉnh đồng, hình tượng mẹ con sum vầy." },
      { stage: "Khải Thư", character: "好", desc: "Biến đổi thành cấu trúc song song vuông vắn, bên trái là chữ 女, bên phải là chữ 子." }
    ],
    story: "Trong văn hóa cổ đại, một gia đình trọn vẹn, ấm cúng có người phụ nữ (女) và có con cái (子) quây quần bên nhau chính là điều 'Tốt lành, hạnh phúc' (好) nhất trần đời."
  },
  "学": {
    radicalSymbol: "子",
    radicalName: "Tử",
    radicalMeaning: "Đứa trẻ, đứa con",
    description: "Chữ hội ý cổ. Bản thể cổ xưa của chữ 學 (học) gồm: hai bàn tay ở trên dâng một cuốn sách/kiến thức cho đứa trẻ ở dưới, xung quanh là phòng học được mái che (宀) bao bọc. Người xưa muốn truyền đạt rằng việc học là người lớn truyền trao tri thức cho con trẻ dưới mái trường học.",
    evolution: [
      { stage: "Giáp Cốt", character: "𦥯", desc: "Hình vẽ hai bàn tay đang chỉ bảo đứa trẻ sắp xếp các dụng cụ học tập trong phòng." },
      { stage: "Tiểu Triện", character: "學", desc: "Mái nhà (宀) được định hình rõ che chở cho đứa trẻ (子) bên dưới và các ký tự học thuật phía trên." },
      { stage: "Khải Thư", character: "学", desc: "Chữ giản thể lược bỏ các chi tiết rối rắm ở trên, giữ lại ba chấm nét và bộ Tử (子) ở dưới đáy." }
    ],
    story: "Để học tập tốt, một đứa trẻ (子) phải ngồi học dưới một mái nhà có gắn cột thu lôi trí tuệ (được tượng trưng bằng ba dấu chấm phía trên) để thu nạp kiến thức tinh hoa."
  },
  "国": {
    radicalSymbol: "囗",
    radicalName: "Vi",
    radicalMeaning: "Vây quanh, bờ cõi",
    description: "Chữ '国' (quốc) giản thể có bộ Vi (囗 - bờ cõi, biên giới) bao bọc bên ngoài chữ Ngọc (玉 - viên ngọc quý). Nghĩa là vùng đất biên cương khép kín chứa đựng báu vật. Trong chữ phồn thể 國, bên trong là chữ Hoặc (或 - gồm vũ khí 戈 Qua để bảo vệ lãnh thổ và cửa khẩu 口), tượng trưng cho việc dùng vũ khí canh giữ biên cương.",
    evolution: [
      { stage: "Giáp Cốt", character: "𢏗", desc: "Chỉ gồm chữ Qua (戈 - vũ khí) và chữ Khẩu (口 - vùng đất) biểu thị bảo vệ lãnh thổ." },
      { stage: "Kim Văn", character: "𦦏", desc: "Thêm bộ Vi (囗) bao quanh bên ngoài để khẳng định chủ quyền biên giới quốc gia." },
      { stage: "Khải Thư", character: "国", desc: "Giản thể hóa, thay chữ bên trong bằng viên ngọc (玉) quý giá báu vật của giang sơn." }
    ],
    story: "Một Quốc gia (国) trọn vẹn phải có biên giới vững chắc bao quanh (囗). Bên trong biên giới đó, báu vật quý giá nhất cần nâng niu bảo vệ chính là viên Ngọc quý (玉) - biểu trưng cho nhân dân và văn hóa giang sơn."
  },
  "人": {
    radicalSymbol: "人",
    radicalName: "Nhân",
    radicalMeaning: "Con người",
    description: "Chữ tượng hình thuần túy. Khắc họa hình ảnh một con người nhìn từ góc nghiêng đang đứng thẳng, hơi khom lưng chào hoặc đang bước đi bằng hai chân. Đây là một trong những chữ Hán cơ bản nhất và là bộ thủ tạo nên hàng trăm chữ Hán liên quan đến con người.",
    evolution: [
      { stage: "Giáp Cốt", character: "𠂇", desc: "Nét vẽ một người nhìn nghiêng đang đứng làm việc bằng hai chân rất sống động." },
      { stage: "Tiểu Triện", character: "人", desc: "Được cách điệu hóa thành hai nét đối xứng nâng đỡ nhau vững chãi." },
      { stage: "Khải Thư", character: "人", desc: "Nét phẩy trái và nét mác phải kéo dài chống đỡ nhau tạo nên hình chữ 人 vững vàng." }
    ],
    story: "Con người (人) muốn đứng vững trên cuộc đời này phải đứng bằng hai chân vững chãi, hoặc là hai con người phải tựa vào nhau, giúp đỡ lẫn nhau để cùng sinh tồn."
  },
  "日": {
    radicalSymbol: "日",
    radicalName: "Nhật",
    radicalMeaning: "Mặt trời, ban ngày",
    description: "Chữ tượng hình mặt trời. Ban đầu là một vòng tròn rực rỡ có một dấu chấm hoặc vạch ngang ở giữa biểu thị năng lượng chiếu sáng hoặc vết đen mặt trời. Qua thời gian, khi khắc trên đá và thẻ tre khó uốn cong, vòng tròn biến thành hình chữ nhật góc cạnh như ngày nay.",
    evolution: [
      { stage: "Giáp Cốt", character: "☉", desc: "Một hình tròn trịa hoàn hảo có chấm tròn năng lượng ở tâm đại diện cho thái dương." },
      { stage: "Tiểu Triện", character: "日", desc: "Hình tròn biến đổi thành hình oval thuôn dài có thanh ngang ở giữa chia tách." },
      { stage: "Khải Thư", character: "日", desc: "Vuông vức hóa hoàn toàn thành khối chữ nhật với nét ngang nằm ở trung tâm." }
    ],
    story: "Mặt trời (日) là khối phát sáng hình tròn khổng lồ ngoài vũ trụ. Nét ngang ở giữa chính là tia sáng rực rỡ từ tâm lõi thái dương đang sưởi ấm vạn vật mỗi ngày."
  },

  // --- LEVEL 2 (HSK 2) ---
  "爱": {
    radicalSymbol: "心",
    radicalName: "Tâm",
    radicalMeaning: "Trái tim, lòng dạ",
    description: "Chữ hội ý thể hiện triết lý sâu sắc. Chữ cổ 愛 gồm bộ Trảo (爫 - móng vuốt, bàn tay dâng tặng) ở trên, chữ Mịch (冖 - bao phủ trùm lên) ở giữa che chở cho bộ Tâm (心 - trái tim), và ở dưới cùng là bộ Truy (夊 - bước chân đi theo). Hợp ý lại là hành động dùng bàn tay nâng niu, dùng lòng che chở cho Trái tim của người mình yêu và tình nguyện bước đi theo người đó trọn đời.",
    evolution: [
      { stage: "Kim Văn", character: "𢖻", desc: "Một người đang ôm một trái tim lớn (心) thể hiện tình thương yêu." },
      { stage: "Tiểu Triện", character: "愛", desc: "Cấu trúc hóa đầy đủ các bộ phận: Bàn tay ôm ấp ở trên, mái che, trái tim tâm điểm và bước chân ở dưới." },
      { stage: "Khải Thư", character: "爱", desc: "Giản thể hóa, thay thế bộ Tâm (心) và Truy (夊) ở dưới bằng chữ Hựu (又 - bàn tay phải), nhưng bộ Tâm vẫn ẩn chứa tinh thần yêu thương." }
    ],
    story: "Tình yêu (爱) thực sự bắt nguồn từ tấm lòng tốt đẹp ở trên, và ở dưới là chữ Hựu (又 - bàn tay nắm chặt bàn tay). Yêu thương là dùng bàn tay hành động để bảo vệ và chăm sóc lẫn nhau."
  },
  "门": {
    radicalSymbol: "门",
    radicalName: "Môn",
    radicalMeaning: "Cánh cửa, cổng",
    description: "Chữ tượng hình vẽ lại chân thực một bộ cổng hai cánh thời cổ đại, có xà ngang giữ ở trên và trục xoay hai bên để đóng mở. Sang dạng giản thể, chữ được tinh giản thành một nét bao quanh nét chấm như ngày nay.",
    evolution: [
      { stage: "Giáp Cốt", character: "𡇎", desc: "Bức vẽ chi tiết về chiếc cổng nhà cổ gồm hai cánh đối xứng oai vệ." },
      { stage: "Tiểu Triện", character: "門", desc: "Làm mềm các góc cạnh của khung cổng chốt khóa chắc chắn." },
      { stage: "Khải Thư", character: "门", desc: "Giản thể hóa tối đa thành ba nét vẽ nhưng vẫn giữ nguyên hình dạng khung cửa mở rộng đón khách." }
    ],
    story: "Hãy nhìn chữ 门 xem: nét chấm bên trái giống chiếc then cài cửa, khung bao quanh chính là lối đi mở rộng đón chào mọi người bước qua cánh cổng vào nhà."
  },
  "问": {
    radicalSymbol: "门",
    radicalName: "Môn",
    radicalMeaning: "Cửa, cổng",
    description: "Chữ hội ý sinh động kết hợp giữa bộ Môn (门 - cánh cửa) bao bọc bên ngoài và bộ Khẩu (口 - cái miệng) ở bên trong. Ý nghĩa là ghé miệng vào khe cửa để cất tiếng hỏi thăm người trong nhà hoặc đứng ngoài cổng gọi vọng vào.",
    evolution: [
      { stage: "Giáp Cốt", character: "𡦿", desc: "Hình vẽ chiếc miệng (口) đặt ngay sát mép dưới của chiếc cổng (門) đang hé mở." },
      { stage: "Tiểu Triện", character: "問", desc: "Định hình chữ lồng chuẩn chỉnh: Cổng 門 bên ngoài che chắn cho chiếc miệng 口 phát âm ở trung tâm." },
      { stage: "Khải Thư", character: "问", desc: "Được giản thể hóa bộ Môn bên ngoài thành 门, giữ nguyên chiếc miệng 口 bên trong để cất tiếng hỏi." }
    ],
    story: "Muốn HỎI (问) một điều gì đó chưa biết, bạn phải đi đến tận Cửa (门) của người ta và mở cái Miệng (口) ra mà hỏi thăm đàng hoàng!"
  },
  "车": {
    radicalSymbol: "车",
    radicalName: "Xa",
    radicalMeaning: "Xe cộ, phương tiện",
    description: "Chữ tượng hình vẽ chiếc xe ngựa thời cổ nhìn từ trên cao xuống: có một trục dài ở giữa nối hai bánh xe tròn hai bên, khoang chở hàng hoặc chở người nằm ở trung tâm trục. Dạng giản thể cách điệu hóa bánh xe và trục thành nét ngang sổ vuông vức.",
    evolution: [
      { stage: "Giáp Cốt", character: "𡏑", desc: "Nét vẽ vô cùng chân thực vẽ hai bánh xe lớn đối xứng bên khoang kéo xe." },
      { stage: "Tiểu Triện", character: "車", desc: "Các bộ phận trục xe, căm xe và bánh xe được cách điệu thành chữ viết cân đối." },
      { stage: "Khải Thư", character: "车", desc: "Tối giản hóa toàn bộ kết cấu phức tạp thành bốn nét cơ bản đại diện cho xe cộ." }
    ],
    story: "Nét gạch ngang phía trên và dưới của chữ 车 đại diện cho hai bánh xe đang lăn bánh. Nét sổ dọc ở giữa chính là trục chính liên kết chuyển động giúp chiếc xe tiến bước."
  },
  "见": {
    radicalSymbol: "见",
    radicalName: "Kiến",
    radicalMeaning: "Trông thấy, nhìn thấy",
    description: "Chữ hội ý tượng hình. Được cấu thành từ bộ Mục (目 - con mắt) đặt phóng đại ở trên đầu một cơ thể người đang quỳ đứng (儿). Cổ nhân dùng hình ảnh nhấn mạnh con mắt to lớn của con người để biểu thị năng lượng thị giác, trông thấy, kiến diện.",
    evolution: [
      { stage: "Giáp Cốt", character: "𡍑", desc: "Nét vẽ một con người với con mắt cực lớn ở trên đầu đang ngước mắt nhìn." },
      { stage: "Tiểu Triện", character: "見", desc: "Bộ Mục 目 ở trên và bộ Nhân đi 儿 ở dưới được tiêu chuẩn hóa hài hòa." },
      { stage: "Khải Thư", character: "见", desc: "Lược bớt các nét nằm ngang trong bộ Mục, uốn cong nét móc bên phải tạo chữ 见 thanh thoát." }
    ],
    story: "Muốn GẶP hay NHÌN THẤY (见) ai đó, bạn phải dùng đôi Mắt (được cách điệu thành nửa trên chữ) và tự đi bằng đôi chân của mình (bộ 儿 bên dưới) để đến gặp họ."
  },

  // --- LEVEL 3 (HSK 3) ---
  "新": {
    radicalSymbol: "斤",
    radicalName: "Cân",
    radicalMeaning: "Cái rìu, búa",
    description: "Chữ hội ý hình thanh. Bên trái là chữ Tân (辛 - vất vả, đau đớn, mang nghĩa cổ là cây gỗ thô ráp mới đốn hạ), bên phải là bộ Cân (斤 - cái búa, cái rìu dùng để đục đẽo gỗ). Cổ nhân thể hiện hành động dùng búa đẽo vỏ cành cây khô ráp để lộ ra lõi gỗ thơm tho mới tinh bên trong.",
    evolution: [
      { stage: "Kim Văn", character: "𣢕", desc: "Hình ảnh rõ rệt một bàn tay cầm chiếc búa (斤) đang phạt cây mục tìm lõi gỗ." },
      { stage: "Tiểu Triện", character: "新", desc: "Chữ 辛 (Tân) và chữ 木 (Mộc) nằm bên trái, kết hợp chữ 斤 (Cân) sắc bén bên phải." },
      { stage: "Khải Thư", character: "新", desc: "Ba bộ phận được sắp xếp chặt chẽ tạo nên chữ Hán vuông vức hoàn thiện." }
    ],
    story: "Để tạo ra cái gì đó hoàn toàn MỚI (新), người ta phải đứng vững (立) trên nền tảng gỗ tốt (木) và can đảm dùng chiếc Rìu sắc bén (斤) đục đẽo, cải cách những nét cũ kỹ."
  },
  "难": {
    radicalSymbol: "隹",
    radicalName: "Chuy",
    radicalMeaning: "Loài chim đuôi ngắn",
    description: "Chữ hội ý hình thanh cổ. Cấu tạo phồn thể 難 gồm chữ Nan (𦰩 - một loại chim khát nước đang gặp nạn cháy rừng khô cằn) bên trái chỉ âm đọc cổ, và bộ Chuy (隹 - loài chim nhỏ) bên phải làm nghĩa. Hợp ý lại là loài chim nhỏ bé gặp hỏa hoạn hạn hán dữ dội, vô cùng khó khăn để sống sót.",
    evolution: [
      { stage: "Kim Văn", character: "𪅀", desc: "Hình vẽ một loài chim đang quằn quại trong lưới bẫy hoặc đống lửa." },
      { stage: "Tiểu Triện", character: "難", desc: "Hài hòa hóa bộ Chuy chim nhỏ bên phải và ký tự khó khăn hạn hán bên trái." },
      { stage: "Khải Thư", character: "难", desc: "Giản thể hóa, phần bên trái được rút gọn thành chữ Hựu (又 - bàn tay) bên cạnh bộ Chuy (隹) biểu thị gánh nặng đè lên vai." }
    ],
    story: "Việc 'Khó khăn' (难) giống như việc dùng bàn Tay (又) bé nhỏ của mình để bắt một chú chim nhỏ (隹) đang bay lượn tự do trên bầu trời cao rộng."
  },
  "意": {
    radicalSymbol: "心",
    radicalName: "Tâm",
    radicalMeaning: "Tâm trí, trái tim",
    description: "Chữ hội ý thể hiện tư duy triết học tuyệt vời. Chữ 意 gồm bộ Âm (音 - âm thanh, tiếng vang) ở trên và bộ Tâm (心 - trái tim, tâm thức) ở dưới. Ý nghĩa cốt lõi: Những tiếng lòng sâu kín nhất vang lên từ sâu thẳm Trái tim chính là Ý chí, Ý nghĩ, và Ý nghĩa tâm hồn.",
    evolution: [
      { stage: "Kim Văn", character: "𢛴", desc: "Hình ảnh một trái tim (心) có ký hiệu phát ra âm thanh âm vang từ tâm thức." },
      { stage: "Tiểu Triện", character: "意", desc: "Tiêu chuẩn hóa chữ Âm 音 ở trên đỉnh đầu và chữ Tâm 心 đặt trang trọng bên dưới nâng đỡ." },
      { stage: "Khải Thư", character: "意", desc: "Giữ nguyên cấu trúc cổ, các nét thẳng tắp toát lên khí phách ý chí sắc bén." }
    ],
    story: "Ý NGHĨA hay Ý CHÍ (意) của một con người chính là những Âm thanh (音) trong trẻo, chân thật nhất phát ra từ sâu thẳm Trái tim (心) thiện lương của họ."
  },

  // --- LEVEL 4 (HSK 4) ---
  "管": {
    radicalSymbol: "⺮",
    radicalName: "Trúc",
    radicalMeaning: "Cây tre, trúc",
    description: "Chữ hình thanh kết hợp bộ Trúc (⺮ - ống tre rỗng ruột) bên trên đại diện cho vật liệu, và chữ Quan (官 - quan lại, triều đình, người cai trị) bên dưới hài âm chỉ chức năng. Nghĩa gốc là chiếc sáo tre thổi nhạc, hoặc các loại ống dẫn nước. Vì ống tre dùng làm thẻ đo chuẩn mực thời xưa nên từ đó phát sinh nghĩa là cai quản, quản lý.",
    evolution: [
      { stage: "Tiểu Triện", character: "管", desc: "Bộ Trúc (⺮) ở trên làm nghĩa vật liệu tre rỗng, chữ Quan (官) ở dưới làm âm đọc." },
      { stage: "Khải Thư", character: "管", desc: "Hai phần kết hợp hoàn hảo thể hiện một chiếc ống tre dài tôn lên quyền uy cai quản." }
    ],
    story: "Để 'Cai quản, Quản lý' (管) hiệu quả, người làm Quan (官) thời xưa phải viết các chỉ dụ và quy định luật pháp lên những thẻ Tre (⺮) phẳng phiu để ban phát khắp nơi."
  },
  "简": {
    radicalSymbol: "⺮",
    radicalName: "Trúc",
    radicalMeaning: "Cây tre, trúc",
    description: "Chữ hình thanh kết hợp bộ Trúc (⺮ - cây tre) bên trên và chữ Gian (间 - khoảng trống giữa hai cánh cửa) ở dưới hài âm. Thời cổ đại chưa có giấy, người ta chẻ các thanh tre dẹt ra viết chữ rồi lấy dây xâu lại thành cuốn thẻ tre gọi là 'Giản sách'. Vì viết trên thẻ tre rất tốn diện tích nên câu văn phải súc tích, ngắn gọn, dễ hiểu, từ đó sinh nghĩa Đơn giản, Giản dị.",
    evolution: [
      { stage: "Tiểu Triện", character: "簡", desc: "Bộ Trúc ở trên đỉnh đầu làm nghĩa thanh tre viết chữ, chữ Gian (間) phồn thể nằm ở dưới làm âm đọc." },
      { stage: "Khải Thư", character: "简", desc: "Giản thể hóa phần bên dưới thành chữ 间 ngắn gọn, mang trọn vẹn tinh thần tối giản." }
    ],
    story: "Từ xưa viết chữ lên thẻ Tre (⺮) vô cùng cực khổ, thế nên câu chữ phải được viết thật súc tích, ngắn gọn, chừa lại Khoảng trống (间) thông thoáng mới gọi là 'Đơn giản' (简)!"
  },

  // --- LEVEL 5 (HSK 5) ---
  "规": {
    radicalSymbol: "见",
    radicalName: "Kiến",
    radicalMeaning: "Trông thấy, quan sát",
    description: "Chữ hội ý hình thanh. Bên trái là chữ Phu (夫 - người đàn ông trưởng thành, trượng phu), bên phải là bộ Kiến (见 - nhìn thấy, quan sát). Nghĩa cổ của chữ là dụng cụ vẽ hình tròn (cái com-pa) hoặc thước đo thẳng. Ý nghĩa triết lý: Người trượng phu (夫) có tầm nhìn (见) xa trông rộng mới đủ tư cách đặt ra Quy định, Quy tắc chuẩn mực cho xã hội.",
    evolution: [
      { stage: "Tiểu Triện", character: "規", desc: "Chữ Phu (夫) đứng thẳng bên trái làm nhiệm vụ hài âm và biểu ý hành động đo đạc, bộ Kiến (見) bên phải trông coi." },
      { stage: "Khải Thư", character: "规", desc: "Bộ Kiến được viết thành chữ giản thể 见 thanh thoát làm điểm tựa cho chữ Phu bên trái." }
    ],
    story: "Một 'Quy tắc, Quy định' (规) chuẩn mực muốn được mọi người tuân theo thì phải do một đấng Trượng phu (夫) có tầm nhìn rộng mở, biết Quan sát (见) thực tế đặt ra."
  },
  "服": {
    radicalSymbol: "月",
    radicalName: "Nhục / Nguyệt",
    radicalMeaning: "Da thịt, mặt trăng",
    description: "Chữ hội ý mang bối cảnh cổ đại thú vị. Chữ cổ gồm bộ Châu (舟 - chiếc thuyền nhỏ, sau biến đổi nhầm thành bộ Nguyệt 月) bên trái chỉ vật chứa, bên phải là hình ảnh hai bàn tay đang kẹp uốn nắn một người phải phục tùng quỳ gối dưới sức mạnh. Nghĩa gốc là phục tùng, phục vụ. Về sau, do thói quen mặc y phục khi làm lễ phục tùng quân chủ, chữ chuyển sang nghĩa y phục, quần áo.",
    evolution: [
      { stage: "Giáp Cốt", character: "𦨶", desc: "Hình ảnh một người quỳ phục dịch trên mạn thuyền dưới bàn tay điều khiển của chủ nhân." },
      { stage: "Tiểu Triện", character: "服", desc: "Chuyển chiếc thuyền bên trái thành hình tựa trăng khuyết 月, bên phải cách điệu hóa tay đòn uốn nắn." },
      { stage: "Khải Thư", character: "服", desc: "Mười nét vẽ vuông vắn đại diện cho phong cách trang phục trang nghiêm phục tùng." }
    ],
    story: "Để 'Thuyết phục' hay 'Phục dịch' tốt, người đó phải giữ tâm hồn sáng như trăng rằm (月), tay trái dâng quà (卩 - Tiết), tay phải (又 - Hựu) kính cẩn chỉnh tề áo mũ quần áo (服)."
  },

  // --- LEVEL 6 (HSK 6) ---
  "策": {
    radicalSymbol: "⺮",
    radicalName: "Trúc",
    radicalMeaning: "Cây tre, trúc",
    description: "Chữ hình thanh kết hợp bộ Trúc (⺮ - ống tre) làm nghĩa vật liệu và chữ Thích (朿 - gai nhọn, gai gỗ cây) ở dưới hài âm. Nghĩa gốc là roi tre có gắn gai nhọn dùng để thúc ngựa chạy nhanh. Vì roi ngựa giúp người cưỡi định hướng đường đi cho ngựa, từ đó sinh nghĩa mưu lược, sách lược, quyết sách, hướng đi chiến lược.",
    evolution: [
      { stage: "Tiểu Triện", character: "策", desc: "Tre trúc (⺮) xanh mướt ngự trị ở trên đầu, cành gai nhọn (朿) nhọn hoắt đứng ở dưới đáy." },
      { stage: "Khải Thư", character: "策", desc: "Các nét ngang dọc gãy gọn tạo khí phách cho mưu lược chiến thuật oai dũng." }
    ],
    story: "Một 'Chiến lược, Quyết sách' (策) khôn ngoan giống như chiếc roi ngựa bằng Tre (⺮) có gai nhọn (朿) - tuy đau đớn nhưng định hướng cực kỳ chính xác giúp con ngựa chiến lao thẳng về đích."
  },
  "益": {
    radicalSymbol: "皿",
    radicalName: "Mãnh",
    radicalMeaning: "Cái bát chén đựng thức ăn",
    description: "Chữ tượng hình hội ý tuyệt vời. Phía trên là chữ Thủy (水 - dòng nước xoay ngang thành nét ba chấm 丷), phía dưới là bộ Mãnh (皿 - cái bát chén đựng thức ăn thức uống). Hình ảnh dòng nước trào dâng tràn đầy ra ngoài miệng bát biểu thị sự dư dả, phong phú, gia tăng lợi ích, vô cùng bổ ích.",
    evolution: [
      { stage: "Giáp Cốt", character: "𥁋", desc: "Bức vẽ cực kỳ sinh động dòng nước (水) tràn trề chảy qua hai bên thành của một chiếc vạc/chén (皿)." },
      { stage: "Tiểu Triện", character: "益", desc: "Cách điệu hóa dòng nước thành ký tự trông như đôi sừng ở trên đầu chiếc đĩa đựng." },
      { stage: "Khải Thư", character: "益", desc: "Nước xoay ngang thành chữ 𣎳 kết hợp ăn khớp hoàn hảo nâng đỡ bộ Mãnh 皿 ở đáy." }
    ],
    story: "LỢI ÍCH hay BỔ ÍCH (益) chính là khi bạn rót đầy Nước sạch (đôi nét ở trên) tràn đầy, dư dả ra ngoài chiếc Bát ăn (皿) - tượng trưng cho sự thịnh vượng ấm no sẻ chia."
  }
};
