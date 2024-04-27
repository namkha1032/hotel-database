const hotelRouter = require('express').Router()
// const connection = require('../mysql_connect')
const client = require('../connection_pg')
const fs = require('fs');

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
hotelRouter.post("/login", async (request, response) => {
    try {
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
        response.status(401).json('invalid username or password')
    }
})
hotelRouter.post("/signup", async (request, response) => {
    try {
        let result = await client.query(`
        INSERT INTO customer (CitizenID, FullName, Phone, Email, Username, Password, DateOfBirth) VALUES 
        ('${request.body.citizenid}','${request.body.fullname}','${request.body.phone}','${request.body.email}','${request.body.username}','${request.body.password}','${request.body.dob}');
        `)
        response.send(result)
    }
    catch (e) {
        console.log("error is:", e)
        response.status(401).json(e.message)
    }
})
hotelRouter.get("/customer", async (request, response) => {
    try {
        let result = await client.query(`
            SELECT * FROM customer;
        `)
        response.send(result)
    }
    catch (e) {
        console.log("error is:", e)
        response.status(401).json(e.message)
    }
})
hotelRouter.post("/getbookings", async (request, response) => {
    try {
        let newQuery = `select * from get_bookings('${request.body.branchid}', '${request.body.checkinnull}', '${request.body.checkoutnull}');`
        console.log(newQuery)
        let result = await client.query(newQuery)
        response.send(result)
    }
    catch (e) {
        console.log("error is:", e)
        response.status(401).json(e.message)
    }
})
hotelRouter.post("/getvacant", async (request, response) => {
    try {
        let newQuery = `
        SELECT * from get_vacant_roomtypes('${request.body.branchID}','${request.body.guestCount}','${request.body.roomCount}','${request.body.checkInDate}','${request.body.checkOutDate}');`
        console.log(newQuery)
        let result = await client.query(newQuery)
        response.send(result)
    }
    catch (e) {
        console.log("error is:", e)
        response.status(401).json(e.message)
    }
})
hotelRouter.post("/checkin", async (request, response) => {
    try {
        let result = await client.query(`UPDATE booking SET ActualCheckIn = CURRENT_TIMESTAMP WHERE BookingID = '${request.body.bookingid}' RETURNING *;`)
        response.send(result)
    }
    catch (e) {
        response.status(401).json(e.message)
    }
})
hotelRouter.post("/checkout", async (request, response) => {
    try {
        let newQuery = `CALL checkout('${request.body.bookingid}','${JSON.stringify(request.body.roomlist)}');`
        console.log(newQuery)
        let result = await client.query(newQuery)
        response.send(result)
    }
    catch (e) {
        response.status(401).json(e.message)
    }
})
hotelRouter.post("/createbooking", async (request, response) => {
    try {
        let bookingDate = request.body.bookingdate ? `'${request.body.bookingdate}'` : null
        let newQuery = `CALL create_booking('${request.body.guestcount}',${bookingDate},'${request.body.checkin}','${request.body.checkout}', '${request.body.customerid}', '${JSON.stringify(request.body.booking_rooms)}');`
        console.log(newQuery)
        let result = await client.query(newQuery)
        response.send({ result: "success", message: result })
    }
    catch (e) {
        console.log("error is:", e)
        response.status(401).json(e.message)
    }
})
hotelRouter.post("/getroomcalendar", async (request, response) => {
    try {
        let newQuery = `select * from get_rooms_calendar('${request.body.branchid}','${request.body.inputyear}','${request.body.inputmonth}');`
        console.log(newQuery)
        let result = await client.query(newQuery)
        response.send(result)
    }
    catch (e) {
        response.status(401).json(e.message)
    }
})
hotelRouter.post("/deletebooking", async (request, response) => {
    try {
        console.log("bookingid: ", request.body.bookingid)
        let result = await client.query(`DELETE FROM booking WHERE bookingid = '${request.body.bookingid}';`)
        response.send(result)
    }
    catch (e) {
        console.log("e", e)
        response.status(401).json(e.message)
    }
})
hotelRouter.post("/statistics", async (request, response) => {
    try {
        let newQuery = `SELECT * FROM get_branch_statistics('${request.body.branchID}','${request.body.year}');`
        console.log(newQuery)
        let result = await client.query(newQuery)
        response.send(result)
    }
    catch (e) {
        response.status(401).json(e.message)
    }
})
hotelRouter.get("/food", async (request, response) => {
    try {
        let result = await client.query(`SELECT * FROM foodtype;`)
        response.send(result)
    }
    catch (e) {
        response.status(401).json(e.message)
    }
})
hotelRouter.get("/branch", async (request, response) => {
    try {
        let result = await client.query(`SELECT branch.*, jsonb_agg(jsonb_build_object(
            'image', branch_image.image)) as images FROM branch natural join branch_image group by branch.branchid order by branch.branchid;`)
        response.send(result)
    }
    catch (e) {
        response.status(401).json(e.message)
    }
})

