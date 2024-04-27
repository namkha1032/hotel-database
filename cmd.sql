-- test trigger_calculate_rental_cost
insert into booking(guestcount, checkin, checkout, customerid) values (20, '2024-06-20', '2024-06-22', 'CS000001');
insert into booking_room(bookingid, branchid, roomnumber) values
('BK00000001', 'BR01', '701'),
('BK00000001', 'BR01', '702'),
('BK00000001', 'BR01', '703'),
('BK00000001', 'BR01', '704'),
('BK00000001', 'BR01', '705');
select bookingid, rentalcost from booking where bookingid = 'BK00000001';

-- test trigger_calculate_rental_cost
insert into foodconsumed(bookingid, branchid, roomnumber, foodtypeid, amount) values
('BK00000001', 'BR01', '703', 'FT0002', 3),
('BK00000001', 'BR01', '703', 'FT0004', 2),
('BK00000001', 'BR01', '705', 'FT0001', 5),
('BK00000001', 'BR01', '705', 'FT0004', 4);
select bookingid, foodcost from booking where bookingid = 'BK00000001';

-- test trigger_check_valid_booking_room
insert into booking(guestcount, checkin, checkout, customerid) values 
(4, '2024-06-21', '2024-06-24', 'CS000001');
insert into booking_room(bookingid, branchid, roomnumber) values
('BK00000002', 'BR03', '401'),
('BK00000002', 'BR03', '402');

insert into booking(guestcount, checkin, checkout, customerid) values 
(4, '2024-06-23', '2024-06-24', 'CS000001');
insert into booking_room(bookingid, branchid, roomnumber) values
('BK00000003', 'BR03', '401'),
('BK00000003', 'BR03', '402');

-- test procedure create_booking
CALL create_booking('20',null,'2024-06-22','2024-06-24', 'CS000080', 
'[
    {"branchid":"BR01","roomnumber":"705"},
    {"branchid":"BR01","roomnumber":"706"},
    {"branchid":"BR01","roomnumber":"707"},
    {"branchid":"BR01","roomnumber":"708"},
    {"branchid":"BR01","roomnumber":"709"}
]');

-- test procedure check_out
CALL checkout('BK00004201','[
    {"branchid":"BR01","roomnumber":"703","inputfoodconsumed":[]},
    {"branchid":"BR01","roomnumber":"704","inputfoodconsumed":[
        {"foodtypeid":"FT0001", "amount":2},
        {"foodtypeid":"FT0003", "amount":2}]},
    {"branchid":"BR01","roomnumber":"705","inputfoodconsumed":[]},
    {"branchid":"BR01","roomnumber":"706","inputfoodconsumed":[
        {"foodtypeid":"FT0002", "amount":1}]},
    {"branchid":"BR01","roomnumber":"707","inputfoodconsumed":[]}]');

-- test function get_branch_statistics
SELECT * FROM get_branch_statistics('BR01','2024');

-- test function get_rooms_calendar
select * from get_rooms_calendar('BR01','2024','06');

-- test function get_bookings
select * from get_bookings('BR01', 'NULL', 'NULL');

-- insert
INSERT INTO branch (Province, Address, Phone, Email) VALUES
('Phan Thiet', '48 Nguyễn Đình Chiểu, Phường Hàm Tiến, Thành phố Phan Thiết, Bình Thuận', '0010000001', 'phanthiet@gmail.com');
INSERT INTO branch_image (BranchID, Image) VALUES
('BR01', '/br01image1.jpg');
INSERT INTO roomtype (RoomName, Area, GuestNum, SingleBedNum, DoubleBedNum, Description) VALUES
('Single Normal', '10', '1','1','0', 'normal room for 1 guest');
INSERT INTO roomtype_image (RoomTypeID, Image) VALUES
('1', '/room1image1.jpg');
INSERT INTO roomtype_branch (RoomTypeID, BranchID, RentalPrice) VALUES
('1', 'BR01', '100');
INSERT INTO room (BranchID, RoomNumber, RoomTypeID) VALUES
('BR01', '100', '1');
INSERT INTO supplytype (SupplyTypeName) VALUES
('Television');
INSERT INTO roomtype_supplytype (SupplyTypeID, RoomTypeID, Quantity) VALUES
('SP0001', '1', 1);
INSERT INTO supply (BranchID, SupplyTypeID, SupplyIndex, RoomNumber, Condition) VALUES
('BR01', 'SP0001', '1', '100', 'Good');
INSERT INTO customer (CitizenID, FullName, Phone, Email, Username, Password, DateOfBirth) VALUES 
('079046706997', 'Luke Skywalker', '0903389043', 'lukeskywalker@gmail.com', 'lukeskywalker', 'password', '2000-01-01');
INSERT INTO booking (GuestCount, CheckIn, CheckOut, CustomerID) VALUES
(14, '2024-11-09','2024-11-11', 'CS000001');
INSERT INTO booking_room (BookingID, BranchID, RoomNumber) VALUES
('BK00000001', 'BR01','100');
INSERT INTO foodtype (FoodName, FoodPrice) VALUES
('Water', 10);
INSERT INTO foodconsumed (BookingID, BranchID, RoomNumber, FoodTypeID, Amount) VALUES
('BK00000001', 'BR01', '100', 'FT0001', 2);

select bookingid, rentalcost from booking where bookingid = 'BK00000001';

call create_booking(20, '2024-06-07', '2024-06-08', 'CS000001', '[
    {
        "branchid": "BR01",
        "roomnumber": "101"
    },
    {
        "branchid": "BR01",
        "roomnumber": "102"
    }`
]');

call create_booking(20, '2024-07-20', '2024-07-23', 'CS000003', '[
    {
        "branchid": "BR01",
        "roomnumber": "101"
    },
    {
        "branchid": "BR01",
        "roomnumber": "102"
    }
]');

call create_booking(20, '2024-07-20', '2024-07-23', 'CS000003', '[
    {
        "branchid": "BR02",
        "roomnumber": "101"
    },
    {
        "branchid": "BR02",
        "roomnumber": "102"
    }
]');


SELECT * FROM get_branch_statistics('BR01','2023');
select * from get_rooms_calendar('BR01','2023','06');