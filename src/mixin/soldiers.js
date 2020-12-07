const Tash = require('../models/tashMainData')

const isSoldierInThisTeam = async (team, user) => {
  const myData = await Tash.findOne({
    personalNumber: user.personalNumber,
    teamID: team.teamID
  })
  if (myData) {
    return true
  }
  return false
}

module.exports = {
  isSoldierInThisTeam
}
