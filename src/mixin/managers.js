const tashQuestionnaire = require('../models/tashMainData')
const KlitaTeam = require('../models/KlitaTeams')

const isManagerInThisTeam = (team, user) => {
  team.managers.array.forEach(manager => {
    //check if this person is manager
    if (manager.personalNumber === user.personalNumber) {
      return true
    }
  })
  return false
}

const closeTeam = async myTeam => {
  const team = await KlitaTeam.findOne({ teamID: myTeam.teamID })
  if (!team) {
    return 'this team does not exist'
  }
  team.isEnd = true
  try {
    await team.save()
  } catch {
    return 'cant delete this team'
  }
}

module.exports = {
  isManagerInThisTeam,
  closeTeam
}
