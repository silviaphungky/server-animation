const express = require('express')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
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
    const { json } = req.body
    Animation.create(req.body).then((animation) =>
      res
        .status(201)
        .json({ message: 'Successfully create animation', data: animation })
    )
  } catch (error) {
    res.status(500)
    console.log(error, 'Failed create animation')
  }
})

router.get('/animation/:id', async (req, res) => {
  try {
    const { id } = req.params
    const animation = await Animation.findById(id)
    res.status(200).json({ animation })
  } catch (error) {
    res.status(500)
  }
})

app.use('/.netlify/functions/api', router)

const handler = serverless(app)
module.exports.handler = async (event, context) => {
  const result = await handler(event, context)
  return result
}
