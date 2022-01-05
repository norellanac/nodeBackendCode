const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./../../config/keys");

//@route    GET api/profile/test
//@des  Tests profile route
//@access   Public
router.get("/test", (req, res) => res.json({ msg: "Routes Works" }));

//@route    GET api/profile/test
//@des  Tests profile route
//@access   Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email Already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUSer = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUSer.password, salt, (err, hash) => {
          if (err) throw err;
          newUSer.password = hash;
          newUSer
            .save()
            .then((user) => res.json(user))
            .catch((err) => res.json(err));
        });
      });
    }
  });
});

//@route    GET api/profile/test
//@des  Login User - Returning the JWT token
//@access   Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "user not found" });
    }

    //check password
    //compare plain text with hash bcrypt
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //user match
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        }; //create jwt payload
        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              succes: true,
              token: "Barer " + token,
            });
          }
        );
        //res.json({ msg: "Success" });
      } else {
        return res.status(400).json({ password: "password incorrect" });
      }
    });
  });
});

module.exports = router;
