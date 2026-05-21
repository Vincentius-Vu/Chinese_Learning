# 🇨🇳 Chinese Learning Web Application (Học Tiếng Trung HSK 1 - 6)

[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Gh-Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white)](https://pages.github.com)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat-square)](LICENSE)

Chào mừng bạn đến với **Chinese Learning Web Application** – Một ứng dụng web học tiếng Trung hiện đại, trực quan và toàn diện. Ứng dụng tập trung tối ưu hóa trải nghiệm tự học thông qua việc huấn luyện chuyên sâu **4 kỹ năng ngôn ngữ cốt lõi (Nghe - Nói - Đọc - Viết)** trải dài từ cấp độ **HSK/TOCFL 1 đến 6**, tích hợp hệ thống **Từ điển tra cứu Hán-Việt thông minh**, **Giao diện đa ngôn ngữ** và thanh điều hướng di động tối ưu.

👉 **Môi trường trực tuyến**: Ứng dụng đã được xuất bản tự động và chạy ổn định trên GitHub Pages.

---

## 🌟 Tính năng Nổi bật

### 1. Cơ sở Dữ liệu Từ vựng Khổng lồ & Chuẩn hóa
* **1.800 từ vựng cốt lõi**: Phân bổ đồng đều 300 từ cho mỗi cấp độ HSK/TOCFL 1-6.
* **Đầy đủ thông tin chi tiết**: Mỗi từ vựng bao gồm Chữ giản thể (Simplified), Chữ phồn thể (Traditional), Phiên âm Pinyin, **Phiên âm Hán-Việt** (ví dụ: `学习` -> `Học Tập`), Nghĩa tiếng Việt tự nhiên và Phân nhóm chủ đề học tập.

### 2. Giao diện Đa ngôn ngữ UI (Multi-language Support)
* **Hỗ trợ 3 ngôn ngữ**: Tiếng Việt (`vi`), Chữ Hán Giản thể (`zh-CN`), và Chữ Hán Phồn thể (`zh-TW`).
* **Đồng bộ hóa tức thì**: Người dùng có thể chuyển đổi ngôn ngữ qua bộ chọn kính mờ (glassmorphic select) trên Header. Lựa chọn được lưu tự động vào `LocalStorage` để duy trì phiên bản hiển thị ưa thích.
* **Bản địa hóa toàn diện**: Dịch toàn bộ thanh điều hướng, nhãn kỹ năng, thống kê thành tích, nút hành động và bong bóng hội thoại tương tác của linh vật Mascot.

### 3. Huấn luyện 4 Kỹ năng Ngôn ngữ Chuyên sâu
* **✍️ Kỹ năng Viết (Writing)**:
  - Tích hợp bảng vẽ Canvas tương tác dùng chuột hoặc màn hình cảm ứng di động.
  - Hỗ trợ hoạt ảnh vẽ mẫu theo từng nét bút (stroke-by-stroke) chuẩn xác.
  - **Khóa cuộn trang di động (Touch Lock)**: Sử dụng thuộc tính `touch-action: none` để ngăn chặn màn hình bị giật nảy hoặc cuộn trang khi vẽ chữ bằng ngón tay.
* **📚 Kỹ năng Đọc hiểu (Reading)**:
  - Kho **42 bài học đọc hiểu chất lượng cao** (7 bài mỗi cấp độ).
  - Tích hợp văn bản giản/phồn thể, phiên âm Pinyin (có thể bật/tắt), bản dịch mượt mà và từ vựng trọng tâm.
  - Câu hỏi trắc nghiệm có **giải thích chi tiết bằng tiếng Việt** giúp hiểu sâu ngữ cảnh.
* **🎧 Kỹ năng Nghe (Listening)**:
  - Tích hợp giọng đọc bản xứ chuẩn giọng Bắc Kinh thông qua **Speech Synthesis API** (hỗ trợ điều chỉnh tốc độ chuẩn `🔊` và tốc độ chậm của rùa `🐢`).
  - Hệ thống trắc nghiệm lựa chọn nghĩa kèm kịch bản nghe trực quan.
  - **Giải thích Hán-Việt chuyên sâu**: Cung cấp giải thích chi tiết bằng tiếng Việt ngay khi kiểm tra đáp án *chỉ dành riêng cho Cấp độ 1, 2 và 3*. Ẩn giải thích ở Level 4+ để duy trì thử thách tự nhiên cho người học trung-cao cấp.
* **🗣️ Kỹ năng Nói (Speaking)**:
  - Sử dụng **Speech Recognition API** nhận diện giọng nói và chấm điểm phát âm tiếng Trung theo thời gian thực (hiển thị thang điểm phần trạng chính xác).

### 4. Hệ thống Từ điển Tra cứu Hán-Việt Đa năng (`DictionaryModal`)
* **Kích hoạt nhanh**: Nút kính mờ màu Teal (`🔍`) nổi bật trên Header cho phép tra cứu từ bất kỳ màn hình nào.
* **Tìm kiếm song song**: Tìm kiếm đồng thời theo Chữ giản/phồn, Pinyin (có/không dấu), âm Hán-Việt hoặc nghĩa tiếng Việt (tự động chuẩn hóa chiỗi loại bỏ dấu).
* **Thông tin chi tiết chuyên sâu**:
  - Tích hợp phát âm giọng bản xứ `🔊`, bộ thủ, mẹo ghi nhớ chữ Hán.
  - **Sơ đồ tiến hóa chữ viết cổ đại**: Mô phỏng sự tiến hóa của chữ Hán qua 4 thời kỳ lịch sử tiêu biểu: *Giáp Cốt Văn (Oracle Bone), Kim Văn (Bronze), Tiểu Triện (Seal), Khải Thư (Regular Script)* với thiết kế giả lập chất liệu lịch sử (xương khắc, đồng đúc, dấu ấn, nét cọ).
  - **Liên kết tập viết nhanh (`✍️`)**: Tự động chuyển kỹ năng viết và nạp chữ Hán được chọn vào Canvas tập viết ngay lập tức.

### 5. Quản lý Từ vựng Cá nhân (Custom Words)
* Cho phép người học tự thêm, chỉnh sửa hoặc xóa các từ vựng mới của riêng mình.
* Tự động tra cứu fallback phiên âm Hán-Việt từ file bản đồ âm `sinoVietMap.js` khi thêm từ.

### 6. Thẩm mỹ Glassmorphism & Tối ưu Di động
* Thiết kế kính mờ (Glassmorphism), viền phát sáng nhẹ, đổ bóng và các vi chuyển động (micro-animations) mượt mà.
* **Thanh điều hướng dưới cùng di động (Mobile Bottom Nav)**: Đối với các màn hình nhỏ `<768px`, thanh Sidebar bên trái sẽ tự động ẩn đi và thanh điều hướng dưới chân trang sẽ hiển thị theo chuẩn ứng dụng di động native, mang lại trải nghiệm tiện lợi tối đa.
* **Trợ lý Mascot tương tác**: Chú gấu trúc/trâu nước xuất hiện sinh động, đưa ra lời khuyên học tập, phản hồi kết quả trắc nghiệm và khích lệ tinh thần người học.

---

## 📂 Cấu trúc Thư mục Dự án

```text
Chinese_Learning/
├── public/                 # Các tài nguyên tĩnh công cộng (icons, fonts, images)
├── scratch/                # Các script tự động hóa, tối ưu dữ liệu & phân tích học tập
├── src/
│   ├── assets/             # Hình ảnh và tệp CSS dùng chung
│   ├── components/         # Các thành phần giao diện của ứng dụng
│   │   ├── DictionaryModal.jsx   # Modal từ điển Hán-Việt đa năng & tiến hóa chữ cổ
│   │   ├── Header.jsx            # Thanh điều hướng đầu trang và nút tra cứu
│   │   ├── Mascot.jsx            # Trợ lý Mascot tương tác dễ thương
│   │   ├── SkillListening.jsx    # Giao diện luyện kỹ năng Nghe hiểu (giải thích HSK 1-3)
│   │   ├── SkillReading.jsx      # Giao diện luyện kỹ năng Đọc hiểu & làm bài trắc nghiệm
│   │   ├── SkillSpeaking.jsx     # Giao diện luyện Nói & Nhận diện phát âm (Speech Recog)
│   │   └── SkillWriting.jsx      # Bảng vẽ vẽ Canvas & ảnh động hướng dẫn tập viết chữ Hán
│   ├── data/               # Cơ sở dữ liệu và ánh xạ dữ liệu tĩnh
│   │   ├── etymologyData.js      # Dữ liệu nguồn gốc và tiến hóa chữ cổ (Oracle, Bronze, Seal)
│   │   ├── sinoVietMap.js        # Bản đồ âm tự động ánh xạ chữ Hán -> Phiên âm Hán-Việt
│   │   ├── translations.js       # Từ điển dịch thuật giao diện đa ngôn ngữ (vi, zh-CN, zh-TW)
│   │   └── vocabulary.js         # Toàn bộ database từ vựng (1.800 từ) và bài tập 4 kỹ năng
│   ├── App.css             # CSS chính điều khiển bố cục ứng dụng
│   ├── App.jsx             # File điều hướng logic cốt lõi của ứng dụng (uiLang, t())
│   ├── index.css           # Hệ thống CSS Token, biến toàn cục, hiệu ứng và responsive / Bottom Nav
│   ├── main.jsx            # Điểm khởi chạy React của ứng dụng
│   └── lib/                # Các thư viện bổ trợ tiện ích
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