/////////////////////////////////////////////////////////////////////////////

// hotelRouter.get("/room", async (request, response) => {
//     let query = ``;
//     for (let BranchID = 1; BranchID <= 4; BranchID++) {
//         for (let RoomTypeID = 1; RoomTypeID <= 8; RoomTypeID++) {
//             for (let RoomNumber = 0; RoomNumber <= 9; RoomNumber++) {
//                 let newSql = `('BR0${BranchID}', '${RoomTypeID}0${RoomNumber}', '${RoomTypeID}'),<br>`
//                 query = query.concat(newSql)
//             }
//         }
//     }
//     // console.log(query)
//     response.send(query)
// })

// hotelRouter.get("/booking", async (request, response) => {
//     connection.query('SELECT *, DATEDIFF(booking.CheckOut, booking.CheckIn) AS DATEDIFF FROM booking;', (err, rows, fields) => {
//         if (err) throw err
//         // console.log("err: ", err)
//         // console.log("rows: ", rows)
//         // console.log("fields: ", fields)
//         response.send(rows)
//     })
// })

// hotelRouter.get("/roomtest", async (request, response) => {
//     connection.query(`SELECT room.BranchID, room.RoomNumber, booking.BookingID, booking.BookingDate, IFNULL(booking.GuestCount,0) AS GuestCount,
//     booking.CheckIn, booking.CheckOut, booking.Status, booking.RentalCost, booking.FoodCost, booking.CustomerID,
//     IFNULL((DATEDIFF(booking.CheckOut, booking.CheckIn) + 1)/31,0) as FULLRATE FROM room
//     LEFT JOIN (booking_room INNER JOIN booking ON booking_room.BookingID = booking.BookingID) 
//     ON room.BranchID = booking_room.BranchID AND room.RoomNumber = booking_room.RoomNumber
//     WHERE room.BranchID="CN1";`, (err, rows, fields) => {
//         if (err) throw err
//         // console.log("err: ", err)
//         // console.log("rows: ", rows)
//         // console.log("fields: ", fields)
//         response.send({ rows: rows, len: rows.length })
//     })
// })

// hotelRouter.get("/vacant", async (request, response) => {
//     connection.query(`CALL GetVacantRooms('CN1',11,11,'2023-11-20','2023-11-25');`, (err, rows, fields) => {
//         if (err) throw err
//         // console.log("err: ", err)
//         // console.log("rows: ", rows)
//         // console.log("fields: ", fields)
//         response.send(rows)
//         // response.send({ err: err, fields: fields, rows: rows, len: rows.length })
//     })
// })


// hotelRouter.get("/insert", async (request, response) => {
//     connection.query(`INSERT INTO booking (BookingDate, GuestCount, CheckIn, CheckOut, CustomerID) VALUES
//     ('2022-11-23 13:02:50', '5', '2023-11-20', '2023-11-21', 'KH000001');`, (err, rows, fields) => {
//         if (err) throw err
//         // console.log("err: ", err)
//         // console.log("rows: ", rows)
//         // console.log("fields: ", fields)
//         response.send(rows)
//         // response.send({ err: err, fields: fields, rows: rows, len: rows.length })
//     })
// })
// hotelRouter.get("/random", async (request, response) => {
//     response.send(getRandomDatesInSameMonth())
// })


// hotelRouter.get("/trash", (request, response) => {
//     let bookingQuery = ''
//     let bookingRoomQuery = ''
//     connection.query(`SELECT * FROM customer;`, (err, customerRows, fields) => {
//         customerRows.forEach((customer, index) => {
//             let randomBookingCount = Math.floor(Math.random() * 2) + 1;
//             for (let i = 1; i <= randomBookingCount; i++) {
//                 let { bookingDate, checkInDate, checkOutDate } = getRandomDatesInSameMonth()
//                 let { guestCount, roomCount } = generateRandomNumbers()
//                 let branchID = Math.floor(Math.random() * 2) + 1 == 1 ? 'CN1' : 'CN2'
//                 let checkBooking = false
//                 while (!checkBooking) {
//                     connection.query(`CALL GetVacantRooms('${branchID}','${guestCount}','${roomCount}','${checkInDate}','${checkOutDate}');`, (err, roomTypeRows, fields) => {
//                         if (roomTypeRows[0].length > 0) {
//                             bookingQuery = bookingQuery.concat(`('${bookingDate}','${guestCount}','${checkInDate}','${checkOutDate}','${customer.customerID}'),<br>`)
//                             checkBooking = true
//                         }
//                         else {
//                             console.log("fail")
//                         }
//                     })
//                 }
//             }
//         })
//         console.log("bookingQuery: ", bookingQuery)
//         response.send(bookingQuery)
//     })
// })


