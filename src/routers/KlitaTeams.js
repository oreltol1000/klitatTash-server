const express = require('express')
const User = require('../models/KlitaTeams')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const router = new express.Router()

// create
router.post('/users', async (req, res) => {
  const user = new User(req.body)
  console.log(user)

  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthTokenorel() //token
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})
// login
router.post('/users/login', async (req, res) => {
  try {
    //token
    const user = await User.findByCredentialsorel(
      req.body.email,
      req.body.password
    )
    const token = await user.generateAuthTokenorel() //token
    res.send({ user, token })
  } catch (e) {
    res.status(400).send()
  }
})
// logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    //delete current token
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})
// logout all
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    //delete current token
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

//for files upload
const upload = multer({
  // dest: 'avatars',
  limits: {
    //limit size we can archive
    //size by bytes
    fieldSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('please upload an image'))
    }
    cb(undefined, true)
    // cb(new Error('file must be a PDF'))
    // cb(undefined, true)
    // cb(undefined, false)
  }
})

//avatar is the key from the url
//add avatar
router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    //for success middleware
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer()

    req.user.avatar = buffer //save image to db

    await req.user.save()
    res.send()
  },
  (error, req, res, next) => {
    //for error middleware
    res.status(400).send({ error: error.message })
  }
)

//delete avatar
router.delete(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  //for success middleware
  async (req, res) => {
    req.user.avatar = undefined //save image to db
    await req.user.save()
    res.send()
  },
  (error, req, res, next) => {
    //for error middleware
    res.status(400).send({ error: error.message })
  }
)

// get user
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})
// update
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  )
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    // update every field
    updates.forEach(update => {
      req.user[update] = req.body[update]
    })
    // save changes-we do it here because we dont want the method "before saving" in middleware
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})
// delete
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()

    sendCancelEmail(req.user.email, req.user.name)

    res.send(req.user)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/jpg') //type of photo
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send()
  }
})

module.exports = router
