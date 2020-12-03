const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/KlitaTeams')
const taskRouter = require('./routers/tashMainData')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app
