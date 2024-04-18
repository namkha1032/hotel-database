DROP DATABASE IF exists HOTEL;
CREATE DATABASE HOTEL;
USE HOTEL;


CREATE TABLE `branch` (
    `BranchID` VARCHAR(6) NOT NULL,
    `Province` VARCHAR(50) NOT NULL,
    `Address` VARCHAR(100) NOT NULL UNIQUE,
    `Email` VARCHAR(64) NOT NULL UNIQUE,
    `Phone` VARCHAR(10) NOT NULL UNIQUE,
    PRIMARY KEY (`BranchID`)
);
CREATE TABLE branch_seq(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT
);
DELIMITER $$
CREATE TRIGGER generate_branch_id
BEFORE INSERT ON `branch`
FOR EACH ROW
BEGIN
  INSERT INTO branch_seq VALUES (NULL);
  SET NEW.BranchID = CONCAT('CN', LAST_INSERT_ID());
END$$
DELIMITER ;


CREATE TABLE `branch_image` (
  `BranchID` varchar(6) NOT NULL,
  `Image` varchar(255) NOT NULL,
  PRIMARY KEY (`BranchID`,`Image`),
  FOREIGN KEY (`BranchID`) REFERENCES `branch` (`BranchID`) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE `roomtype` (
    `RoomTypeID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `RoomName` VARCHAR(45) NOT NULL,
    `Area` INT UNSIGNED NOT NULL,
    `GuestNum` INT UNSIGNED NOT NULL,
    `SingleBedNum` INT UNSIGNED NOT NULL,
    `DoubleBedNum` INT UNSIGNED NOT NULL,
    `Description` TEXT DEFAULT NULL,
    PRIMARY KEY (`RoomTypeID`),
    CONSTRAINT `LimitGuest` CHECK(
        `GuestNum` BETWEEN 1 AND 10
    )
);


CREATE TABLE `roomtype_image` (
  `RoomTypeID` INT UNSIGNED NOT NULL,
  `Image` varchar(255) NOT NULL,
  PRIMARY KEY (`RoomTypeID`,`Image`),
  FOREIGN KEY (`RoomTypeID`) REFERENCES `RoomType` (`RoomTypeID`) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE `roomtype_branch` (
    `RoomTypeID` int unsigned NOT NULL,
    `BranchID` VARCHAR(6) NOT NULL,
    `RentalPrice` int unsigned NOT NULL,
    PRIMARY KEY (`RoomTypeID`, `BranchID`),
    FOREIGN KEY (`BranchID`) REFERENCES `branch` (`BranchID`) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (`RoomTypeID`) REFERENCES `roomtype` (`RoomTypeID`) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE `room` (
  `BranchID` VARCHAR(6) NOT NULL,
  `RoomNumber` VARCHAR(3) NOT NULL,
  `RoomTypeID` int unsigned NOT NULL,
  PRIMARY KEY (`BranchID`,`RoomNumber`),
  FOREIGN KEY (`BranchID`) REFERENCES `Branch` (`BranchID`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`RoomTypeID`) REFERENCES `roomtype` (`RoomTypeID`) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE `supplytype` (
  `SupplyTypeID` VARCHAR(6) NOT NULL PRIMARY KEY ,
  `SupplyTypeName` VARCHAR(50) NOT NULL UNIQUE
) ;
DELIMITER $$
CREATE TRIGGER SupplyTypeID_Check BEFORE INSERT ON `supplytype`
FOR EACH ROW 
BEGIN 
IF (NEW.SupplyTypeID REGEXP '^VT[0-9]{4}$' ) = 0 THEN 
  SIGNAL SQLSTATE '12345'
     SET MESSAGE_TEXT = 'Wrong Format!!!';
END IF; 
END$$
DELIMITER ;


CREATE TABLE `roomtype_supplytype` (
  `SupplyTypeID` VARCHAR(8) NOT NULL,
  `RoomTypeID` int unsigned NOT NULL,
  `Quantity` int unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`SupplyTypeID`,`RoomTypeID`),
  FOREIGN KEY (`SupplyTypeID`) REFERENCES `supplytype` (`SupplyTypeID`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`RoomTypeID`) REFERENCES `roomtype` (`RoomTypeID`) ON UPDATE CASCADE ON DELETE CASCADE
) ;


-- xem lại FK cái này
CREATE TABLE `supply` (
  `BranchID` VARCHAR(6) NOT NULL,
  `SupplyTypeID` VARCHAR(6) NOT NULL,
  `SupplyIndex` int unsigned NOT NULL,
  `RoomNumber` VARCHAR(3) DEFAULT NULL,
  `Condition` VARCHAR(45) DEFAULT 'Good',
  PRIMARY KEY (`BranchID`,`SupplyTypeID`,`SupplyIndex`),
  FOREIGN KEY (`BranchID`,`RoomNumber`) REFERENCES `room` (`BranchID`,`RoomNumber`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`SupplyTypeID`) REFERENCES `supplytype` (`SupplyTypeID`) ON UPDATE CASCADE ON DELETE CASCADE
) ;


CREATE TABLE `customer` (
  `CustomerID` VARCHAR(10) NOT NULL,
  `CitizenID` VARCHAR(12) NOT NULL UNIQUE,
  `FullName` VARCHAR(45) NOT NULL,
  `DateOfBirth` DATE NOT NULL,
  `Phone` VARCHAR(12) NOT NULL UNIQUE,
  `Email` VARCHAR(45) DEFAULT NULL UNIQUE,
  `Username` VARCHAR(45) DEFAULT NULL UNIQUE,
  `Password` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`CustomerID`)
);
DELIMITER $$
CREATE TRIGGER CustomerID_check BEFORE INSERT ON `customer`
FOR EACH ROW 
BEGIN 
IF (NEW.CustomerID REGEXP '^KH[0-9]{6}$' ) = 0 THEN 
  SIGNAL SQLSTATE '12345'
     SET MESSAGE_TEXT = 'Wrong Format!!!';
END IF; 
END$$
DELIMITER ;

-- xem lại
CREATE TABLE `booking` (
  `BookingID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `BookingDate` datetime NOT NULL,
  `GuestCount` int unsigned NOT NULL,
  `CheckIn` datetime NOT NULL,
  `CheckOut` datetime NOT NULL,
  `ActualCheckIn` datetime,
  `ActualCheckOut` datetime,
  `Status` int unsigned NOT NULL DEFAULT '0',
  `RentalCost` int unsigned DEFAULT '0',
  `FoodCost` int unsigned DEFAULT '0',
  `CustomerID` varchar(10) NOT NULL,
  PRIMARY KEY (`BookingID`),
  FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `CheckDate2` CHECK(CheckIn >= BookingDate),
  CONSTRAINT `CheckDate3` CHECK(CheckOut >= CheckIn)
);


CREATE TABLE `booking_room` (
  `BookingID` INT UNSIGNED,
  `BranchID` varchar(6) NOT NULL,
  `RoomNumber` varchar(3) NOT NULL,
  PRIMARY KEY (`BookingID`, `BranchID`, `RoomNumber`),
  FOREIGN KEY (`BookingID`) REFERENCES `booking` (`BookingID`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`BranchID`,`RoomNumber`) REFERENCES `room` (`BranchID`,`RoomNumber`) ON UPDATE CASCADE ON DELETE CASCADE
) ;

-- CREATE TABLE booking_seq(
-- 	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT
-- );
-- DELIMITER $$
-- CREATE TRIGGER generate_booking_id
-- BEFORE INSERT ON `booking`
-- FOR EACH ROW
-- BEGIN
--   INSERT INTO booking_seq VALUES (NULL);
--   SET NEW.BookingID = CONCAT('DP', LPAD(LAST_INSERT_ID(), 6, '0'));
-- END$$
-- DELIMITER ;




CREATE TABLE `foodtype` (
  `FoodTypeID` VARCHAR(6) NOT NULL,
  `FoodName` varchar(45) NOT NULL UNIQUE,
  `FoodPrice` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`FoodTypeID`)
);
DELIMITER $$
CREATE TRIGGER FoodTypeID_check BEFORE INSERT ON `foodtype`
FOR EACH ROW 
BEGIN 
IF (NEW.FoodTypeID REGEXP '^TA[0-9]{4}$' ) = 0 THEN 
  SIGNAL SQLSTATE '12345'
     SET MESSAGE_TEXT = 'Wrong Format!!!';
