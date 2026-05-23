# 🇨🇳 Chinese Learning Web Application (Học Tiếng Trung HSK 1 - 6)

[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Gh-Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white)](https://pages.github.com)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat-square)](LICENSE)

Chào mừng bạn đến với **Chinese Learning Web Application** – Một ứng dụng web học tiếng Trung hiện đại, trực quan và toàn diện. Ứng dụng tập trung tối ưu hóa trải nghiệm tự học thông qua việc huấn luyện chuyên sâu **6 kỹ năng ngôn ngữ cốt lõi (Nghe - Nói - Đọc - Viết - Gõ - Thẻ ghi nhớ 3D)** trải dài từ cấp độ **HSK/TOCFL 1 đến 6**, tích hợp **Hệ thống Học thích ứng thông minh (ZPD & DDA Engine)**, **Từ điển tra cứu Hán-Việt đa năng**, **Giao diện đa ngôn ngữ** và thiết kế tối ưu trên mọi thiết bị di động.

👉 **Môi trường trực tuyến**: Ứng dụng đã được xuất bản tự động và chạy ổn định trên GitHub Pages.

---

## 🌟 Tính năng Nổi bật

### 1. Hệ thống Học thích ứng thông minh (ZPD & DDA Engine)
* **ZPD Lesson Builder (Vùng phát triển gần nhất)**: Thuật toán sắp xếp bài học và gợi ý từ vựng theo tỷ lệ vàng **3-5-2**: 3 từ Yếu điểm (Weakness), 5 từ Mục tiêu (Target) và 2 từ Thách thức (Challenge).
* **Điều chỉnh độ khó động (DDA)**: Tự động điều chỉnh giao diện và độ khó theo điểm số năng lực (Mastery Score):
  - *Viết chữ*: Hiện/ẩn outline và số lần gợi ý nét chuẩn tùy theo trình độ.
  - *Nghe*: Rút ngắn/mở rộng số lượng phương án nhiễu, tự động sinh nhiễu đồng âm hoặc chung bộ thủ khó ở mức năng lượng cao.
  - *Nói*: Điều chỉnh ngưỡng chính xác (%) từ 70% đến 90% kết hợp so khớp thanh điệu nghiêm ngặt (Strict Tone check).
  - *Gõ*: Che chữ Hán mẫu hoặc che hoàn toàn Pinyin để người học tự nhớ cấu trúc từ.

### 2. Cơ sở Dữ liệu Từ vựng Khổng lồ 5.000+ Từ
* **5.000+ từ vựng chuẩn hóa**: Hợp nhất kho **2.400+ Hán tự đơn** cốt lõi từ `vocabulary.js` và **2.600+ từ ghép HSK 3-6** nén từ `hskCompoundWords.js` được tải bất đồng bộ nhằm tối ưu hóa bundle.
* **Đầy đủ thông tin chi tiết**: Mỗi từ vựng bao gồm Chữ giản thể, Chữ phồn thể, Phiên âm Pinyin, **Phiên âm Hán-Việt** (ví dụ: `学习` -> `Học Tập`), Nghĩa tiếng Việt tự nhiên và Phân nhóm chủ đề học tập.

### 3. Giao diện Đa ngôn ngữ UI (Multi-language Support)
* **Hỗ trợ 3 ngôn ngữ**: Tiếng Việt (`vi`), Chữ Hán Giản thể (`zh-CN`), và Chữ Hán Phồn thể (`zh-TW`).
* **Đồng bộ hóa tức thì**: Người dùng có thể chuyển đổi ngôn ngữ qua bộ chọn kính mờ (glassmorphic select) trên Header. Lựa chọn được lưu tự động vào `LocalStorage` để duy trì phiên bản hiển thị ưa thích.
* **Bản địa hóa toàn diện**: Dịch toàn bộ thanh điều hướng, nhãn kỹ năng, thống kê thành tích, nút hành động và bong bóng hội thoại tương tác của linh vật Mascot.

### 4. Huấn luyện 6 Kỹ năng Ngôn ngữ Chuyên sâu
* **🎴 Kỹ năng Thẻ ghi nhớ 3D Glassmorphic Thích ứng (Flashcards)**:
  - **Đa nguồn học (Deck Selector)**: Học theo cấp độ HSK, theo từ tự thêm cá nhân hoặc **Bộ từ vựng Yếu điểm (Hay sai) đồng bộ thời gian thực** (áp dụng logic chronological latest logs, tự động purge những từ học viên đã học lại và pass bài thi).
  - **Trải nghiệm 3D mượt mà**: Perspective lật 3D 60fps mượt mà trên PC và Mobile.
  - **Tone Color Pinyin & Âm Hán-Việt**: Tô màu pinyin theo 5 thanh điệu chuẩn quốc tế giúp ghi nhớ trực quan cực nhanh, tự động ánh xạ âm Hán-Việt phong phú.
  - **Quy trình học hai pha**: Pha Học chủ động (đầy đủ Pinyin, Hán-Việt, ví dụ, audio phát âm và phím tắt rating) kết hợp cùng Pha Kiểm tra phản xạ (trắc nghiệm 3 lựa chọn ẩn pinyin/nghĩa để đánh giá trí nhớ khách quan).
  - **Báo cáo & Tra lỗi tương tác**: Tổng hợp kết quả thi thành hai cột Đã thuộc / Chưa thuộc kèm Explorer Widget nhấp chọn tra cứu chi tiết nhanh.
* **⌨️ Kỹ năng Luyện gõ chữ (Typing)**:
  - **Chế độ Luyện câu (Sentence Mode)**: Nâng cấp tổng số câu bài tập tĩnh lên **90 câu chất lượng cao** (15 câu cho mỗi cấp độ HSK 1-6), giúp người học củng cố cấu trúc câu và ngữ pháp thực tế.
  - **Chế độ Luyện từ vựng (Vocabulary Mode)**: Tự động sinh ngẫu nhiên **10 từ vựng** mỗi lượt từ kho dữ liệu cấp độ tương ứng. Hỗ trợ che chữ Hán thông minh dạng nét đứt `_ _`, đi kèm **Pinyin**, **Nghĩa tiếng Việt**, và đặc biệt là **Âm Hán-Việt (Sino-Viet)** trực quan.
  - **Màn hình chúc mừng Round Clear**: Card chúc mừng kính mờ (Glassmorphism) đẹp mắt khi hoàn thành xuất sắc 10 từ kèm nút "Lượt ngẫu nhiên tiếp theo ➜" để tiếp tục học.
* **✍️ Kỹ năng Viết (Writing)**:
  - Tích hợp bảng vẽ Canvas tương tác dùng chuột hoặc màn hình cảm ứng di động.
  - Hỗ trợ hoạt ảnh vẽ mẫu theo từng nét bút (stroke-by-stroke) chuẩn xác.
  - **Khóa cuộn trang di động (Touch Lock)**: Sử dụng thuộc tính `touch-action: none` để ngăn chặn màn hình bị giật nảy hoặc cuộn trang khi vẽ chữ bằng ngón tay.
  - **Bảng viết tay mở rộng**: Tích hợp công nghệ nhận diện và vẽ nét mượt mà trên nhiều thiết bị.
* **📚 Kỹ năng Đọc hiểu (Reading)**:
  - Kho **42 bài học đọc hiểu chất lượng cao** (7 bài mỗi cấp độ).
  - Tích hợp văn bản giản/phồn thể, phiên âm Pinyin (có thể bật/tắt), bản dịch mượt mà và từ vựng trọng tâm.
  - Câu hỏi trắc nghiệm có **giải thích chi tiết bằng tiếng Việt** giúp hiểu sâu ngữ cảnh.
  - **Tranh minh họa thủy mặc cao cấp**: Tích hợp **12 tác phẩm nghệ thuật màu nước & thủy mặc (Watercolor & Ink Wash style)** tinh xảo cho 12 câu chuyện HSK 1-3, thiết kế theo bố cục phân lớp dọc (`Vertical Stack Layout`) hiển thị trọn vẹn banner 280px, và hệ màu CSS Gradient phái sinh động cho các cấp độ cao hơn.
* **🎧 Kỹ năng Nghe (Listening)**:
  - **Chế độ Luyện nghe câu (Sentence Mode)**: Giọng đọc bản xứ chuẩn thông qua Speech Synthesis API, tùy chỉnh tốc độ chuẩn `🔊` và tốc độ rùa `🐢`.
  - **Chế độ Luyện nghe từ vựng (Vocabulary Mode)**: Khai thác kho **5000+ từ vựng** sinh ngẫu nhiên **10 câu trắc nghiệm nghe** mỗi lượt học.
  - **Trình sinh trắc nghiệm độc bản (Dynamic Quiz Generator)**: Tạo 4 phương án trắc nghiệm nghĩa tiếng Việt (1 đúng, 3 đáp án gây nhiễu ngẫu nhiên cùng cấp độ, bảo đảm không trùng lặp nghĩa).
  - **Hộp thoại thông tin Từ vựng (Vocabulary Details Drawer)**: Khi kiểm tra đáp án, hiển thị ngăn thông tin bổ sung Hán tự (giản/phồn), Pinyin chi tiết và huy hiệu **Hán-Việt** nổi bật.
  - **Màn hình chúc mừng Round Clear & Giải thích chuyên sâu**: Cung cấp giải thích chi tiết bằng tiếng Việt ngay khi kiểm tra đáp án *dành riêng cho HSK 1-3*.
* **🗣️ Kỹ năng Nói (Speaking)**:
  - **Chế độ Luyện câu (Sentence Mode)**: Lắng nghe và đọc to các câu giao tiếp thực tế theo cấp độ.
  - **Chế độ Luyện từ vựng (Vocabulary Mode)**: Chọn lọc 10 từ vựng ngẫu nhiên từ kho 5000+ từ vựng để luyện phát âm, hiển thị Hán tự giản/phồn, Pinyin, nghĩa và âm Hán-Việt liên tưởng.
  - **Interactive Progress Dots & Chấm điểm thông minh**: Theo dõi tiến trình qua các chấm tròn chuyển động. Sử dụng **Speech Recognition API** nhận diện giọng nói và chấm điểm phần trăm chính xác (Excellent >=80% nhận **+20 XP**, Good >=50% nhận **+10 XP**).
  - **Chế độ Giả lập (Simulation Fallback Mode)**: Tự động chuyển sang chế độ giả lập nếu trình duyệt thiếu quyền truy cập Micro, bảo toàn tiến trình học tập và phần thưởng XP.
  - **Màn hình chúc mừng Round Clear**: Card kính mờ chúc mừng hoàn thành lượt kèm nút bắt đầu lượt mới nhanh chóng.

### 5. Hệ thống Từ điển Tra cứu Hán-Việt Đa năng (`DictionaryModal`)
* **Kích hoạt nhanh**: Nút kính mờ màu Teal (`🔍`) nổi bật trên Header cho phép tra cứu từ bất kỳ màn hình nào.
* **Tìm kiếm song song**: Tìm kiếm đồng thời theo Chữ giản/phồn, Pinyin (có/không dấu), âm Hán-Việt hoặc nghĩa tiếng Việt (tự động chuẩn hóa chiỗi loại bỏ dấu).
* **Thông tin chi tiết chuyên sâu**:
  - Tích hợp phát âm giọng bản xứ `🔊`, bộ thủ, mẹo ghi nhớ chữ Hán.
  - **Sơ đồ tiến hóa chữ viết cổ đại**: Mô phỏng sự tiến hóa của chữ Hán qua 4 thời kỳ lịch sử tiêu biểu: *Giáp Cốt Văn (Oracle Bone), Kim Văn (Bronze), Tiểu Triện (Seal), Khải Thư (Regular Script)* với thiết kế giả lập chất liệu lịch sử (xương khắc, đồng đúc, dấu ấn, nét cọ).
  - **Liên kết tập viết nhanh (`✍️`)**: Tự động chuyển kỹ năng viết và nạp chữ Hán được chọn vào Canvas tập viết ngay lập tức.

### 6. Quản lý Từ vựng Cá nhân (Custom Words)
* Cho phép người học tự thêm, chỉnh sửa hoặc xóa các từ vựng mới của riêng mình.
* Tự động tra cứu fallback phiên âm Hán-Việt từ file bản đồ âm `sinoVietMap.js` khi thêm từ.

### 7. Thẩm mỹ Glassmorphism & Tương thích Di động tối đa
* Thiết kế kính mờ (Glassmorphism), viền phát sáng nhẹ, đổ bóng và các vi chuyển động (micro-animations) mượt mà.
* **Thanh điều hướng dưới cùng di động (Mobile Bottom Nav)**: Đối với các màn hình nhỏ `<768px`, thanh Sidebar bên trái sẽ tự động ẩn đi và thanh điều hướng dưới chân trang sẽ hiển thị theo chuẩn ứng dụng di động native, mang lại trải nghiệm tiện lợi tối đa.
* **Tương thích & Sửa lỗi Âm thanh trên Điện thoại**: Tự động kích hoạt cơ chế mở khóa Web Audio qua tương tác chạm đầu tiên của người dùng (`touchstart` / `click`). Khắc phục lỗi đóng băng giọng đọc trên hệ điều hành iOS (deadlock Safari TTS) bằng kiểm tra `.speaking` thông minh trước khi nạp phát âm mới.
* **Trợ lý Mascot tương tác**: Chú gấu trúc/trâu nước xuất hiện sinh động, đưa ra lời khuyên học tập, phản hồi kết quả trắc nghiệm và khích lệ tinh thần người học.

---

## 📂 Cấu trúc Thư mục Dự án

```text
Chinese_Learning/
├── public/                 # Các tài nguyên tĩnh công cộng (icons, fonts, images minh họa)
├── scratch/                # Các script tự động hóa, tối ưu dữ liệu & phân tích học tập
├── src/
│   ├── assets/             # Hình ảnh và tệp CSS dùng chung
│   ├── components/         # Các thành phần giao diện của ứng dụng
│   │   ├── DictionaryModal.jsx   # Modal từ điển Hán-Việt đa năng & tiến hóa chữ cổ
│   │   ├── HandwritingPad.jsx    # Bảng viết tay vẽ tự do hỗ trợ Canvas
│   │   ├── Header.jsx            # Thanh điều hướng đầu trang và nút tra cứu
│   │   ├── Mascot.jsx            # Trợ lý Mascot tương tác dễ thương
│   │   ├── SkillFlashcards.jsx   # Kỹ năng thứ 6: Thẻ ghi nhớ 3D Glassmorphic Thích ứng
│   │   ├── SkillListening.jsx    # Giao diện luyện kỹ năng Nghe hiểu (nghe từ vựng & giải thích HSK 1-3)
│   │   ├── SkillReading.jsx      # Giao diện luyện kỹ năng Đọc hiểu & làm bài trắc nghiệm
│   │   ├── SkillSpeaking.jsx     # Giao diện luyện Nói & Nhận diện phát âm (nghe từ vựng & Speech Recog)
│   │   ├── SkillTyping.jsx       # Giao diện luyện kỹ năng Gõ chữ (câu ứng dụng & từ vựng 2400+)
│   │   └── SkillWriting.jsx      # Bảng vẽ Canvas & vẽ theo nét bút
│   ├── data/               # Cơ sở dữ liệu và ánh xạ dữ liệu tĩnh
│   │   ├── etymologyData.js      # Dữ liệu nguồn gốc và tiến hóa chữ cổ (Oracle, Bronze, Seal)
│   │   ├── hskCompoundWords.js   # CSDL nén 2.606 từ ghép HSK cấp độ 3-6
│   │   ├── sinoVietMap.js        # Bản đồ âm tự động ánh xạ chữ Hán -> Phiên âm Hán-Việt
│   │   ├── translations.js       # Từ điển dịch thuật giao diện đa ngôn ngữ (vi, zh-CN, zh-TW)
│   │   ├── typingData.js         # Cơ sở dữ liệu 90 câu bài tập luyện gõ chữ Hán
│   │   └── vocabulary.js         # Toàn bộ database từ vựng (2400+ từ) và bài tập 4 kỹ năng
│   ├── App.css             # CSS chính điều khiển bố cục ứng dụng
│   ├── App.jsx             # File điều hướng logic cốt lõi của ứng dụng (uiLang, t())
│   ├── index.css           # Hệ thống CSS Token, biến toàn cục, hiệu ứng và responsive / Bottom Nav
│   ├── main.jsx            # Điểm khởi chạy React của ứng dụng
│   └── lib/                # Các thư viện bổ trợ tiện ích
│       └── adaptiveLearning.js   # Động cơ học tập thích ứng (ZPD & DDA algorithms)
├── eslint.config.js        # Cấu hình kiểm lỗi mã nguồn ESLint
├── index.html              # Trang gốc HTML chứa cấu trúc SEO tiêu chuẩn
├── package.json            # Quản lý thư viện phụ thuộc và lệnh thực thi dự án
├── vite.config.js          # Cấu hình đóng gói và biên dịch dự án Vite
└── README.md               # Hướng dẫn chi tiết dự án (Tệp tin này)
```

---

## 🛠️ Công nghệ Sử dụng

1. **React 19 & Vite 8**: Nền tảng giao diện component hóa, tải trang cực nhanh với cơ chế Hot Module Replacement (HMR).
2. **Vanilla CSS**: Tùy biến sâu sắc để tạo dựng hệ thống biến giao diện (`css-variables`), hỗ trợ hiệu ứng chuyển cảnh mượt mà và giao diện thích ứng responsive không cần phụ thuộc vào framework bên ngoài.
3. **Web APIs tích hợp**:
   - **SpeechSynthesis**: Phát âm thanh tiếng Trung tự nhiên chuẩn giọng bản địa.
   - **SpeechRecognition**: Thu âm và nhận dạng giọng nói chấm điểm trực tiếp.
   - **HTML5 Canvas**: Vẽ và kiểm tra tọa độ nét chữ phục vụ kỹ năng viết.
4. **Local Storage**: Đồng bộ lưu trữ tiến trình làm bài trắc nghiệm, ngôn ngữ hiển thị UI, lịch sử học tập và từ vựng tùy chỉnh.

---

## 🚀 Hướng dẫn Cài đặt & Sử dụng cục bộ

Để chạy dự án này trên máy tính của bạn, hãy đảm bảo bạn đã cài đặt [Node.js](https://nodejs.org) (phiên bản 18 trở lên).

### Bước 1: Sao chép dự án về máy
```bash
git clone https://github.com/Vincentius-Vu/Chinese_Learning.git
cd Chinese_Learning
```

### Bước 2: Cài đặt các thư viện phụ thuộc
```bash
npm install
```

### Bước 3: Khởi chạy môi trường phát triển (Local Dev Server)
```bash
npm run dev
```
Trình duyệt sẽ tự động mở trang web học tập tại địa chỉ: `http://localhost:5173`.

### Bước 4: Biên dịch dự án ra sản phẩm tối ưu (Production Build)
```bash
npm run build
```
Sản phẩm được nén và đóng gói tối ưu hóa sẽ nằm trong thư mục `dist`.

### Bước 5: Triển khai trực tiếp lên GitHub Pages (Deploy)
```bash
npm run deploy
```
Lệnh này sẽ tự động chạy biên dịch dự án (`predeploy`) và đẩy trực tiếp mã nguồn lên nhánh `gh-pages` của GitHub để xuất bản ứng dụng ra internet.

---

## 📄 Bản quyền & Đóng góp

Dự án này được phân phối dưới giấy phép **GNU General Public License v3 (GPL v3)** – một giấy phép mã nguồn mở cực kỳ mạnh mẽ bảo vệ tối đa quyền lợi của cộng đồng phát triển mã nguồn mở (Copyleft).

> **Ý nghĩa của GNU GPL v3**:
> Giấy phép GPL v3 đảm bảo rằng ứng dụng này sẽ mãi mãi là phần mềm tự do và mã nguồn mở. Bất kỳ ai sử dụng, sửa đổi hoặc tạo ra sản phẩm phái sinh từ ứng dụng này và phân phối ra ngoài **bắt buộc phải mở mã nguồn** của sản phẩm đó dưới cùng giấy phép GPL v3. Điều này ngăn chặn triệt để việc thương mại hóa đóng mã nguồn (proprietary fork) từ các cải tiến của dự án.

Mọi đóng góp, báo lỗi hoặc đề xuất cải tiến tính năng đều được hoan nghênh nhiệt liệt thông qua phần **Issues** hoặc **Pull Requests** trên GitHub.

*Chúc các bạn có những giờ học tiếng Trung thật bổ ích và thú vị cùng **Chinese Learning Web Application**! 🐃🎒*
