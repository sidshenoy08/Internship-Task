const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/registerDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is mandatory"]
  },
  email: {
    type: String,
    required: [true, "Email is mandatory"]
  },
  phone: {
    type: Number,
    required: [true, "Phone Number is mandatory"]
  },
  degree: {
    type: String,
    required: [true, "Degree is mandatory"]
  },
  skills: {
    type: String,
    required: [true, "Skills are mandatory"]
  },
  exp: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/form", function(req, res) {
  res.render("form");
});

app.get("/mail", function(req, res) {
  res.render("mail");
});

app.post("/form", function(req, res) {
  let errors = []
  if (req.body.name === "") {
    errors.push("Name field was empty");
  }
  if (req.body.email === "") {
    errors.push("Email field was empty");
  }
  if (req.body.phone === "") {
    errors.push("Phone number field was empty");
  } else {
    let isnum = /^\d+$/.test(req.body.phone);
      if(!isnum || req.body.phone.length != 10){
        errors.push("Phone number was not valid. Only 10 digits allowed");
      }
  }
  if (req.body.degree === "") {
    errors.push("Degree field was empty");
  }
  if (req.body.skills === "") {
    errors.push("Skills field was empty");
  }
  if (errors.length > 0) {
    console.log(errors);
    res.render("failure", {errors: errors});
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      degree: req.body.degree,
      skills: req.body.skills,
      exp: req.body.exp
    });
    newUser.save(function(err) {
      if (!err) {
        console.log("User has been added");
        res.render("success");
      } else {
        console.log(err);
      }
    });
  }
});

app.listen("3000", function(req, res) {
  console.log("Server is now listening");
});