// hotelRouter.get("/transaction", (request, response) => {
//     // console.log("request", request.body)
//     connection.query(`START TRANSACTION;`, (err1, rows1, fields1) => {
//         connection.query(`INSERT INTO booking (BookingDate, GuestCount, CheckIn, CheckOut, CustomerID) VALUES
//         ('2023-02-10','20','2024-04-20','2024-04-20','KH000001');`, (err2, rows2, fields2) => {
//             connection.query(`COMMIT;`, (err3, rows3, fields3) => {
//                 console.log("err1", err1)
//                 console.log("err2", err2)
//                 console.log("err3", err3)
//                 console.log("rows1", rows1)
//                 console.log("rows2", rows2)
//                 console.log("rows3", rows3)
//                 console.log("fields1", fields1)
//                 console.log("fields2", fields2)
//                 console.log("fields3", fields3)
//                 response.send("hehehe")
//             })
//         })
//     })

// })

// hotelRouter.get("/testpg", async (request, response) => {
//     // console.log("request", request.body)
//     try {
//         let result = await client.query(`
//             select * from get_rooms_calendar('BR01','2024','06');
//         `)
//         response.send(result)
//     }
//     catch (e) {
//         console.log("error is:", e)
//         response.status(401).json(e.message)
//     }
// })
// hotelRouter.get("/testpg2", async (request, response) => {
//     // console.log("request", request.body)
//     try {
//         // let result = await client.query(`
//         //     SELECT * from get_vacant_roomtypes('BR01', '8','4','2024-01-13','2024-01-14', true);
//         // `)
//         let result = await client.query(`
//         select * from create_booking_xoa(20, '2024-06-07', '2024-06-08', 'CS000001', '[
//             {
//                 "branchid": "BR02",
//                 "roomnumber": "101"
//             },
//             {
//                 "branchid": "BR02",
//                 "roomnumber": "102"
//             }
//         ]');
//         `)
//         response.send(result)
//     }
//     catch (e) {
//         console.log("error is:", e)
//         response.status(401).json(e.message)
//     }
// })

// hotelRouter.get("/testpg3", async (request, response) => {
//     // connection.query(`SELECT * FROM customer;`, (err, customerRows, fields) => {
//     //     response.send(customerRows)
//     // })
//     let filedata = require('fs').readFileSync("output.json");
//     // Parse the JSON data
//     const bookingArray = JSON.parse(filedata);
//     // console.log("bookingArray", bookingArray)
//     let count = 0
//     let currentBooking = ""
//     try {
//         for (let i = 0; i < bookingArray.length; i++) {
//             count = i
//             currentBooking = bookingArray[i].bookingid
//             await client.query("BEGIN;")
//             // CALL create_booking(18,'2024-06-05','2024-06-07', 'CS000001', ARRAY[
//             //     ROW(null, 'BR01', '305')::booking_room,
//             //     ROW(null, 'BR01', '306')::booking_room,
//             //     ROW(null, 'BR01', '307')::booking_room
//             // ]);
//             // console.log("books", request.body.booking_rooms)
//             let bookingDate = request.body.bookingdate ? `'${request.body.bookingdate}'` : null
//             let insertQuery = `CALL create_booking('${bookingArray[i].guestcount}','${bookingArray[i].bookingdate}','${bookingArray[i].checkin}','${bookingArray[i].checkout}', '${bookingArray[i].customerid}', '${JSON.stringify(bookingArray[i].booking_rooms)}');`
//             // console.log("insertQuery", insertQuery)
//             let result = await client.query(insertQuery)
//             let result2 = await client.query(`select * from get_rooms_calendar('BR02','2023','06');`)

//             await client.query("COMMIT;")
//         }
//         console.log("success")
//         response.send({ message: "Success" })
//     }
//     catch (e) {
//         await client.query("ROLLBACK;")
//         console.log("error is:", e)
//         console.log("count", count)
//         console.log("currentBooking", currentBooking)
//         response.status(401).json({
//             message: e.message,
//             count: count,
//             currentBooking: currentBooking
//         })
//     }
// })


// hotelRouter.post("/addbooking", async (request, response) => {
//     try {
//         await client.query("BEGIN;")
//         let result = await client.query(`INSERT INTO booking (BookingDate, GuestCount, CheckIn, CheckOut, CustomerID, Status) VALUES ('${request.body.bookingDate}','${request.body.guestCount}','${request.body.checkInDate}','${request.body.checkOutDate}','${request.body.customerID}','1') RETURNING *;`)
//         await client.query("COMMIT;")
//         response.send(result)
//     }
//     catch (e) {
//         await client.query("ROLLBACK;")
//         response.send({ rows: [] })
//     }
// })

// hotelRouter.post("/addroombooking", async (request, response) => {
//     try {
//         await client.query("BEGIN;")
//         let result = await client.query(`INSERT INTO booking_room (BookingID, BranchID, RoomNumber) VALUES ('${request.body.bookingID}','${request.body.branchID}','${request.body.roomNumber}') RETURNING *;`)
//         await client.query("COMMIT;")
//         response.send(result)
//     }
//     catch (e) {
//         await client.query("ROLLBACK;")
//         throw e
//         // response.status(401).json(e.message)
//     }
// })
module.exports = hotelRouter