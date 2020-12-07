const express = require('express')
const KlitaTeam = require('../models/KlitaTeams')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router()

// Create a team name
router.post('/createNewTeam', async (req, res) => {
  const team = new KlitaTeam(req.body)
  console.log(team)

  try {
    await team.save()
    res.status(201).send({ team })
  } catch (e) {
    res.status(400).send(e)
  }
})

// Get team name
router.get('/getTeamName/:id', async (req, res) => {
  try {
    const team = await KlitaTeam.findByTeamID(req.params.id)
    res.status(200).send(team.unitName)
  } catch (error) {
    res.status(404).send({ error: error.message })
  }
})

module.exports = router
