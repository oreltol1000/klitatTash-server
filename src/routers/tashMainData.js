const express = require('express')
const Tash = require('../models/tashMainData')
const KlitaTeam = require('../models/KlitaTeams')
const auth = require('../middleware/auth')
const router = new express.Router()
const { isManagerInThisTeam } = require('../mixin/managers')
const { isSoldierInThisTeam } = require('../mixin/soldiers')

// soldier save his questionnaire
router.post('/saveSoldierQuestionnaire/:teamNo', auth, async (req, res) => {
  const user = req.user
  const team = await KlitaTeam.findOne({ teamID: req.params.teamNo })
  const myData = await Tash.find({
    personalNumber: user.personalNumber,
    teamID: team.teamID
  })
  if (myData) {
    //if this soldier questionnaire already exist
    if (isManagerInThisTeam(team, user) || isSoldierInThisTeam(team, user)) {
      try {
        myData = new Tash({
          ...req.body //copy all rows from req tash
        })
        await tash.save()
        res.status(201).send(tash.recordKey) //success -> send tash id
      } catch (e) {
        res.status(400).send(e)
      }
    }
  } else {
    //if this soldier questionnaire does not exist
    try {
      const tash = new Tash({
        ...req.body //copy all rows from req tash
      })
      await tash.save()
      res.status(201).send(tash.recordKey) //success -> send tash id
    } catch (e) {
      res.status(400).send(e)
    }
  }
})

// for soldier
router.get('/getMyData/:teamNo', auth, async (req, res) => {
  try {
    const user = req.user
    //get personal tash data by id*team id
    const myData = await Tash.findOne({
      personalNumber: user.personalNumber,
      teamNumber: req.params.teamNo
    })
    //there isn't tash data for this soldier
    if (!myData) {
      return res.status(404).send({ error: 'no data for this soldier' })
    }
    if (myData.isMashakitAprove === true) {
      return res.status(404).send({ error: 'lock by mashakit tash' })
    } else if (myData.isKzinaAprove === true) {
      return res.status(404).send({ error: 'lock by kzinat tash' })
    }
    res.send(myData)
  } catch (e) {
    res.status(500).send()
  }
})

// Get all data in this team - for manager(mashakit/kzina)
router.get('/getAllMainData/:teamNo', auth, async (req, res) => {
  try {
    const user = req.user
    const team = await KlitaTeam.findOne({ teamID: req.params.teamNo })
    if (!team) {
      res.status(404).send({ error: 'this team does not exist' })
    }
    const managers = team.managers

    if (isManagerInThisTeam(team, user)) {
      const allData = await Tash.find({ teamNumber: team.teamID })
      res.status(200).send(allData)
    }

    res.status(404).send({ error: 'you are not manager of this team' })
  } catch (error) {
    res.status(404).send({ error: error.message })
  }
})

// router.post('/tasks', auth, async (req, res) => {
//   //const task = new Task(req.body)
//   const task = new Task({
//     ...req.body, //copy all rows from req task
//     owner: req.user._id
//   })
//   try {
//     await task.save()
//     res.status(201).send(task)
//   } catch (e) {
//     res.status(400).send(e)
//   }
// })

// //GET /tasks?completd=true
// // GET /tasks?limit=106(how much to get&skip=0(from wich index i start)
// //GET /tasks?sortBy=createdAt_asc or createdAt_dec
// router.get('/tasks', auth, async (req, res) => {
//   const match = {}
//   if (req.query.completed) {
//     match.completed = req.query.completed === 'true'
//   }
//   // let sortOption = 1
//   if (req.query.sortBy) {
//     let sortOption = req.query.sortBy === 'createdAt_dec' ? -1 : 1
//   }

//   try {
//     // option 2
//     await req.user
//       .populate({
//         path: 'userTasks',
//         match,
//         options: {
//           limit: parseInt(req.query.limit),
//           skip: parseInt(req.query.skip),
//           sort: {
//             createdAt: sortOption //decending
//           }
//         }
//       })
//       .execPopulate()
//     res.send(req.user.userTasks)
//   } catch (e) {
//     res.status(500).send()
//   }
// })

// router.get('/tasks/:id', auth, async (req, res) => {
//   try {
//     const task = await Task.findOne({
//       _id: req.params.id,
//       owner: req.user._id
//     })

//     if (!task) {
//       return res.status(404).send()
//     }

//     res.send(task)
//   } catch (e) {
//     res.status(500).send()
//   }
// })

// router.patch('/tasks/:id', auth, async (req, res) => {
//   const updates = Object.keys(req.body)
//   const allowedUpdates = ['description', 'completed']
//   const isValidOperation = updates.every(update =>
//     allowedUpdates.includes(update)
//   )

//   if (!isValidOperation) {
//     return res.status(400).send({ error: 'Invalid updates!' })
//   }

//   try {
//     const task = await Task.findOne({
//       _id: req.params.id,
//       owner: req.user._id
//     })

//     if (!task) {
//       return res.status(404).send()
//     }

//     // update every field
//     updates.forEach(update => {
//       task[update] = req.body[update]
//     })

//     // save changes-we do it here because we dont want the method "before saving" in middleware
//     await task.save()

//     res.send(task)
//   } catch (e) {
//     res.status(400).send(e)
//   }
// })

// router.delete('/tasks/:id', auth, async (req, res) => {
//   try {
//     const task = await Task.findOneAndDelete({
//       _id: req.params.id,
//       owner: req.user._id
//     })
//     console.log(task)

//     if (!task) {
//       res.status(404).send()
//     }

//     res.send(task)
//   } catch (e) {
//     res.status(500).send()
//   }
// })

module.exports = router
