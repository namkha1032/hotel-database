Tải node https://nodejs.org/en
# Database
Bật postgres lên, chạy lệnh này để tạo user sManager
```
CREATE USER smanager WITH PASSWORD 'postgres';
GRANT pg_read_all_data TO smanager;
GRANT pg_write_all_data TO smanager;
```
Tạo database `hotel` trong postgres. Trong `hotel` chạy lần lượt các script sau theo thứ tự
1. `1_script.sql`: table definition, trigger, procedure, function,...
2. `2_data.sql`: insert data ở các bảng.
3. `3_booking.sql`: insert data ở các bảng `booking` và `booking_room`

# App
## Backend
Trong IDE vào thư mục be, chạy lệnh sau để install package
```
npm i
```

Vào file `/be/connection_pg.js` để config lại các connection setting nếu cần. User và password mặc định là cái tài khoản vừa được tạo ở trên nên ko cần config lại cái đó, chỉ cần config lại port nếu cần.

Chạy lệnh sau để bật server
```
npm start
```
Server chạy ở `localhost:3001`
## Frontend
Trong IDE vào thư mục fe, làm tương tự như backend. Frontend có những trang sau:
1. `locahost:3000/login`: Login bằng admin: dùng tài khoản `smanager` ở trên.
2. `locahost:3000/login-guest`: Login bằng guest: dùng 1 trong 80 tài khoản được tạo bằng lệnh `2_data.sql` ở trên.
2. `localhost:3000/hotel-customer`: trang để guest tìm phòng trống và book phòng
3. `localhost:3000/hotel-manangement`: trang statistics dành cho admin
4. `localhost:3000/hotel-booking`: trang quản lý booking, checkin, checkout