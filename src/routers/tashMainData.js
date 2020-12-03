const express = require('express')
const Task = require('../models/tashMainData')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
  //const task = new Task(req.body)
  const task = new Task({
    ...req.body, //copy all rows from req task
    owner: req.user._id
  })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

//GET /tasks?completd=true
// GET /tasks?limit=106(how much to get&skip=0(from wich index i start)
//GET /tasks?sortBy=createdAt_asc or createdAt_dec
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }
  // let sortOption = 1
  if (req.query.sortBy) {
    let sortOption = req.query.sortBy === 'createdAt_dec' ? -1 : 1
  }

  try {
    // option 2
    await req.user
      .populate({
        path: 'userTasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: {
            createdAt: sortOption //decending
          }
        }
      })
      .execPopulate()
    res.send(req.user.userTasks)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!task) {
      return res.status(404).send()
    }

    // update every field
    updates.forEach(update => {
      task[update] = req.body[update]
    })

    // save changes-we do it here because we dont want the method "before saving" in middleware
    await task.save()

    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })
    console.log(task)

    if (!task) {
      res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
