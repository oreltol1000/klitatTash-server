const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    // const token = req.header('Authorization').replace('Bearer ', '') //get token
    // const decoded = jwt.verify(token, process.env.jwt_secret) //get id by token
    // const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) //find

    const user = await User.findOne({
      personalNumber: '314674766' //will get it from click
    })

    if (!user) {
      throw new Error()
    }
    // req.token = token
    req.user = user
    next()
  } catch (e) {
    res.status(401).send('error:please autheticate')
  }
}

module.exports = auth
