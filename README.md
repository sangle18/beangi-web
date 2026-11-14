# Bé Ăn Gì (bản web)

Trang web gợi ý món ăn cho bé theo tuổi, theo tuần và theo mùa ở Việt Nam. Dùng trên điện thoại như một app: mở bằng Safari → Chia sẻ → **Thêm vào MH chính**.

- Thực đơn theo nhóm tuổi (khuyến nghị WHO 2023, UNICEF Việt Nam, Viện Dinh dưỡng Quốc gia), rau quả theo mùa, danh sách đi chợ.
- "Gợi ý món khác" từng ngày, "Đổi cả tuần"; món không trùng giữa các ngày liền nhau; gan tối đa 1 bữa/tuần.
- Cỡ chữ Nhỏ / Vừa / Lớn. Dùng được khi không có mạng.

**Riêng tư:** tên và ngày sinh của bé chỉ lưu trong trình duyệt trên máy (localStorage), không gửi đi đâu. Trang không có quảng cáo, không đo lượt truy cập, không tải thư viện bên ngoài.

Đây là gợi ý tham khảo, không thay thế tư vấn của bác sĩ.

## Phát triển
- Kiểm thử: `node tests/menu.test.mjs` (thêm số lần chạy ngẫu nhiên: `node tests/menu.test.mjs 50`)
- Sau khi sửa code: `./bump.sh` để điện thoại tải bản mới ngay.
