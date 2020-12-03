const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tashMainData')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true, //will be a uniwue key
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid')
        }
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain "password"')
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be a postive number')
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
)
// instance method - for specific user
userSchema.methods.generateAuthTokenorel = async function() {
  // not must-just for us
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.jwt_secret, {
    expiresIn: '1 days'
  })
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

// when we doing a request we will not get this elements in body response
userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

// static method
userSchema.statics.findByCredentialsorel = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('unable find user')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Unable to login')
  }
  return user
}

//middleware functions
userSchema.pre('save', async function(next) {
  const user = this //validate this is write and wait to send
  // console.log('before saving')
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

// Delete user task when user remove
userSchema.pre('remove', async function(next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

// create foreign key task->user , for get tasks for user
userSchema.virtual('userTasks', {
  ref: 'Task', //ref to task
  localField: '_id', //task has user._id
  foreignField: 'owner' //task has field 'owner' that has user._id
})
const User = mongoose.model('User', userSchema)

module.exports = User
