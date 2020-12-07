const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tash = require('./tashMainData')
const User = require('./User')

const KlitaTeam = new mongoose.Schema(
  {
    teamID: {
      type: String,
      required: true,
      trim: true
    },
    unitName: {
      type: String,
      required: true,
      trim: true
    },
    unitNumber: {
      type: String,
      required: true,
      trim: true
    },
    klitaDate: {
      type: Date,
      required: true,
      trim: false
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    managers: {
      type: Array,
      required: false,
      trim: true
    },
    isEnd:{
      type: Boolean,
      required: false,
      default:false,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

KlitaTeam.pre('save', async function(next) {
  const klitaTeam = this //validate this is write and wait to send
  const users = []
  klitaTeam.managers.forEach(manager => {

  const user = await User.findOne({
    personalNumber: manager.personalNumber
  })
//check if this user exist
if(user){
    user.personalNumber = manager.personalNumber,
    user.populate = manager.populate ,
    user.name = manager.name
    try{
    user.save()
     }catch{
       throw new Error('cant save this user: ' + user.personalNumber )
     }    
   }else if(!user){
  // create new user
    users.push(
      new User({
        personalNumber: manager.personalNumber,
        position: manager.position,
        name: manager.name
      }).save()
    )}
  })
  next()
})

// when we doing a request we will not get this elements in body response
userSchema.methods.toJSON = function() {
  const team = this

  return team.toObject()
}

// static method
userSchema.statics.findByTeamID = async id => {
  const teamID = await KlitaTeam.findOne({ teamID: id })
  if (!teamID) {
    throw new Error('Unable find team')
  }
  return teamID
}

// create foreign key KlitaTeam->Tash, to get tash data for klitaTeam
userSchema.virtual('teamTash', {
  ref: 'Tash', //ref to tash
  localField: 'teamID', // team has team.teamNumber
  foreignField: 'teamID' // tash has field 'teamNumber' that has klitaTeam.teamNumber
})
const KlitaTeam = mongoose.model('KlitaTeam', KlitaTeam)

module.exports = KlitaTeam
