const isManagerInThisTeam = (team, user) => {
  team.managers.array.forEach(manager => {
    //check if this person is manager
    if (manager.personalNumber === user.personalNumber) {
      return true
    }
  })
  return false
}

module.exports = {
  isManagerInThisTeam
}
