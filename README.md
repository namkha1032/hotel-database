Tải node https://nodejs.org/en
# Database
Bật postgres lên, chạy lệnh này để tạo user sManager
```
CREATE USER smanager WITH PASSWORD 'postgres';
ALTER USER smanager WITH SUPERUSER;
```
Tạo database `hotel` trong postgres. Trong `hotel` chạy lần lượt các script sau theo thứ tự
1. `script.sql`: table definition, trigger, procedure, function,...
2. `data.sql`: insert data ở các bảng.
3. `booking.sql`: insert data ở các bảng `booking`, `booking_room`, `foodconsumed`

# App
## Backend
Trong IDE vào thư mục be, chạy lệnh sau để install package
```
npm i
```

Vào file `/be/connection_pg.js` để config lại các connection setting nếu cần.

Chạy lệnh sau để bật server
```
npm start
```
Server chạy ở `localhost:3001`
## Frontend
Trong IDE vào thư mục fe, làm tương tự như backend. Frontend có những trang sau:
1. `locahost:3000/login`: Login bằng admin thì dùng tài khoản smanager ở trên. Login bằng guest thì dùng 1 trong 80 tài khoản được tạo bằng lệnh `data.sql` ở trên.
2. `localhost:3000/hotel-customer`: trang để guest tìm phòng trống và book phòng
3. `localhost:3000/hotel-manangement`: trang statistics dành cho admin
4. `localhost:3000/hotel-booking`: trang quản lý booking, checkin, checkout