const mongoose = require('mongoose')

const animationSchema = mongoose.Schema({
  json: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gifUrl: {
    type: String,
    required: false,
  },
})

const Animation = mongoose.model('Animation', animationSchema)

module.exports = Animation
