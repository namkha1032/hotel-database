const db = require('../connect')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response) => {
    const sql = `SELECT users.id, users.username, roles.rolename FROM users INNER JOIN roles ON users.roleid = roles.id;`
    db.all(sql, function (err, rows) {
        response.send(rows)
    })
})


usersRouter.post('/', async (request, response) => {
    const { username, password, roleid } = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = {
        username,
        passwordHash,
        roleid
    }
    // const sql1 = `SELECT * FROM users WHERE username = '${username}';`
    // db.all(sql1, function(err, rows){
    //     if (rows.length > 0){
    //         response.status(401).json({
    //             error: "username has existed"
    //         })
    //     }
    // })
    const sql = `INSERT INTO users(username, password, roleid) 
                    VALUES ('${user.username}', '${user.passwordHash}', ${user.roleid}) RETURNING *;`
    db.all(sql, function (err, rows) {
        if(err){
            response.status(404).json("")
        }
        else{
            response.json(rows[0])
        }
        console.log(err)
        console.log(rows)
    })
})

module.exports = usersRouter