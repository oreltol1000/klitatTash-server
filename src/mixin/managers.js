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

const closeTeamAndQuestionnaire = myTeam => {
  const team = await KlitaTeam.findOne({ teamID: myTeam.teamID })
  if(!team){
    return 'this team does not exist'
  }
  team.isEnd = true
  team.save()
  const allQuestionnaire = await tashQuestionnaire.find({teamID: myTeam.teamID})
  allQuestionnaire.forEach(questionnaire => {
questionnaire.isEnd = true
questionnaire.save()
  })
}

module.exports = {
  isManagerInThisTeam,
  closeTeamAndQuestionnaire
}
