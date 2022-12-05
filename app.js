require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors")
const User = require("./model/user");
const auth = require("./middleware/auth");
const app = express();
const TOKEN_KEY = '4556hghgjjjfftdfgcjvjkhfgchgfvjh'
app.use(express.json({ limit: "50mb" }));
app.use(cors())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://hr-management-4a24c.web.app");
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
