const jwt = require('jsonwebtoken')
const User = require('../models/User')
const KlitaTeam = require('../models/KlitaTeams')

const auth = async (req, res, next) => {
  try {
    // const token = req.header('Authorization').replace('Bearer ', '') //get token
    // const decoded = jwt.verify(token, process.env.jwt_secret) //get id by token
    // const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) //find

    const user = await User.findOne({
      personalNumber: '314674766' //will get it from click
    })
    if (!user) {
      throw new Error('not authorized')
    }

    const team = await KlitaTeam.findOne({
      teamID: req.params.teamID,
      isEnd: false
    })
    if (!team) {
      throw new Error('team lock or not exist')
    }

    // req.token = token
    req.user = user
    next()
  } catch (e) {
    res.status(401).send('error:please autheticate')
  }
}

module.exports = auth
