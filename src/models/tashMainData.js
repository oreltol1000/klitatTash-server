const mongoose = require('mongoose')
const User = require('./User')

const tashMainDataSchema = mongoose.Schema(
  {
    personalNumber: {
      type: String,
      required: true,
      trim: true
    },
    recordKey: {
      type: String,
      required: true,
      trim: true
    },
    teamID: {
      type: String,
      default: false,
      ref: 'KlitaTash' //to get team by tash
    },
    questionsAndAnswers: {
      type: Array,
      required: true
    },
    isMashakitAprove: {
      type: Boolean,
      default: false
    },
    isKzinaAprove: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

Tash.pre('save', async function(next) {
  const tashMainDataSchema = this //validate this is write and wait to send
  tashMainDataSchema.recordKey = personalNumber + Math.floor(Date.now() / 1000) //personal number+timestamp in seconds
  const user = await User.findOne({
    personalNumber: tashMainDataSchema.personalNumber
  })

  //if the user does not exist
  if (!user) {
    const user = new User({
      personalNumber: manager.personalNumber,
      position: manager.position,
      name: manager.name
    }).save()
  }

  next()
})

const Tash = mongoose.model('Tash', tashMainDataSchema)

module.exports = Tash
