let mongoose = require('mongoose')
let express = require("express")


let exerciseSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true
  },
  description: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: Number, 
    min: 1,
    required: true
  },
  date: { 
    type: Date, 
    default: (new Date())
  }
}, { versionKey: false })

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  }
}, { versionKey: false })

const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = {
  User,
  Exercise
}
