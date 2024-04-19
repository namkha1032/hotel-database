// const { log } = require('console')
// const http = require('http')
// import http from 'http'

// express
const express = require('express')
const app = express()
// Include routers
// const notesRouter = require('./controllers/notes')
// const usersRouter = require('./controllers/users')
// const loginRouter = require('./controllers/login')
// const roomRouter = require('./controllers/room')
const hotelRouter = require('./controllers/hotel')
// CORS
const cors = require('cors')
//middleware
const middleware = require('./utils/middleware')



///////////////////////////////////////////////////////////////////////////////////////////

app.use(cors())
app.use(express.json())
// app.use('/api/notes', notesRouter)
// app.use('/api/users', usersRouter)
// app.use('/api/login', loginRouter)
// app.use('/api/room', roomRouter)
app.use('/api/hotel', hotelRouter)
//////////////////////////////////////////////////////////////////////////

app.use(middleware.unknownEndpoint)



module.exports = app