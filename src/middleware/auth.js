const jwt = require('jsonwebtoken')
const User = require('../models/KlitaTeams')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '') //get token
    const decoded = jwt.verify(token, process.env.jwt_secret) //get id by token
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) //find

    if (!user) {
      throw new Error()
    }
    req.token = token
    req.user = user
    next()
  } catch (e) {
    res.status(401).send('error:please autheticate')
  }
}

module.exports = auth
