const mongoose = require('mongoose')

const taskSchema = mongoose.Schema(
  {
    personalNumber: {
      type: String,
      required: true,
      trim: true
    },
    teamNumber: {
      type: String,
      default: false,
      ref: 'KlitaTash' //to get team by tash
    },
    questionsAndAnswers: {
      type: Array,
      required: true,
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
const Tash = mongoose.model('Tash', taskSchema)

module.exports = Tash
