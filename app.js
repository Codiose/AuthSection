//jshint esversion:6

require('dotenv').config();
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const port = 3000;

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));  //tell the app to use it
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: {
    type: String,
    required: [true, "We need your email"]
  },
  password: {
    type: String,
    required: [true, "We need a password"]
  }
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);



app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save((err) => {
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });

});

app.post("/login", function(req, res){

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, (err, foundUser) => {

    if(err){
      console.log(err);
    }else{
      console.log("No error");
      if(foundUser){
          console.log("user found");
        if(foundUser.password === password){
          console.log("Rendering...");
          res.render("secrets");
        }

      }
    }

  });
});


app.listen(port, () => {
  console.log("Server is running on port " + port);
});
