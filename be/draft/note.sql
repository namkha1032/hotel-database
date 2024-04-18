DROP TABLE IF EXISTS all_months;
CREATE TEMPORARY TABLE all_months (
        month_num integer,
        month_day integer,
        primary key (month_num)
    );

INSERT INTO all_months VALUES 
(1, 31),
(2, 28),
(3, 31),
(4, 30),
(5, 31),
(6, 30),
(7, 31),
(8, 31),
(9, 30),
(10, 31),
(11, 30),
(12, 31);

SELECT  all_months.month_num AS month_num,
        all_months.month_day as month_day, 
        count_room_var AS count_room,
        COALESCE(temp.count_slot,0) AS count_slot, 
        all_months.month_day*count_room_var as total_slot, 
        COALESCE(temp.count_slot,0)/(all_months.month_day*count_room_var) as occupancy_rate
FROM (all_months LEFT JOIN 
(SELECT EXTRACT(month FROM booking.CheckIn::timestamp) as review_month,
SUM(COALESCE(DATE_PART('day', booking.CheckOut::timestamp - booking.CheckIn::timestamp) + 1,0)) AS count_slot
FROM room r1 LEFT JOIN (booking_room INNER JOIN booking ON booking_room.BookingID = booking.BookingID)
ON r1.BranchID = booking_room.BranchID AND r1.RoomNumber = booking_room.RoomNumber
WHERE r1.BranchID='BR01' AND EXTRACT(year FROM booking.CheckIn::timestamp) = '2024'
GROUP BY EXTRACT(month FROM booking.CheckIn::timestamp)
) as temp
ON all_months.month_num=temp.review_month)
ORDER BY all_months.month_num ASC;
DROP TABLE IF EXISTS all_months
