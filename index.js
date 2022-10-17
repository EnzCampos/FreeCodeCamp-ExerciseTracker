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

app.post('/api/users', (req,res) => {
  let username = req.body.username
  if (!username){
    return res.json({error: 'Username is required'})
  }
  
  User.findOne({ username: username}, (error, foundUser) => {
   if (!error && !foundUser) {
     let newUser = new User({
       username: username
     })
     
     newUser.save((error,data)=>{
       if (!error) {
         return res.json({
           _id: data['id'],
           username: username
         })
       }
     })
   } else return res.json({ error: "Username already exists"})
  })
})

app.get('/api/users', (req,res)=>{
  User.find({}, (error,foundUsers) => {
    if (!error) {
      return res.json(foundUsers)
    }
  })
})

app.post("/api/users/:_id/exercises", (req,res) => {
  let { description, duration } = req.body
  let date = req.body.date ? new Date(req.body.date) : new Date()
  let userId = req.params._id
  
  if (!userId || !description || isNaN(duration) || date == "Invalid Date") {
    return res.json({error: "Invalid Parameters"})
  }

  User.findById( userId, (error,data) => {
    if (!error) {
      let newExercise = new Exercise({
        userId: userId,
        description: description,
        duration: duration,
        date: date
      });

      newExercise.save((err,savedData) => {
        if (!err) {
          return res.json({
            _id: data['_id'],
            username: data['username'],
            description: savedData['description'],
            duration: savedData['duration'],
            date: date.toDateString()
          });
        }
      });
    }
    else return res.json({error: "User not found"})
  })
})


app.get('/api/users/:_id/logs', async (req,res) => {

  let { from, to , limit} = req.query;
  let searchParams = { userId: req.params._id };
  
  if (from || to) {
    searchParams['date'] = {}
  }
  
  if (from) {
    searchParams.date.$gte = new Date(from);
  }

  if (to) {
    searchParams.date.$lte = new Date(to);
  }

  
  try {
    
    let user = await User.findById(req.params['_id']);
    let log = await Exercise.find(searchParams, 'description duration date -_id').limit(limit ? limit : 0);

    let result = {
      username: user.username,
      _id: req.params._id,
      count: log.length,
      log: log.map((exercise) => {
        return {
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date.toDateString()
        }
      })
    }
    
    return res.json(result);
    
  } catch (error) {
    console.log(error)
  }
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
