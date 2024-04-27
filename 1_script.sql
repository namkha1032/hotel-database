DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- DROP USER IF EXISTS smanager;
-- CREATE USER smanager WITH PASSWORD 'postgres';
-- ALTER USER smanager WITH SUPERUSER;



-- Table 1
CREATE SEQUENCE branch_seq;
CREATE TABLE branch (
    BranchID VARCHAR(4) DEFAULT ('BR' || lpad(nextval('branch_seq')::text, 2, '0')),
    Province VARCHAR(50) NOT NULL,
    Address VARCHAR(100) NOT NULL UNIQUE,
    Email VARCHAR(64) NOT NULL UNIQUE,
    Phone VARCHAR(10) NOT NULL UNIQUE,
    PRIMARY KEY (BranchID)
);

-- Table 2
CREATE TABLE branch_image (
    BranchID VARCHAR(4) NOT NULL,
    Image VARCHAR(255) NOT NULL,
    PRIMARY KEY (BranchID,Image),
    FOREIGN KEY (BranchID) REFERENCES branch (BranchID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table 3
CREATE TABLE roomtype (
    RoomTypeID SERIAL NOT NULL,
    RoomName VARCHAR(45) NOT NULL,
    Area INTEGER NOT NULL,
    GuestNum INTEGER NOT NULL CONSTRAINT LimitGuest CHECK(GuestNum BETWEEN 1 AND 10),
    SingleBedNum INTEGER NOT NULL,
    DoubleBedNum INTEGER NOT NULL,
    Description TEXT DEFAULT NULL,
    PRIMARY KEY (RoomTypeID)
);

-- Table 4
CREATE TABLE roomtype_image (
    RoomTypeID INTEGER NOT NULL,
    Image VARCHAR(255) NOT NULL,
    PRIMARY KEY (RoomTypeID,Image),
    FOREIGN KEY (RoomTypeID) REFERENCES RoomType (RoomTypeID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table 5
CREATE TABLE roomtype_branch (
    RoomTypeID INTEGER NOT NULL,
    BranchID VARCHAR(4) NOT NULL,
    RentalPrice INTEGER NOT NULL,
    PRIMARY KEY (RoomTypeID, BranchID),
    FOREIGN KEY (BranchID) REFERENCES branch (BranchID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (RoomTypeID) REFERENCES roomtype (RoomTypeID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table 6
CREATE TABLE room (
    BranchID VARCHAR(4) NOT NULL,
    RoomNumber VARCHAR(3) NOT NULL,
    RoomTypeID INTEGER NOT NULL,
    PRIMARY KEY (BranchID,RoomNumber),
    FOREIGN KEY (BranchID) REFERENCES Branch (BranchID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (RoomTypeID) REFERENCES roomtype (RoomTypeID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table 7
CREATE SEQUENCE supplytype_seq;
CREATE TABLE supplytype (
    SupplyTypeID VARCHAR(6)  DEFAULT ('SP' || lpad(nextval('supplytype_seq')::text, 4, '0')),
    SupplyTypeName VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (SupplyTypeID)
);

-- Table 8
CREATE TABLE roomtype_supplytype (
    SupplyTypeID VARCHAR(6) NOT NULL,
    RoomTypeID INTEGER NOT NULL,
    Quantity INTEGER NOT NULL DEFAULT '1',
    PRIMARY KEY (SupplyTypeID,RoomTypeID),
    FOREIGN KEY (SupplyTypeID) REFERENCES supplytype (SupplyTypeID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (RoomTypeID) REFERENCES roomtype (RoomTypeID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table 9
CREATE TABLE supply (
    BranchID VARCHAR(4) NOT NULL,
    SupplyTypeID VARCHAR(6) NOT NULL,
    SupplyIndex INTEGER NOT NULL,
    RoomNumber VARCHAR(3) DEFAULT NULL,
    Condition VARCHAR(45) DEFAULT 'Good',
    PRIMARY KEY (BranchID,SupplyTypeID,SupplyIndex),
    FOREIGN KEY (BranchID,RoomNumber) REFERENCES room (BranchID,RoomNumber) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (SupplyTypeID) REFERENCES supplytype (SupplyTypeID) ON UPDATE CASCADE ON DELETE CASCADE
) ;

-- Table 10
CREATE SEQUENCE customer_seq;
CREATE TABLE customer (
    CustomerID VARCHAR(8) DEFAULT ('CS' || lpad(nextval('customer_seq')::text, 6, '0')),
    CitizenID VARCHAR(12) NOT NULL UNIQUE,
    FullName VARCHAR(45) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Phone VARCHAR(12) NOT NULL UNIQUE,
    Email VARCHAR(45) DEFAULT NULL UNIQUE,
    Username VARCHAR(45) DEFAULT NULL UNIQUE,
    Password VARCHAR(45) DEFAULT NULL,
    PRIMARY KEY (CustomerID)
);

-- Table 11
CREATE SEQUENCE booking_seq;
CREATE TABLE booking (
    BookingID VARCHAR(10) DEFAULT ('BK' || lpad(nextval('booking_seq')::text, 8, '0')),
    BookingDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    GuestCount INTEGER NOT NULL,
    CheckIn TIMESTAMP NOT NULL,
    CheckOut TIMESTAMP NOT NULL,
    ActualCheckIn TIMESTAMP,
    ActualCheckOut TIMESTAMP,
    RentalCost INTEGER DEFAULT '0',
    FoodCost INTEGER DEFAULT '0',
    CustomerID VARCHAR(8) NOT NULL,
    PRIMARY KEY (BookingID),
    FOREIGN KEY (CustomerID) REFERENCES customer (CustomerID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT CheckIn_After_BookingDate CHECK(CheckIn >= BookingDate),
    CONSTRAINT CheckOut_After_CheckIn CHECK(CheckOut >= CheckIn)
);

-- Table 12
CREATE TABLE booking_room (
    BookingID VARCHAR(10),
    BranchID VARCHAR(4) NOT NULL,
    RoomNumber VARCHAR(3) NOT NULL,
    PRIMARY KEY (BookingID, BranchID, RoomNumber),
    FOREIGN KEY (BookingID) REFERENCES booking (BookingID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (BranchID,RoomNumber) REFERENCES room (BranchID,RoomNumber) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table 13
CREATE SEQUENCE foodtype_seq;
CREATE TABLE foodtype (
    FoodTypeID VARCHAR(6) DEFAULT ('FT' || lpad(nextval('foodtype_seq')::text, 4, '0')),
    FoodName VARCHAR(45) NOT NULL UNIQUE,
    FoodPrice INT NOT NULL,
    PRIMARY KEY (FoodTypeID)
);

-- Table 14
CREATE TABLE foodconsumed (
    BookingID VARCHAR(10),
    BranchID varchar(4) NOT NULL,
    RoomNumber varchar(3) NOT NULL,
    FoodTypeID VARCHAR(6) NOT NULL ,
    Amount INTEGER NOT NULL DEFAULT '0',
    PRIMARY KEY (BookingID,BranchID,RoomNumber, FoodTypeID),
    FOREIGN KEY (BookingID,BranchID,RoomNumber) REFERENCES booking_room (BookingID,BranchID,RoomNumber) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (FoodTypeID) REFERENCES foodtype (FoodTypeID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- /////////////////////////////////trigger//////////////////////////////////////////

CREATE OR REPLACE FUNCTION calculate_rental_cost()
    RETURNS TRIGGER AS
    $body$
        DECLARE
            oneday_cost integer;
            total_day integer;
        BEGIN
            SELECT roomtype_branch.rentalprice, COALESCE(DATE_PART('day', booking.CheckOut::timestamp - booking.CheckIn::timestamp) + 1,0) 
            into oneday_cost, total_day
            from booking natural JOIN booking_room
            natural join room natural join roomtype natural join roomtype_branch
            where booking.bookingid = new.bookingid;
            
            UPDATE booking SET rentalcost = rentalcost + oneday_cost*total_day where bookingid = new.bookingid;
            return new;
        END;
    $body$
    LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER trigger_calculate_rental_cost 
    AFTER INSERT ON booking_room
    FOR EACH ROW
    EXECUTE FUNCTION calculate_rental_cost();

CREATE OR REPLACE FUNCTION calculate_food_cost()
    RETURNS TRIGGER AS
    $body$
        DECLARE
            onefood_cost integer;
        BEGIN
            select foodprice into onefood_cost 
            from foodtype where foodtypeid=NEW.foodtypeid;

            UPDATE booking SET 
                foodcost = foodcost + onefood_cost*NEW.amount,
                ActualCheckOut = CURRENT_TIMESTAMP
            where bookingid = NEW.bookingid;
            return new;
        END;
    $body$
    LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER trigger_calculate_food_cost 
    AFTER INSERT ON foodconsumed
    FOR EACH ROW
    EXECUTE FUNCTION calculate_food_cost();


CREATE OR REPLACE FUNCTION check_valid_booking_room()
    RETURNS TRIGGER AS
    $body$
        DECLARE
            InputCustomerID varchar;
            InputCheckIn timestamp;
            InputCheckOut timestamp;
            InputProvince varchar;
            ExistBookingID varchar;
            ExistCheckIn timestamp;
            ExistCheckOut timestamp;
            ExistProvince varchar;
        BEGIN
            SELECT booking.customerid, booking.checkin, booking.checkout INTO InputCustomerID, InputCheckIn, InputCheckOut FROM booking WHERE booking.bookingid = NEW.bookingid;
            SELECT branch.province into InputProvince from branch where branchid = new.branchid;

            SELECT booking.bookingid, br.province, booking.checkin, booking.checkout into ExistBookingID, ExistProvince, ExistCheckIn, ExistCheckOut FROM booking NATURAL JOIN (booking_room natural join branch) as br
                WHERE booking.customerid = InputCustomerID AND NEW.BranchID <> br.BranchID
                AND ((InputCheckIn <= booking.CheckIn AND InputCheckOut >= booking.CheckIn)
                OR (InputCheckIn >= booking.CheckIn AND InputCheckIn <= booking.CheckOut));
            
            IF ExistBookingID IS NOT NULL THEN
                RAISE EXCEPTION 'You (%) cannot book at two different branches at a same time:
                EXIST (%, %, %, %)
                NEW   (%, %, %, %)', InputCustomerID, 
                ExistBookingID, ExistProvince, DATE(ExistCheckIn), DATE(ExistCheckOut), 
                NEW.bookingid, InputProvince, DATE(InputCheckIn), DATE(InputCheckOut);
            ELSE
                RETURN NEW;
            END IF;
        END;
    $body$
    LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER trigger_check_valid_booking_room
    BEFORE INSERT ON booking_room
    FOR EACH ROW
    EXECUTE FUNCTION check_valid_booking_room();


-- /////////////////////////////////function/procedure//////////////////////////////////////////

CREATE OR REPLACE PROCEDURE create_booking(
        in inputguestcount integer,
        in inputbookingdate timestamp,
        in inputcheckin timestamp,
        in inputcheckout timestamp,
        in inputcustomerid varchar,
        in inputbookingroom json
    ) AS
    $body$
        DECLARE
            newbookingid varchar;
            room_rec json;
        BEGIN
            INSERT INTO booking (BookingDate, GuestCount, CheckIn, CheckOut, CustomerID) VALUES
            (COALESCE(inputbookingdate, current_timestamp), inputguestcount, inputcheckin, inputcheckout, inputcustomerid) RETURNING bookingid INTO newbookingid;
            for room_rec in select json_array_elements(inputbookingroom)
                loop
                    insert into booking_room (BookingID, BranchID, RoomNumber) 
                    values (
                        newbookingid,
                        (room_rec->>'branchid')::text,
                        (room_rec->>'roomnumber')::text
                    );
                end loop;
        END;
    $body$
    LANGUAGE 'plpgsql';

CREATE OR REPLACE PROCEDURE checkout(
        inputbookingid varchar, json_data json
    )AS
    $body$ 
        DECLARE
            booking_record json;
            food_record json;
        BEGIN
            FOR booking_record IN SELECT json_array_elements(json_data)
            LOOP
                FOR food_record IN SELECT json_array_elements(booking_record->'inputfoodconsumed')
                LOOP
                    INSERT INTO foodconsumed (BookingID, BranchID, RoomNumber, FoodTypeID, Amount) 
                    VALUES (
                        inputbookingid,
                        (booking_record->>'branchid')::text,
                        (booking_record->>'roomnumber')::text,
                        (food_record->>'foodtypeid')::text,
                        (food_record->>'amount')::int
                    );
                END LOOP;
            END LOOP;
        END;
    $body$
    LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION get_vacant_roomtypes(
        InputBranch varchar,
        InputGuest integer,
        InputRoom integer,
        InputCheckIn timestamp,
        InputCheckOut timestamp
    ) RETURNS TABLE (
        roomtypeid integer,
        roomname varchar,
        area integer,
        guestnum integer,
        singlebednum integer,
        doublebednum integer,
        description text,
        room_price integer,
        total_price integer,
        room_count bigint,
        day_count integer,
        vacant_rooms jsonb,
        images jsonb
    ) AS
    $body$
        DECLARE
            CalculatedGuestNum integer DEFAULT CEIL(InputGuest::numeric/InputRoom::numeric);
            day_count integer DEFAULT EXTRACT(DAY FROM (InputCheckOut::timestamp - InputCheckIn::timestamp)) + 1;
        BEGIN
            DROP TABLE IF EXISTS vacant_rooms;
            DROP TABLE IF EXISTS vacant_roomtypes;
            CREATE TEMPORARY TABLE vacant_rooms AS
            SELECT * FROM 
            (SELECT * FROM room NATURAL JOIN roomtype WHERE roomtype.GuestNum = CalculatedGuestNum) AS r0
            WHERE r0.BranchID = InputBranch
            AND NOT EXISTS
            (SELECT * FROM booking NATURAL JOIN booking_room
            WHERE (r0.RoomNumber = booking_room.RoomNumber AND r0.BranchID = booking_room.BranchID) 
            AND ((InputCheckIn <= booking.CheckIn AND InputCheckOut >= booking.CheckIn)
            OR (InputCheckIn >= booking.CheckIn AND InputCheckIn <= booking.CheckOut)));

            CREATE TEMPORARY TABLE vacant_roomtypes AS
            SELECT roomtype.*, roomtype_branch.rentalprice, roomtype_branch.rentalprice*day_count*InputRoom, COUNT(*) AS room_count, day_count as day_count,
            jsonb_agg(jsonb_build_object(
                'branchid', vacant_rooms.branchid,
                'roomnumber', vacant_rooms.roomnumber
            ))
            FROM (roomtype NATURAL JOIN roomtype_branch) NATURAL JOIN vacant_rooms
            WHERE roomtype.GuestNum = CalculatedGuestNum
            GROUP BY roomtype.RoomTypeID, roomtype_branch.rentalprice HAVING COUNT(*) >= InputRoom;

            ALTER TABLE vacant_roomtypes ADD PRIMARY KEY (roomtypeid);


            RETURN QUERY
            SELECT vacant_roomtypes.*, jsonb_agg(jsonb_build_object(
                'image', roomtype_image.image
            )) FROM vacant_roomtypes NATURAL LEFT JOIN roomtype_image GROUP BY vacant_roomtypes.roomtypeid;
            DROP TABLE IF EXISTS vacant_rooms;
            DROP TABLE IF EXISTS vacant_roomtypes;
        END;
    $body$
    LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_branch_statistics(
        InputBranch varchar,
        InputYear integer
    ) RETURNS TABLE (
        month_num integer,
        month_day integer,
        month_text varchar,
        count_room integer,
        count_slot double precision,
        total_slot integer,
        occupancy_rate double precision,
        rental_revenue bigint,
        food_revenue bigint,
        total_revenue bigint,
        total_guest bigint
    ) AS
    $body$
        DECLARE
            count_room_var integer DEFAULT '0';
        BEGIN
            SELECT COUNT(*) INTO count_room_var FROM room WHERE room.BranchID = InputBranch;
            DROP TABLE IF EXISTS all_months;
            DROP TABLE IF EXISTS vacancy_rate;
            CREATE TEMPORARY TABLE all_months (
                    month_num integer,
                    month_day integer,
                    month_text varchar,
                    primary key (month_num)
                );
            INSERT INTO all_months VALUES 
            (1, 31, 'January'),
            (2, 28, 'February'),
            (3, 31, 'March'),
            (4, 30, 'April'),
            (5, 31, 'May'),
            (6, 30, 'June'),
            (7, 31, 'July'),
            (8, 31, 'August'),
            (9, 30, 'September'),
            (10, 31, 'October'),
            (11, 30, 'November'),
            (12, 31, 'December');

            CREATE TEMPORARY TABLE vacancy_rate AS
            SELECT  
                all_months.month_num AS month_num,
                all_months.month_day AS month_day, 
                all_months.month_text AS month_text, 
                count_room_var AS count_room,
                COALESCE(temp.count_slot,0) AS count_slot, 
                all_months.month_day*count_room_var AS total_slot, 
                COALESCE(temp.count_slot,0)/(all_months.month_day*count_room_var) AS occupancy_rate
            FROM (all_months NATURAL LEFT JOIN 
                (SELECT
                    EXTRACT(month FROM booking.CheckIn::timestamp) as month_num,
                    SUM(COALESCE(DATE_PART('day', booking.CheckOut::timestamp - booking.CheckIn::timestamp) + 1,0)) AS count_slot
                FROM room r1 NATURAL LEFT JOIN (booking_room NATURAL JOIN booking)
                WHERE r1.BranchID=InputBranch AND EXTRACT(year FROM booking.CheckIn::timestamp) = InputYear
                GROUP BY EXTRACT(month FROM booking.CheckIn::timestamp)
                )
            as temp)
            ORDER BY all_months.month_num ASC;
            ALTER TABLE vacancy_rate ADD PRIMARY KEY (month_num);

            RETURN QUERY
            SELECT vacancy_rate.*, SUM(bktemp.rentalcost), SUM(bktemp.foodcost), 
            SUM(bktemp.rentalcost) + SUM(bktemp.foodcost), SUM(bktemp.guestcount)
            FROM vacancy_rate NATURAL JOIN 
            (select booking.*, EXTRACT(month FROM booking.CheckIn::timestamp) as month_num 
            from booking natural join booking_room 
            where booking_room.branchid = InputBranch and EXTRACT(year FROM booking.CheckIn::timestamp) = InputYear
            group by booking.bookingid) as bktemp
            group by vacancy_rate.month_num;

            DROP TABLE IF EXISTS all_months;
            DROP TABLE IF EXISTS vacancy_rate;
        END;
    $body$
    LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_rooms_calendar(
        inputbranch varchar,
        inputyear integer,
        inputmonth integer
    ) RETURNS TABLE (
        roomtypeid integer,
        roomname varchar,
        area integer,
        guestnum integer,
        singlebednum integer,
        doublebednum integer,
        description text,
        count_room bigint,
        total_slot bigint,
        rooms jsonb,
        count_slot double precision,
        occupancy_rate double precision
    ) AS 
    $body$
        DECLARE
            current_month_day integer;
        BEGIN
            DROP TABLE IF EXISTS roomtype_temp;
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
            SELECT month_day INTO current_month_day from all_months where month_num = inputmonth;
            create temporary table roomtype_temp as
            SELECT roomtype.*, COALESCE(count(*),0) as count_room, COALESCE(count(*)*current_month_day,0) as total_slot, jsonb_agg(jsonb_build_object(
                'branchid', room.branchid,
                'roomnumber', room.roomnumber,
                'bookings', (SELECT jsonb_agg(jsonb_build_object(
                                    'title', bc_join.bookingid,
                                    'start', bc_join.checkin,
                                    'end', date_add(bc_join.checkout::timestamp, '1 day'::interval), -- for render purpose
                                    'end_original', bc_join.checkout,
                                    'allDay', true, -- for render purpose
                                    'customerid', bc_join.customerid,
                                    'customername', bc_join.fullname
                                ))
                            FROM booking_room NATURAL JOIN (select * from booking NATURAL JOIN customer) as bc_join 
                            WHERE EXTRACT(year from bc_join.checkin::timestamp) = inputyear 
                            AND EXTRACT(month from bc_join.checkin::timestamp) = inputmonth
                            AND booking_room.branchid = room.branchid AND booking_room.roomnumber = room.roomnumber
                            GROUP BY room.branchid, room.roomnumber)
            )ORDER BY room.roomnumber) FROM roomtype NATURAL LEFT JOIN room
            WHERE room.branchid = inputbranch
            GROUP BY roomtype.roomtypeid 
            ORDER BY roomtype.roomtypeid;

            ALTER TABLE roomtype_temp ADD PRIMARY KEY (roomtypeid);

            RETURN QUERY
            SELECT roomtype_temp.*, COALESCE(SUM(br_join.num_days),0) as count_slot, 
            COALESCE(SUM(br_join.num_days)/roomtype_temp.total_slot,0) as occupancy_rate FROM roomtype_temp
            NATURAL LEFT JOIN (SELECT * FROM room NATURAL LEFT JOIN 
            (SELECT *, COALESCE(DATE_PART('day', booking.checkout::timestamp - booking.checkin::timestamp) + 1,0) as num_days
            FROM booking_room NATURAL JOIN booking
            WHERE booking_room.branchid = inputbranch 
            AND EXTRACT(year from booking.checkin::timestamp) = inputyear
            AND EXTRACT(month from booking.checkin::timestamp) = inputmonth )) as br_join
            GROUP BY roomtype_temp.roomtypeid
            ORDER BY roomtype_temp.roomtypeid;
            DROP TABLE IF EXISTS roomtype_temp;
            DROP TABLE IF EXISTS all_months;
        END;
    $body$
    LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION get_bookings(
        inputbranchid varchar,
        checkinnull varchar,
        checkoutnull varchar
    ) RETURNS TABLE (
        CustomerID VARCHAR,
        BookingID VARCHAR,
        BookingDate TIMESTAMP,
        GuestCount INTEGER,
        CheckIn TIMESTAMP,
        CheckOut TIMESTAMP,
        ActualCheckIn TIMESTAMP,
        ActualCheckOut TIMESTAMP,
        RentalCost INTEGER,
        FoodCost INTEGER,
        TotalCost INTEGER,
        booking_rooms jsonb,
        CitizenID VARCHAR,
        FullName VARCHAR,
        DateOfBirth DATE,
        Phone VARCHAR,
        Email VARCHAR,
        Username VARCHAR,
        Password VARCHAR
    ) AS 
        $body$
        BEGIN
            RETURN QUERY
            EXECUTE format('SELECT * from (
                SELECT booking.*, booking.rentalcost + booking.foodcost as totalcost, 
                    jsonb_agg(jsonb_build_object(
                        ''branchid'', booking_room.branchid,
                        ''roomnumber'', booking_room.roomnumber,
                        ''foodconsumed'', (SELECT jsonb_agg(jsonb_build_object(
                            ''foodtypeid'', food_join.foodtypeid,
                            ''foodname'', food_join.foodname,
                            ''foodprice'', food_join.foodprice,
                            ''amount'', food_join.amount
                        )) FROM (foodconsumed natural join foodtype) as food_join
                        WHERE food_join.branchid = booking_room.branchid 
                        AND food_join.roomnumber = booking_room.roomnumber
                        AND food_join.bookingid = booking_room.bookingid
                        GROUP BY booking_room.bookingid, booking_room.branchid, booking_room.roomnumber)
                ))
            FROM booking NATURAL JOIN booking_room WHERE booking_room.branchid = %L GROUP BY booking.bookingid) as br NATURAL JOIN customer
            WHERE br.ActualCheckIn IS %s AND br.ActualCheckOut IS %s
            ORDER BY br.bookingid DESC;', inputbranchid, checkinnull, checkoutnull);
        END;
        $body$
        LANGUAGE 'plpgsql';

-- CREATE OR REPLACE FUNCTION get_rooms_calendar(
--     inputbranch varchar,
--     inputyear integer,
--     inputmonth integer
-- )
-- RETURNS TABLE (
--     roomtypeid integer,
--     roomname varchar,
--     area integer,
--     guestnum integer,
--     singlebednum integer,
--     doublebednum integer,
--     description text,
--     count_slot double precision,
--     rooms jsonb
-- ) AS
-- $$
-- BEGIN
--     RETURN QUERY
--     SELECT roomtype.*,
--     COALESCE(SUM(COALESCE(DATE_PART('day', booking_temp.checkout::timestamp - booking_temp.checkin::timestamp) + 1,0)),0), 
--     jsonb_agg(jsonb_build_object(
--         'branchid', booking_temp.branchid,
--         'roomnumber', booking_temp.roomnumber,
--         'bookings', (SELECT jsonb_agg(jsonb_build_object(
--                             'title', booking.bookingid,
--                             'start', booking.checkin,
--                             'end', date_add(booking.checkout::timestamp, '1 day'::interval),
--                             'end_original', booking.checkout,
--                             'num_days', COALESCE(DATE_PART('day', booking.checkout::timestamp - booking.checkin::timestamp) + 1,0),
--                             'allDay', true
--                         ))
--                     FROM booking_room NATURAL JOIN booking 
--                     WHERE EXTRACT(year from booking.checkin::timestamp) = inputyear 
--                     AND EXTRACT(month from booking.checkin::timestamp) = inputmonth
--                     AND booking_room.branchid = room.branchid AND booking_room.roomnumber = room.roomnumber
--                     GROUP BY room.branchid, room.roomnumber)
--     )ORDER BY room.roomnumber) 
--     FROM roomtype NATURAL LEFT JOIN
--     (select * from room NATURAL LEFT JOIN 
--     (SELECT * FROM booking_room br NATURAL LEFT JOIN booking b 
--     WHERE EXTRACT(year from b.checkin::timestamp) = inputyear 
--     AND EXTRACT(month from b.checkin::timestamp) = inputmonth)
--     WHERE room.branchid = inputbranch) as booking_temp
--     GROUP BY roomtype.roomtypeid 
--     ORDER BY roomtype.roomtypeid;
-- END;
-- $$
-- LANGUAGE 'plpgsql';


-- CREATE OR REPLACE FUNCTION get_groups_with_users_and_notes()
-- RETURNS TABLE (
--     groupid INT,
--     groupname TEXT,
--     users JSONB
-- ) AS
-- $$
-- BEGIN
--     RETURN QUERY
--     SELECT
--         g.groupid,
--         g.groupname,
--         jsonb_agg(jsonb_build_object(
--             'userid', u.userid,
--             'username', u.username,
--             'notes', (
--                 SELECT jsonb_agg(jsonb_build_object(
--                     'noteid', n.noteid,
--                     'notecontent', n.notecontent,
--                     'createddate', n.createddate
--                 ))
--                 FROM note n
--                 WHERE n.userid = u.userid
--                 ORDER BY n.createddate
--             )
--         ) ORDER BY u.username) AS users
--     FROM
--         "group" g
--     LEFT JOIN
--         "user" u ON g.groupid = u.groupid
--     GROUP BY
--         g.groupid, g.groupname;
-- END;
-- $$
-- LANGUAGE 'plpgsql';

