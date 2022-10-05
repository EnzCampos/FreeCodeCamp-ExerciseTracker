const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { User, Exercise } = require('./mongoSchemas')
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req,res)=>{
  try {
    await User.create({ username:req.body.username })
    const id = await User.findOne({ username:req.body.username }).select('-__v')
    return res.json(id)
  } catch (error) {
    console.log(error);
  }
})


app.get('/api/users', async (req,res) => {
  try {
    const userList = await User.find().select('-__v');
    return res.json(userList);
  } catch (error) {
    console.log(error);
  }
})

app.post('/api/users/:id/exercises', async (req,res) => {
  const userFound = await User.findOne({
    "_id":req.body[':_id']});
  
  if (userFound) {
    const userName = userFound.username;
    const exerciseDate = req.body.date ? date : undefined;
    try {
      await Exercise.create({
        username: userName,
        description: req.body.description,
        duration: Number(req.body.duration),
        date: exerciseDate
      })
      return res.json( await Exercise.findOne({duration: Number(req.body.duration) }))
    } catch (error) {
      return console.log(error)
    }
  }
  return res.json({error: "Invalid User"})
})

const start = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    })
    console.log("Connected to the DataBase")
    app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port: 3000 ')
  })
  } catch (error) {
    console.log(error)
  }
}

start()
