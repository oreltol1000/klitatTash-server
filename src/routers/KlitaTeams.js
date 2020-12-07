const express = require('express')
const KlitaTeam = require('../models/KlitaTeams')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const multer = require('multer')
const {
  isManagerInThisTeam,
  closeTeamAndQuestionnaire
} = require('../mixin/managers')
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
router.get('/getTeamName/:teamNo', async (req, res) => {
  try {
    const team = await KlitaTeam.findOne({ teamID: req.params.teamNo })
    res.status(200).send(team.unitName)
  } catch (error) {
    res.status(404).send({ error: error.message })
  }
})

router.post('/closeQuestionnaire/:teamNo', auth, async (req, res) => {
  //createFile
  //send data to red
  //lock data
  const user = req.user
  const team = await KlitaTeam.findOne({
    teamID: req.params.teamNo
  })
  if (!team) {
    res.status(404).send({ error: 'this team does not exist' })
  }
  if (isManagerInThisTeam(team, user)) {
    closeTeamAndQuestionnaire(team)
  } else {
    res.status(404).send({ error: 'you are not manager of this team' })
  }
})
module.exports = router
