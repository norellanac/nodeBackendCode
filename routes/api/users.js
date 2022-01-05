const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

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
          newUSer.save()
          .then(user => res.json(user))
          .catch(err => res.json(err))
        });
      });
    }
  });
});
module.exports = router;
