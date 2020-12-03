const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tash = require('./tashMainData')

const userSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true
  }
)

// when we doing a request we will not get this elements in body response
userSchema.methods.toJSON = function() {
  const team = this

  return team.toObject()
}

// static method
userSchema.statics.findByTeamID = async (id) => {
  const teamID = await KlitaTeam.findOne({ teamID: id })
  if (!teamID) {
    throw new Error('Unable find team')
  }
  return teamID
}

// create foreign key KlitaTeam->Tash, to get tash data for klitaTeam
userSchema.virtual('teamTash', {
  ref: 'Tash', //ref to tash
  localField: 'teamNumber', // team has team.teamNumber
  foreignField: 'teamNumber' // tash has field 'teamNumber' that has klitaTeam.teamNumber
})
const KlitaTeam = mongoose.model('KlitaTeam', userSchema)

module.exports = KlitaTeam
