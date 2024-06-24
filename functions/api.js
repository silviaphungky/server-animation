const express = require('express')
require('dotenv').config()

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false, limit: '1mb' }))
const serverless = require('serverless-http')

// import
require('../db/connection')
const Animation = require('../models/Animation')

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  next()
})
const router = express.Router()

// routes
router.get('/', (req, res) => {
  res.json({
    data: 'success',
  })
})

router.post('/animation', (req, res) => {
  try {
    Animation.create(req.body).then((animation) =>
      res
        .status(201)
        .json({ message: 'Successfully create animation', data: animation })
    )
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/animation/:id', async (req, res) => {
  try {
    const { id } = req.params
    const animation = await Animation.findById(id)
    res.status(200).json({ animation })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/animation/:id', async (req, res) => {
  try {
    const { id } = req.params
    Animation.findByIdAndUpdate({ _id: id }, req.body, { new: true }).then(
      (animation) =>
        res.status(200).json({
          message: `Successfully update animation ${id}`,
          animation,
        })
    )
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.use('/.netlify/functions/api', router)

const handler = serverless(app)
module.exports.handler = async (event, context) => {
  const result = await handler(event, context)
  return result
}
