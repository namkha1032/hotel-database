const pg = require('pg')
const client = new pg.Client({
    host: 'localhost',
    port: 5432,
    database: 'hotel',
    user: 'smanager',
    password: 'postgres',
})
client.connect()
module.exports = client

