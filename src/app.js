const express = require('express')
require('./db/mongoose')
const klitaTeamRouter = require('./routers/KlitaTeams')
const tashRouter = require('./routers/tashMainData')

const app = express()

app.use(express.json())
app.use(klitaTeamRouter)
app.use(tashRouter)

module.exports = app
