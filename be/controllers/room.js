const roomRouter = require('express').Router()

const connection = require('../db_connect')
roomRouter.get("/", async (request, response) => {
    connection.query('call ThongKeLuotKhach("CN1", 2023)', (err, rows, fields) => {
        if (err) throw err
        console.log("err: ", err)
        console.log("rows: ", rows)
        console.log("fields: ", fields)
        response.send(rows)
    })
})

module.exports = roomRouter