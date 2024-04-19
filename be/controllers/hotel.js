const hotelRouter = require('express').Router()
const connection = require('../mysql_connect')
const client = require('../connection_pg')
hotelRouter.get("/room", async (request, response) => {
    let query = ``;
    for (let BranchID = 1; BranchID <= 2; BranchID++) {
        for (let RoomTypeID = 1; RoomTypeID <= 8; RoomTypeID++) {
            for (let RoomNumber = 1; RoomNumber <= 8; RoomNumber++) {
                let newSql = `('BR0${BranchID}', '${RoomTypeID}0${RoomNumber}', '${RoomTypeID}'),<br>`
                query = query.concat(newSql)
            }
        }
    }
    // console.log(query)
    response.send(query)
})

hotelRouter.get("/booking", async (request, response) => {
    connection.query('SELECT *, DATEDIFF(booking.CheckOut, booking.CheckIn) AS DATEDIFF FROM booking;', (err, rows, fields) => {
        if (err) throw err
        // console.log("err: ", err)
        // console.log("rows: ", rows)
        // console.log("fields: ", fields)
        response.send(rows)
    })
})

hotelRouter.get("/roomtest", async (request, response) => {
    connection.query(`SELECT room.BranchID, room.RoomNumber, booking.BookingID, booking.BookingDate, IFNULL(booking.GuestCount,0) AS GuestCount,
    booking.CheckIn, booking.CheckOut, booking.Status, booking.RentalCost, booking.FoodCost, booking.CustomerID,
    IFNULL((DATEDIFF(booking.CheckOut, booking.CheckIn) + 1)/31,0) as FULLRATE FROM room
    LEFT JOIN (booking_room INNER JOIN booking ON booking_room.BookingID = booking.BookingID) 
    ON room.BranchID = booking_room.BranchID AND room.RoomNumber = booking_room.RoomNumber
    WHERE room.BranchID="CN1";`, (err, rows, fields) => {
        if (err) throw err
        // console.log("err: ", err)
        // console.log("rows: ", rows)
        // console.log("fields: ", fields)
        response.send({ rows: rows, len: rows.length })
    })
})

hotelRouter.get("/vacant", async (request, response) => {
    connection.query(`CALL GetVacantRooms('CN1',11,11,'2023-11-20','2023-11-25');`, (err, rows, fields) => {
        if (err) throw err
        // console.log("err: ", err)
        // console.log("rows: ", rows)
        // console.log("fields: ", fields)
        response.send(rows)
        // response.send({ err: err, fields: fields, rows: rows, len: rows.length })
    })
})


hotelRouter.get("/insert", async (request, response) => {
    connection.query(`INSERT INTO booking (BookingDate, GuestCount, CheckIn, CheckOut, CustomerID) VALUES
    ('2022-11-23 13:02:50', '5', '2023-11-20', '2023-11-21', 'KH000001');`, (err, rows, fields) => {
        if (err) throw err
        // console.log("err: ", err)
        // console.log("rows: ", rows)
        // console.log("fields: ", fields)
        response.send(rows)
        // response.send({ err: err, fields: fields, rows: rows, len: rows.length })
    })
})
hotelRouter.get("/random", async (request, response) => {
    response.send(getRandomDatesInSameMonth())
})


hotelRouter.get("/trash", (request, response) => {
    let bookingQuery = ''
    let bookingRoomQuery = ''
    connection.query(`SELECT * FROM customer;`, (err, customerRows, fields) => {
        customerRows.forEach((customer, index) => {
            let randomBookingCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 1; i <= randomBookingCount; i++) {
                let { bookingDate, checkInDate, checkOutDate } = getRandomDatesInSameMonth()
                let { guestCount, roomCount } = generateRandomNumbers()
                let branchID = Math.floor(Math.random() * 2) + 1 == 1 ? 'CN1' : 'CN2'
                let checkBooking = false
                while (!checkBooking) {
                    connection.query(`CALL GetVacantRooms('${branchID}','${guestCount}','${roomCount}','${checkInDate}','${checkOutDate}');`, (err, roomTypeRows, fields) => {
                        if (roomTypeRows[0].length > 0) {
                            bookingQuery = bookingQuery.concat(`('${bookingDate}','${guestCount}','${checkInDate}','${checkOutDate}','${customer.customerID}'),<br>`)
                            checkBooking = true
                        }
                        else {
                            console.log("fail")
                        }
                    })
                }
            }
        })
        console.log("bookingQuery: ", bookingQuery)
        response.send(bookingQuery)
    })
})


