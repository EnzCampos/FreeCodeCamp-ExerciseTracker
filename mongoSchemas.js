let mongoose = require('mongoose')
let express = require("express")

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  } 
}, { versionKey: false })

let exerciseSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration : {
    type: Number,
    required: true
  },
  date: {
    type: String,
    default: (new Date()).toDateString()
  } 
}, { versionKey: false })

const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = {
  User,
  Exercise
}