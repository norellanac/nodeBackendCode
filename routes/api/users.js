const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./../../config/keys");
const passport = require("passport");

//@route    GET api/profile/test
//@des  Tests profile route
//@access   Public
router.get("/test", (req, res) => res.json({ msg: "Routes Works" }));

//@route    POST api/profile/test
//@des  Tests profile route
//@access   Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(403).json({ message: "Email Already exists" });
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
            .then((user) => res.status(200).json(user))
            .catch((err) => res.status(500).json(err));
        });
      });
    }
  });
});

//@route    GET api/profile/test
//@des  Login User - Returning the JWT token
//@access   Public
router.put("/credential", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "user not found" });
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
          { expiresIn: 172800 },
          (err, token) => {
            res.status(200).json({
              succes: true,
              token: "Bearer " + token,
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

//@route    GET api/profile/test
//@des  Tests user auth route
//@access   Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