hotelRouter.get("/transaction", (request, response) => {
    // console.log("request", request.body)
    connection.query(`START TRANSACTION;`, (err1, rows1, fields1) => {
        connection.query(`INSERT INTO booking (BookingDate, GuestCount, CheckIn, CheckOut, CustomerID) VALUES
        ('2023-02-10','20','2024-04-20','2024-04-20','KH000001');`, (err2, rows2, fields2) => {
            connection.query(`COMMIT;`, (err3, rows3, fields3) => {
                console.log("err1", err1)
                console.log("err2", err2)
                console.log("err3", err3)
                console.log("rows1", rows1)
                console.log("rows2", rows2)
                console.log("rows3", rows3)
                console.log("fields1", fields1)
                console.log("fields2", fields2)
                console.log("fields3", fields3)
                response.send("hehehe")
            })
        })
    })

})

hotelRouter.get("/testpg", async (request, response) => {
    // console.log("request", request.body)
    try {
        let result = await client.query(`
            select * from get_rooms_with_bookings('BR01','2024','06');
        `)
        response.send(result)
    }
    catch (e) {
        console.log("error is:", e)
        response.send({ "error is": JSON.stringify(e) })
    }
})
hotelRouter.get("/testpg2", async (request, response) => {
    // console.log("request", request.body)
    try {
        let result = await client.query(`
            SELECT * from get_vacant_roomtypes('BR01', '8','4','2024-01-13','2024-01-14', true);
        `)
        response.send(result)
    }
    catch (e) {
        console.log("error is:", e)
        response.send({ "error is": JSON.stringify(e) })
    }
})


// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
hotelRouter.post("/login-customer", async (request, response) => {
    // connection.query(`SELECT * FROM customer;`, (err, customerRows, fields) => {
    //     response.send(customerRows)
    // })
    try {
        console.log("username", request.body.username)
        console.log("password", request.body.password)
        let result = await client.query(`
            SELECT * FROM customer WHERE customer.username='${request.body.username}' AND customer.password='${request.body.password}';
        `)
        if (result.rows.length == 0) {
            response.status(401).json({
                error: 'invalid username or password'
            })
        }
        else {
            response.send(result)
        }
    }
    catch (e) {
        console.log("error is:", e)
        response.send({ "error is": JSON.stringify(e) })
    }
})
hotelRouter.get("/customer", async (request, response) => {
    // connection.query(`SELECT * FROM customer;`, (err, customerRows, fields) => {
    //     response.send(customerRows)
    // })
    try {
        let result = await client.query(`
            SELECT * FROM customer;
        `)
        response.send(result)
    }
    catch (e) {
        console.log("error is:", e)
        response.send({ "error is": JSON.stringify(e) })
    }
})
hotelRouter.post("/getbookings", async (request, response) => {
    // console.log("request", request.body)
    // connection.query(`CALL GetVacantRooms('${request.body.branchID}','${request.body.guestCount}','${request.body.roomCount}','${request.body.checkInDate}','${request.body.checkOutDate}');`, (err, roomTypeRows, fields) => {
    //     response.json({
    //         roomTypesAvailable: roomTypeRows[0],
    //         roomsAvailable: roomTypeRows[1]
    //     })
    // })
    console.log("checkinnull", request.body.checkinnull)
    console.log("checkoutnull", request.body.checkoutnull)
    try {
        await client.query("BEGIN;")
        let result = await client.query(`
            select * from get_bookings('${request.body.checkinnull}', '${request.body.checkoutnull}');
        `)
        await client.query("COMMIT;")
        response.send(result)
    }
    catch (e) {
        await client.query("ROLLBACK;")
        console.log("error is:", e)
        response.send({ "error is": JSON.stringify(e) })
    }
})
hotelRouter.post("/getvacant", async (request, response) => {
    // console.log("request", request.body)
    // connection.query(`CALL GetVacantRooms('${request.body.branchID}','${request.body.guestCount}','${request.body.roomCount}','${request.body.checkInDate}','${request.body.checkOutDate}');`, (err, roomTypeRows, fields) => {
    //     response.json({
    //         roomTypesAvailable: roomTypeRows[0],
    //         roomsAvailable: roomTypeRows[1]
    //     })
    // })
    try {
        let result = await client.query(`
            SELECT * from get_vacant_roomtypes('${request.body.branchID}','${request.body.guestCount}','${request.body.roomCount}','${request.body.checkInDate}','${request.body.checkOutDate}', false);
            SELECT * from get_vacant_roomtypes('${request.body.branchID}','${request.body.guestCount}','${request.body.roomCount}','${request.body.checkInDate}','${request.body.checkOutDate}', true);
        `)
        response.send(result)
    }
    catch (e) {
        console.log("error is:", e)
        response.send({ "error is": JSON.stringify(e) })
    }
})


hotelRouter.post("/addbooking", async (request, response) => {
    try {
        await client.query("BEGIN;")
        let result = await client.query(`INSERT INTO booking (BookingDate, GuestCount, CheckIn, CheckOut, CustomerID, Status) VALUES ('${request.body.bookingDate}','${request.body.guestCount}','${request.body.checkInDate}','${request.body.checkOutDate}','${request.body.customerID}','1') RETURNING *;`)
        await client.query("COMMIT;")
        response.send(result)
    }
    catch (e) {
        await client.query("ROLLBACK;")
        throw e
        // response.send({ "error is": JSON.stringify(e) })
    }
})

