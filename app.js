require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors")
const User = require("./model/user");
const Hours = require("./model/hours")
const auth = require("./middleware/auth");
const Timesheet = require("./model/timesheet");
const app = express();
const TOKEN_KEY = '4556hghgjjjfftdfgcjvjkhfgchgfvjh'
app.use(express.json({ limit: "50mb" }));
app.use(cors())

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "https://hr-management-4a24c.web.app");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/api/sign-up", async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send({msg:"User Already Exist. Please Login"});
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      first_name,
      last_name,
      password: encryptedPassword,
      hours:[],
      salary:"",
      dob:"",
      department:"",
      designation:"",
      type:""
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      // process.env.TOKEN_KEY,
      TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/user/edit", async (req, res) => {
  try {
    // Get user input
    const details = req.body.employee;

    let user = await User.findOne({ _id:details._id });

    if(user){
      await User.findOneAndUpdate({_id: details._id}, {
        first_name: details.first_name,
        last_name: details.last_name,
        dob: details.dob,
        salary:details.salary,
        department: details.department,
        designation: details.designation,
        type: details.type
      });
      user = await User.findOne({ _id:details._id });
      res.status(200).json({user});
      // return new user
    }   
    
  } catch (err) {
    console.log(err);
  }
});


app.post("/api/user/delete", async (req, res) => {
  try {
    // Get user input

    let user = await User.findOne({ _id:req.body._id });

    if(user){
      await User.deleteOne({_id: req.body._id});
      res.status(200).json({msg:"deleted"});
      // return new user
    }   
    
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    // Get user input

    let users = await User.find({});

    // return new user
    res.status(200).json({users});
  } catch (err) {
    console.log(err);
  }
});


app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send({msg:"All inputs are required"});
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        // process.env.TOKEN_KEY,
        TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;

      res.send({'access_token':token, 'user':user});
    }else if(user){
      res.status(400).send({msg:'Incorrect Credentials!'})
    }else{
      res.status(400).send({msg:'Email does not exist!'})
    }
  } catch (err) {
    console.log(err);
  }
});


app.get('/api/logout', async (req,res)=>{
  const user = {token:''};
  res.send(user)
})


app.post('/api/hours',auth, async(req, res) => {
  let curr_user = req.user
  let data = req.body
  let dt = new Date(data.date)
  let newdate = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();

  if(curr_user){
    let user = await User.findOne({'email' : curr_user.email})
    let existing = await Hours.findOne({date: newdate});

    if(existing){
      if(data.mark_in){
        await Hours.findOneAndUpdate({date: newdate}, {mark_in:data.mark_in});
      }else if(data.mark_out){
        await Hours.findOneAndUpdate({date: newdate}, {mark_out:data.mark_out});
      }
    }else{
      if(data.mark_in){
        await Hours.create({u_id:user._id, date: newdate, mark_in: data.mark_in})
      }else{
        await Hours.create({u_id:user._id, date: newdate, mark_out: data.mark_out})
      }
    }

    let hrs = await Hours.findOne({date: newdate});
    console.log(hrs)
    res.send({user:curr_user})
  }
  // let genre_books = 
})

app.get('/api/hours',auth, async(req, res) => {
  let curr_user = req.user


  if(curr_user){
    let user = await User.findOne({'email' : curr_user.email})
    let hours = await Hours.find({u_id: user._id})
    res.send({hours:hours})
  }
  // let genre_books = 
})


app.get('/api/utilization',auth, async(req, res) => {
  let curr_user = req.user
  if(curr_user){
    let users = await User.find({})
    for(let i=0;i<users.length;i++){
      let u = users[i]._doc
      let timesheet = await Timesheet.find({u_id: users[i]._id})
      u.timesheet = timesheet
    }
    res.send({users})
  }
})


app.get('/api/timesheet',auth, async(req, res) => {
  let curr_user = req.user


  if(curr_user){
    let user = await User.findOne({'email' : curr_user.email})
    let timesheet = await Timesheet.find({u_id: user._id})
    res.send({timesheet:timesheet})
  }
  // let genre_books = 
})

app.post('/api/timesheet',auth, async(req, res) => {
  let curr_user = req.user
  let data = req.body
  
  let dt = new Date(data.date)
  let newdate = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
  delete data.date

  let row = {
    date: newdate,
    type_work: data.typeWork,
    project: data.project,
    department: data.department,
    description: data.description,
    duration: data.duration
  }

  if(curr_user){
    let user = await User.findOne({'email' : curr_user.email})
    // let existing = await Hours.findOne({date: newdate});

    let ts = await Timesheet.create({u_id:user._id, ...row})

    // if(existing){
    //   if(data.mark_in){
    //     await Hours.findOneAndUpdate({date: newdate}, {mark_in:data.mark_in});
    //   }else if(data.mark_out){
    //     await Hours.findOneAndUpdate({date: newdate}, {mark_out:data.mark_out});
    //   }
    // }else{
    //   if(data.mark_in){
    //     await Hours.create({u_id:user._id, date: newdate, mark_in: data.mark_in})
    //   }else{
    //     await Hours.create({u_id:user._id, date: newdate, mark_out: data.mark_out})
    //   }
    // }

    res.send({timesheet:ts})
  }
  // let genre_books = 
})

app.get("/", (req, res) => {
  res.send("Hello 🙌 ");
});

app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;