END IF; 
END$$
DELIMITER ;


CREATE TABLE `foodconsumed` (
  `BookingID` INT UNSIGNED NOT NULL,
  `BranchID` varchar(6) NOT NULL,
  `RoomNumber` varchar(3) NOT NULL,
  `FoodTypeID` VARCHAR(6) NOT NULL ,
  `Amount` INT UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`BookingID`,`BranchID`,`RoomNumber`, `FoodTypeID`),
  FOREIGN KEY (`BookingID`,`BranchID`,`RoomNumber`) REFERENCES `booking_room` (`BookingID`,`BranchID`,`RoomNumber`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`FoodTypeID`) REFERENCES `foodtype` (`FoodTypeID`) ON UPDATE CASCADE ON DELETE CASCADE
);






DROP PROCEDURE IF EXISTS BranchStatistics;
DELIMITER // 
CREATE PROCEDURE BranchStatistics
(
	in InputBranch varchar(6),
    in InputYear int unsigned
)
BEGIN
    DECLARE count_room_var INT DEFAULT '0';
    SELECT COUNT(*) INTO count_room_var FROM room r0 WHERE r0.BranchID = InputBranch;
    DROP TABLE IF EXISTS tmp;
    DROP TABLE IF EXISTS all_months;

    CREATE TABLE all_months (
            month_num INT,
            month_day INT DEFAULT '0'
        );

    INSERT INTO all_months VALUES 
    (1, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-01-01')))),
    (2, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-02-01')))),
    (3, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-03-01')))),
    (4, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-04-01')))),
    (5, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-05-01')))),
    (6, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-06-01')))),
    (7, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-07-01')))),
    (8, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-08-01')))),
    (9, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-09-01')))),
    (10, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-10-01')))),
    (11, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-11-01')))),
    (12, DAYOFMONTH(LAST_DAY(CONCAT(InputYear, '-12-01'))));


    SELECT  all_months.month_num AS month_num,
            all_months.month_day as month_day, 
            count_room_var AS count_room,
            IFNULL(temp.count_slot,0) AS count_slot, 
            all_months.month_day*count_room_var as total_slot, 
            IFNULL(temp.count_slot,0)/(all_months.month_day*count_room_var) as occupancy_rate
    FROM (all_months LEFT JOIN 
    (SELECT DATE_FORMAT(booking.CheckIn, '%m') as review_month,
    SUM(IFNULL(DATEDIFF(booking.CheckOut, booking.CheckIn) + 1,0)) AS count_slot
    FROM room r1 LEFT JOIN (booking_room INNER JOIN booking ON booking_room.BookingID = booking.BookingID)
    ON r1.BranchID = booking_room.BranchID AND r1.RoomNumber = booking_room.RoomNumber
    WHERE r1.BranchID=InputBranch AND YEAR(booking.CheckIn) = InputYear
    GROUP BY DATE_FORMAT(CheckIn, '%m')
    ) as temp
    ON all_months.month_num=temp.review_month)
    ORDER BY all_months.month_num ASC;
END; // 
DELIMITER ;
-- CALL BranchStatistics('CN1','2023');


DROP PROCEDURE IF EXISTS GetVacantRooms;
DELIMITER // 
CREATE PROCEDURE GetVacantRooms
(
	in InputBranch varchar(6),
    in InputGuest int unsigned,
    in InputRoom int unsigned,
    in InputCheckIn date,
    in InputCheckOut date
)
BEGIN
    DECLARE max_guest INT;
    DECLARE CalculatedGuestNum INT DEFAULT CEIL(InputGuest/InputRoom);
    DECLARE CalculatedDateDiff INT DEFAULT (DATEDIFF(InputCheckOut, InputCheckIn) + 1);
    SELECT MAX(roomtype.GuestNum) INTO max_guest FROM roomtype;
    IF CalculatedGuestNum > max_guest THEN
        -- Return an empty result
        SELECT * FROM branch WHERE 0=1;
    ELSE
        SELECT roomtype.*, COUNT(*) AS room_count
        FROM roomtype INNER JOIN 
        (SELECT r0.* FROM room r0 WHERE r0.BranchID = InputBranch
        AND NOT EXISTS
        (SELECT * FROM booking INNER JOIN booking_room ON booking.BookingID = booking_room.BookingID 
        WHERE (r0.RoomNumber = booking_room.RoomNumber AND r0.BranchID = booking_room.BranchID) 
        AND ((booking.CheckIn BETWEEN InputCheckIn AND InputCheckOut) 
        OR (booking.CheckOut BETWEEN InputCheckIn AND InputCheckOut)))) AS room_temp
        ON roomtype.RoomTypeID = room_temp.RoomTypeID WHERE roomtype.GuestNum = CalculatedGuestNum 
        GROUP BY roomtype.RoomTypeID HAVING room_count >= InputRoom;

        SELECT r0.* FROM (SELECT room.BranchID, room.RoomNumber, roomtype.* FROM room INNER JOIN roomtype 
        ON room.RoomTypeID = roomtype.RoomTypeID WHERE roomtype.GuestNum = CalculatedGuestNum) AS r0
        WHERE r0.BranchID = InputBranch
        AND NOT EXISTS
        (SELECT * FROM booking INNER JOIN booking_room ON booking.BookingID = booking_room.BookingID 
        WHERE (r0.RoomNumber = booking_room.RoomNumber AND r0.BranchID = booking_room.BranchID) 
        AND ((booking.CheckIn BETWEEN InputCheckIn AND InputCheckOut) 
        OR (booking.CheckOut BETWEEN InputCheckIn AND InputCheckOut)));
    END IF;
END; // 
DELIMITER ;

-- CALL GetVacantRooms('CN1',5,5,'2023-11-20','2023-11-25');

DROP PROCEDURE IF EXISTS BookRooms;
DELIMITER // 
CREATE PROCEDURE BookRooms
(
	in InputBranch varchar(6),
    in InputGuest int unsigned,
    in InputRoom int unsigned,
    in InputCheckIn date,
    in InputCheckOut date,
    in InputTypeRoom int
)
BEGIN
    DECLARE CalculatedGuestNum INT DEFAULT CEIL(InputGuest/InputRoom);
    DECLARE CalculatedDateDiff INT DEFAULT (DATEDIFF(InputCheckOut, InputCheckIn) + 1); 

    SELECT r0.*, roomtype.* FROM room r0 INNER JOIN roomtype 
    ON room.RoomTypeID = roomtype.RoomTypeID WHERE r0.BranchID = InputBranch
    AND NOT EXISTS
    (SELECT * FROM booking INNER JOIN booking_room ON booking.BookingID = booking_room.BookingID 
    WHERE (r0.RoomNumber = booking_room.RoomNumber AND r0.BranchID = booking_room.BranchID) 
    AND ((booking.CheckIn BETWEEN InputCheckIn AND InputCheckOut) 
    OR (booking.CheckOut BETWEEN InputCheckIn AND InputCheckOut)));
END; // 
DELIMITER ;


DROP TRIGGER IF EXISTS check_room_vacant;
DELIMITER // 
CREATE TRIGGER check_room_vacant BEFORE INSERT ON booking_room
FOR EACH ROW
BEGIN
    DECLARE find_checkin date DEFAULT NULL;
    DECLARE find_checkout date DEFAULT NULL;
    DECLARE count_room INT DEFAULT 0;
    DECLARE find_bookingid int DEFAULT NEW.BookingID;
    DECLARE error_message VARCHAR(255);
    SELECT CheckIn INTO find_checkin FROM booking WHERE booking.BookingID = NEW.BookingID;
    SELECT CheckOut INTO find_checkout FROM booking WHERE booking.BookingID = NEW.BookingID;
    IF find_checkin IS NULL THEN
        SET error_message = CONCAT('BookingID ',NEW.BookingID,' does not exists');
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = error_message;
    ELSE
        SELECT COUNT(*) INTO count_room FROM booking INNER JOIN booking_room ON booking.BookingID = booking_room.BookingID
        WHERE booking_room.BranchID = NEW.BranchID AND booking_room.RoomNumber = NEW.RoomNumber AND booking_room.BookingID <> NEW.BookingID
        AND ((booking.CheckIn BETWEEN find_checkin AND find_checkout) 
        OR (booking.CheckOut BETWEEN find_checkin AND find_checkout));
        IF count_room > 0 THEN
            -- UPDATE booking SET ActualCheckOut='2018-01-01' WHERE booking.BookingID = find_bookingid;
            -- DELETE FROM booking WHERE booking.BookingID = NEW.BookingID;
            SET error_message = CONCAT('BookingID ',NEW.BookingID,' ',find_checkin,' - ',find_checkout, ' Room ', NEW.BranchID,' ',NEW.RoomNumber,' was already occupied');
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = error_message;
        END IF;
    END IF;
END; // 
DELIMITER ;


-- DROP TRIGGER IF EXISTS check_room_vacant;
-- DELIMITER // 
-- CREATE TRIGGER check_room_vacant AFTER INSERT ON booking_room
-- FOR EACH ROW
-- BEGIN
--     DECLARE find_checkin date DEFAULT NULL;
--     DECLARE find_checkout date DEFAULT NULL;
--     DECLARE count_room INT DEFAULT 0;
--     DECLARE error_message VARCHAR(255);
--     SELECT CheckIn INTO find_checkin FROM booking WHERE booking.BookingID = NEW.BookingID;
--     SELECT CheckOut INTO find_checkout FROM booking WHERE booking.BookingID = NEW.BookingID;
--     IF find_checkin IS NULL THEN
--         SET error_message = CONCAT('BookingID ',NEW.BookingID,' does not exists');
--         SIGNAL SQLSTATE '45000'
--         SET MESSAGE_TEXT = error_message;
--     ELSE
--         SELECT COUNT(*) INTO count_room FROM booking INNER JOIN booking_room ON booking.BookingID = booking_room.BookingID
--         WHERE booking_room.BranchID = NEW.BranchID AND booking_room.RoomNumber = NEW.RoomNumber AND booking_room.BookingID <> NEW.BookingID
--         AND ((booking.CheckIn BETWEEN find_checkin AND find_checkout) 
--         OR (booking.CheckOut BETWEEN find_checkin AND find_checkout));
--         IF count_room > 0 THEN
--             -- DELETE FROM booking_room WHERE BookingID = NEW.BookingID;
--             DELETE FROM booking WHERE BookingID = NEW.BookingID;
--             SET error_message = CONCAT('BookingID ',NEW.BookingID,' ',find_checkin,' - ',find_checkout, ' Room ', NEW.BranchID,' ',NEW.RoomNumber,' was already occupied');
--             SIGNAL SQLSTATE '45000'
--             SET MESSAGE_TEXT = error_message;
--         END IF;
--     END IF;
-- END; // 
-- DELIMITER ;