hotelRouter.post("/addroombooking", async (request, response) => {
    try {
        await client.query("BEGIN;")
        let result = await client.query(`INSERT INTO booking_room (BookingID, BranchID, RoomNumber) VALUES ('${request.body.bookingID}','${request.body.branchID}','${request.body.roomNumber}') RETURNING *;`)
        await client.query("COMMIT;")
        response.send(result)
    }
    catch (e) {
        await client.query("ROLLBACK;")
        throw e
        // response.send({ "error is": JSON.stringify(e) })
    }
})

hotelRouter.post("/checkin", async (request, response) => {
    try {
        await client.query("BEGIN;")
        let result = await client.query(`UPDATE booking SET ActualCheckIn = CURRENT_TIMESTAMP WHERE BookingID = '${request.body.bookingid}' RETURNING *;`)
        await client.query("COMMIT;")
        response.send(result)
    }
    catch (e) {
        await client.query("ROLLBACK;")
        throw e
        // response.send({ "error is": JSON.stringify(e) })
    }
})

hotelRouter.post("/checkout", async (request, response) => {
    try {
        await client.query("BEGIN;")
        let newQuery = `CALL checkout('${request.body.bookingid}','${JSON.stringify(request.body.roomlist)}');`
        console.log("newQuery", newQuery)
        let result = await client.query(newQuery)
        await client.query("COMMIT;")
        response.send(result)
    }
    catch (e) {
        await client.query("ROLLBACK;")
        throw e
        // response.send({ "error is": JSON.stringify(e) })
    }
})

hotelRouter.post("/createbooking", async (request, response) => {
    // connection.query(`SELECT * FROM customer;`, (err, customerRows, fields) => {
    //     response.send(customerRows)
    // })
    try {
        await client.query("BEGIN;")
        // CALL create_booking(18,'2024-06-05','2024-06-07', 'CS000001', ARRAY[
        //     ROW(null, 'BR01', '305')::booking_room,
        //     ROW(null, 'BR01', '306')::booking_room,
        //     ROW(null, 'BR01', '307')::booking_room
        // ]);
        let insertQuery = `CALL create_booking('${request.body.guestcount}','${request.body.checkin}','${request.body.checkout}', '${request.body.customerid}', ARRAY[`
        for (let i = 0; i < request.body.booking_rooms.length; i++) {
            let valueQuery = `ROW(null, '${request.body.booking_rooms[i].branchid}','${request.body.booking_rooms[i].roomnumber}')::booking_room`
            if (i == request.body.booking_rooms.length - 1) {
                valueQuery = valueQuery.concat(`]);`)
            }
            else {
                valueQuery = valueQuery.concat(`,`)
            }
            insertQuery = insertQuery.concat(valueQuery)
        }
        let result = await client.query(insertQuery)
        await client.query("COMMIT;")
        response.send(result)
    }
    catch (e) {
        await client.query("ROLLBACK;")
        console.log("error is:", e)
        response.send(e.message)
    }
})
hotelRouter.post("/getroomcalendar", async (request, response) => {
    try {
        await client.query("BEGIN;")
        let result = await client.query(`select * from get_rooms_with_bookings('${request.body.branchid}','${request.body.inputyear}','${request.body.inputmonth}');`)
        await client.query("COMMIT;")
        response.send(result)
    }
    catch (e) {
        await client.query("ROLLBACK;")
        throw e
        // response.send({ "error is": JSON.stringify(e) })
    }
})
hotelRouter.post("/statistics", async (request, response) => {
    try {
        await client.query("BEGIN;")
        let result = await client.query(`SELECT * FROM get_statistics('${request.body.branchID}','${request.body.year}');`)
        await client.query("COMMIT;")
        response.send(result)
    }
    catch (e) {
        await client.query("ROLLBACK;")
        throw e
        // response.send({ "error is": JSON.stringify(e) })
    }
})
hotelRouter.get("/food", async (request, response) => {
    try {
        await client.query("BEGIN;")
        let result = await client.query(`SELECT * FROM foodtype;`)
        await client.query("COMMIT;")
        response.send(result)
    }
    catch (e) {
        await client.query("ROLLBACK;")
        throw e
        // response.send({ "error is": JSON.stringify(e) })
    }
})
hotelRouter.get("/branch", async (request, response) => {
    try {
        await client.query("BEGIN;")
        let result = await client.query(`SELECT branch.*, jsonb_agg(jsonb_build_object(
            'image', branch_image.image)) as images FROM branch natural join branch_image group by branch.branchid;`)
        await client.query("COMMIT;")
        response.send(result)
    }
    catch (e) {
        await client.query("ROLLBACK;")
        throw e
        // response.send({ "error is": JSON.stringify(e) })
    }
})

module.exports = hotelRouter