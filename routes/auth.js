const express = require("express");
const User = require("../models/User");
var fetchuser = require('../middleware/fetchUser');
const app = express();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = "Siddhartha";

app.post(
  "/createuser",
  [
    [
      body("name", "Enter a valid name").isLength({ min: 3 }),
      body("email", "Enter a valid email").isEmail(),
      body("password", "Enter a valid password").isLength({ min: 5 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "user already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);
      res.json({ AuthTOken: authToken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error has been occoured!");
    }
  }
);

app.post(
  "/login",
  [
    [
      body("email", "Enter a valid email").isEmail(),
      body("password", "Enter a valid password").exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ error: "user not exists!" });
      }
      const bcryptCompare = await bcrypt.compare(
      req.body.password,
      user.password
      );
      if (!bcryptCompare) {
        return res.status(400).json({ Error: "Invalid Password" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);
      res.json({ AuthTOken: authToken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error has been occoured!");
    }
  }
);

app.post('/getuser',fetchuser, async (req,res) => {
  try{
    UserId = req.user.id;
    const user = await User.findById(UserId).select("-password");
    res.json({User:user});

  }catch(error){
      res.status(500).send("Internal server error!");
  }

})



module.exports = app;
