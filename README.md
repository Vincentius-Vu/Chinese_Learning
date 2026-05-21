# 🇨🇳 Chinese Learning Web Application (Học Tiếng Trung HSK 1 - 6)

[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Gh-Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white)](https://pages.github.com)
[![License](https://img.shields.io/badge/License-MIT-4CABA0?style=flat-square)](LICENSE)

Chào mừng bạn đến với **Chinese Learning Web Application** – Một ứng dụng web học tiếng Trung hiện đại, trực quan và toàn diện. Ứng dụng tập trung tối ưu hóa trải nghiệm tự học thông qua việc huấn luyện chuyên sâu **4 kỹ năng ngôn ngữ cốt lõi (Nghe - Nói - Đọc - Viết)** trải dài từ cấp độ **HSK/TOCFL 1 đến 6**, tích hợp hệ thống **Từ điển tra cứu Hán-Việt thông minh** cùng công cụ quản lý từ vựng cá nhân cá nhân hóa.

👉 **Môi trường trực tuyến**: Ứng dụng đã được xuất bản tự động và chạy ổn định trên GitHub Pages.

---

## 🌟 Tính năng Nổi bật

### 1. Cơ sở Dữ liệu Từ vựng Khổng lồ & Chuẩn hóa
* **1.800 từ vựng cốt lõi**: Phân bổ đồng đều 300 từ cho mỗi cấp độ HSK/TOCFL 1-6.
* **Đầy đủ thông tin chi tiết**: Mỗi từ vựng bao gồm Chữ giản thể (Simplified), Chữ phồn thể (Traditional), Phiên âm Pinyin, **Phiên âm Hán-Việt** (ví dụ: `学习` -> `Học Tập`), Nghĩa tiếng Việt tự nhiên và Phân nhóm chủ đề học tập.
* **Đồng bộ hóa dữ liệu**: Hỗ trợ tự động hóa chuyển đổi dữ liệu không xảy ra lỗi trùng lặp hay xung đột ID.

### 2. Huấn luyện 4 Kỹ năng Ngôn ngữ Chuyên sâu
* **✍️ Kỹ năng Viết (Writing)**:
  - Tích hợp bảng vẽ Canvas tương tác cho phép người dùng dùng chuột hoặc màn hình cảm ứng để tập viết chữ Hán trực tiếp.
  - Hỗ trợ hoạt ảnh vẽ mẫu theo từng nét bút (stroke-by-stroke animations) chuẩn xác.
  - Tự động kiểm tra độ chính xác của nét vẽ và cung cấp điểm số đánh giá trực quan.
* **📚 Kỹ năng Đọc hiểu (Reading)**:
  - Kho **42 bài học đọc hiểu chất lượng cao** (đúng 7 bài mỗi cấp độ).
  - Mỗi bài học đi kèm văn bản giản thể, phồn thể, Pinyin, bản dịch tiếng Việt mượt mà cùng danh sách từ vựng trọng tâm.
  - Hệ thống câu hỏi trắc nghiệm khách quan đa dạng với **lời giải thích chi tiết bằng tiếng Việt** giúp người học hiểu sâu ngữ pháp và ngữ cảnh.
* **🎧 Kỹ năng Nghe (Listening)**:
  - Các bài nghe hiểu phong phú tích hợp giọng đọc bản xứ chuẩn thông qua **Speech Synthesis API** của trình duyệt.
  - Câu hỏi trắc nghiệm kiểm tra độ hiểu thông tin kèm kịch bản nghe (script) trực quan.
* **🗣️ Kỹ năng Nói (Speaking)**:
  - Sử dụng **Speech Recognition API** để nhận diện giọng nói và chấm điểm phát âm tiếng Trung của người học trong thời gian thực.
  - Cung cấp phản hồi lập tức để cải thiện khẩu hình và thanh điệu Pinyin.

### 3. Hệ thống Từ điển Tra cứu Hán-Việt Đa năng (`DictionaryModal`)
* **Kích hoạt nhanh**: Nút kính mờ màu Teal (`🔍`) nổi bật trên Header cho phép tra cứu ngay lập tức từ bất kỳ màn hình nào.
* **Tìm kiếm đa dạng**: Tìm kiếm song song tức thì theo Chữ giản/phồn, Pinyin (có dấu hoặc không dấu), âm Hán-Việt hoặc nghĩa tiếng Việt. Tự động chuẩn hóa chuỗi để bỏ qua dấu tiếng Việt và thanh điệu Pinyin khi nhập liệu.
* **Thông tin chi tiết chuyên sâu**:
  - Phóng to chữ Hán, tích hợp nút phát âm giọng bản xứ `🔊`.
  - Hiển thị bộ thủ, mẹo ghi nhớ chữ Hán thông qua hình ảnh hoặc câu chuyện.
  - **Sơ đồ tiến hóa chữ viết cổ đại**: Mô phỏng sự tiến hóa của chữ Hán qua 4 thời kỳ lịch sử tiêu biểu: *Giáp Cốt Văn (Oracle Bone), Kim Văn (Bronze), Tiểu Triện (Seal), Khải Thư (Regular Script)* với thiết kế hiệu ứng giả lập chất liệu lịch sử (khắc xương, đúc đồng, đóng dấu, nét cọ).
  - **Tập viết ngay (`✍️`)**: Liên kết trực tiếp, khi bấm nút sẽ tự động nạp chữ Hán được chọn vào Canvas tập viết chữ.

### 4. Quản lý Từ vựng Cá nhân (Custom Words)
* Cho phép người học tự thêm, chỉnh sửa hoặc xóa các từ vựng mới của riêng mình.
* Tự động tra cứu fallback phiên âm Hán-Việt từ file bản đồ âm `sinoVietMap.js` trong trường hợp người dùng bỏ trống trường Hán-Việt khi thêm từ.

### 5. Giao diện Thẩm mỹ & Trải nghiệm Người dùng
* Phong cách thiết kế hiện đại pha lẫn nét cổ điển Á Đông, sử dụng các gam màu Teal và HSL hài hòa.
* Hiệu ứng kính mờ (Glassmorphism), viền phát sáng nhẹ, đổ bóng và các vi chuyển động (micro-animations) mượt mà khi hover.
* Tối ưu hóa hiển thị responsive hoàn hảo trên mọi kích thước màn hình di động, máy tính bảng và máy tính để bàn.
* **Trợ lý Mascot tương tác**: Chú gấu trúc dễ thương xuất hiện sinh động, đưa ra lời khuyên học tập, phản hồi kết quả trắc nghiệm và khích lệ tinh thần người học.

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
│   │   ├── SkillListening.jsx    # Giao diện luyện kỹ năng Nghe hiểu
│   │   ├── SkillReading.jsx      # Giao diện luyện kỹ năng Đọc hiểu & làm bài trắc nghiệm
│   │   ├── SkillSpeaking.jsx     # Giao diện luyện Nói & Nhận diện phát âm (Speech Recog)
│   │   └── SkillWriting.jsx      # Bảng vẽ vẽ Canvas & ảnh động hướng dẫn tập viết chữ Hán
│   ├── data/               # Cơ sở dữ liệu và ánh xạ dữ liệu tĩnh
│   │   ├── etymologyData.js      # Dữ liệu nguồn gốc và tiến hóa chữ cổ (Oracle, Bronze, Seal)
│   │   ├── sinoVietMap.js        # Bản đồ âm tự động ánh xạ chữ Hán -> Phiên âm Hán-Việt
│   │   └── vocabulary.js         # Toàn bộ database từ vựng (1.800 từ) và 4 kỹ năng
│   ├── App.css             # CSS chính điều khiển bố cục ứng dụng
│   ├── App.jsx             # File điều hướng logic cốt lõi của ứng dụng
│   ├── index.css           # Hệ thống CSS Token, biến toàn cục, hiệu ứng và responsive
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

1. **React 19 & Vite 8**: Nền tảng cốt lõi giúp xây dựng giao diện component hóa, tải trang cực nhanh với cơ chế Hot Module Replacement (HMR).
2. **Vanilla CSS**: Được tùy biến sâu sắc để tạo dựng hệ thống biến giao diện (`css-variables`), hỗ trợ Dark/Light Theme linh hoạt, hiệu ứng chuyển cảnh mượt mà và giao diện thích ứng responsive không cần phụ thuộc vào framework bên ngoài.
3. **Web APIs tích hợp**:
   - **SpeechSynthesis**: Phát âm thanh tiếng Trung tự nhiên chuẩn giọng bản địa.
   - **SpeechRecognition**: Thu âm và nhận dạng giọng nói chấm điểm trực tiếp.
   - **HTML5 Canvas**: Vẽ và kiểm tra tọa độ nét chữ phục vụ kỹ năng viết.
4. **Local Storage**: Đồng bộ lưu trữ tiến trình làm bài trắc nghiệm, lịch sử học tập và danh sách từ vựng tùy chỉnh cá nhân.

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
Dự án được phân phối dưới giấy phép mã nguồn mở MIT. Mọi đóng góp, báo lỗi hoặc đề xuất cải tiến tính năng đều được hoan nghênh nhiệt liệt thông qua phần **Issues** hoặc **Pull Requests** trên GitHub.

*Chúc các bạn có những giờ học tiếng Trung thật bổ ích và thú vị cùng **Chinese Learning Web Application**! 🐼🎒*
