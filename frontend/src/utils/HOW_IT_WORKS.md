# Hệ thống Năm học - Học kỳ - Tuần học (Phiên bản Đơn giản)

## 📌 Cách hoạt động

### 1. **Chỉ hiển thị năm học HIỆN TẠI**

Dropdown **"Chọn học kỳ xem TKB"** chỉ có 2 options:
```
- Học kỳ 1 - Năm học 2025-2026
- Học kỳ 2 - Năm học 2025-2026
```

### 2. **Tự động chuyển sang năm học mới**

Khi sang năm học mới (tháng 9), hệ thống sẽ **TỰ ĐỘNG** cập nhật:

#### Ví dụ:
- **Hôm nay: 31/08/2026** (cuối năm học 2025-2026)
  ```
  Dropdown hiển thị:
  - Học kỳ 1 - Năm học 2025-2026
  - Học kỳ 2 - Năm học 2025-2026
  ```

- **Ngày mai: 01/09/2026** (bắt đầu năm học 2026-2027)
  ```
  Dropdown TỰ ĐỘNG cập nhật thành:
  - Học kỳ 1 - Năm học 2026-2027
  - Học kỳ 2 - Năm học 2026-2027
  ```

### 3. **Dropdown Tuần**

Khi chọn học kỳ, dropdown tuần sẽ hiển thị 18 tuần với khoảng ngày:

**Ví dụ HK1 2025-2026:**
```
Tuần 01 [Từ 01/09/2025 - Đến 07/09/2025]
Tuần 02 [Từ 08/09/2025 - Đến 14/09/2025]
Tuần 03 [Từ 15/09/2025 - Đến 21/09/2025]
...
Tuần 18 [Từ 22/12/2025 - Đến 28/12/2025]
```

**Ví dụ HK2 2025-2026:**
```
Tuần 01 [Từ 15/01/2026 - Đến 21/01/2026]
Tuần 02 [Từ 22/01/2026 - Đến 28/01/2026]
...
Tuần 18 [Từ 11/05/2026 - Đến 17/05/2026]
```

## 🔄 Quy trình tự động

```
┌─────────────────────────────────────────────────┐
│  Hệ thống kiểm tra ngày hôm nay                 │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │  Tháng 9-12?       │──── YES ──▶ HK1 năm hiện tại
         └────────┬───────────┘
                  │ NO
                  ▼
         ┌────────────────────┐
         │  Tháng 1-5?        │──── YES ──▶ HK2 năm trước
         └────────┬───────────┘
                  │ NO
                  ▼
         ┌────────────────────┐
         │  Tháng 6-8         │──── Nghỉ hè (hiển thị HK2 năm trước)
         └────────────────────┘
```

## 📅 Ví dụ cụ thể

### Tình huống 1: Đang trong HK2
**Ngày: 14/02/2026**

```javascript
Dropdown học kỳ:
├─ Học kỳ 1 - Năm học 2025-2026
└─ Học kỳ 2 - Năm học 2025-2026  ← (Đang chọn)

Dropdown tuần (HK2):
├─ Tuần 01 [Từ 15/01/2026 - Đến 21/01/2026]
├─ Tuần 02 [Từ 22/01/2026 - Đến 28/01/2026]
├─ Tuần 03 [Từ 29/01/2026 - Đến 04/02/2026]
├─ Tuần 04 [Từ 05/02/2026 - Đến 11/02/2026]
├─ Tuần 05 [Từ 12/02/2026 - Đến 18/02/2026]  ← (Tuần hiện tại)
├─ ...
└─ Tuần 18 [Từ 11/05/2026 - Đến 17/05/2026]
```

### Tình huống 2: Chuyển sang năm học mới
**Ngày: 01/09/2026** (Ngày đầu tiên của năm học mới)

```javascript
Dropdown học kỳ (TỰ ĐỘNG cập nhật):
├─ Học kỳ 1 - Năm học 2026-2027  ← (Tự động chọn)
└─ Học kỳ 2 - Năm học 2026-2027

Dropdown tuần (HK1):
├─ Tuần 01 [Từ 01/09/2026 - Đến 07/09/2026]  ← (Tuần hiện tại)
├─ Tuần 02 [Từ 08/09/2026 - Đến 14/09/2026]
├─ ...
└─ Tuần 18 [...]
```

### Tình huống 3: Nghỉ hè
**Ngày: 15/07/2026**

```javascript
Dropdown học kỳ (vẫn hiển thị năm học vừa kết thúc):
├─ Học kỳ 1 - Năm học 2025-2026
└─ Học kỳ 2 - Năm học 2025-2026  ← (Mặc định chọn HK2)

Lưu ý: Đang nghỉ hè, chờ đến 01/09/2026 sẽ tự động chuyển sang năm 2026-2027
```

## 🎯 Lợi ích

✅ **Đơn giản**: Chỉ 2 options (HK1, HK2) thay vì hàng chục options  
✅ **Tự động**: Không cần admin cập nhật thủ công  
✅ **Chính xác**: Luôn hiển thị năm học hiện tại  
✅ **Dễ dùng**: Người dùng không bị rối với quá nhiều lựa chọn  

## 🔧 Cấu hình

Nếu cần thay đổi ngày bắt đầu HK2 (do Tết thay đổi), chỉnh trong `academicUtils.js`:

```javascript
const SEMESTER_CONFIG = {
  SEMESTER_2: {
    START_DAY: 15,  // ← Thay đổi số này (1-31)
  }
};
```

## 💡 Lưu ý

- Hệ thống kiểm tra và cập nhật năm học **mỗi ngày 1 lần**
- Khi refresh trang, luôn lấy thông tin năm học mới nhất
- Nếu muốn xem TKB năm cũ, cần thêm chức năng riêng (lưu trữ lịch sử)
