const express = require("express");
const Message = require("../../models/Message");
const router = express.Router();
const passport = require("passport");

//@route    GET api/profile/test
//@des  Tests profile route
//@access   Public
router.get("/test", (req, res) => res.json({ msg: "Routes Works" }));

//@route    POST api/profile/test
//@des  Store message route
//@access   Public
router.post(
  "/messaqe",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newMessage = new Message({
      msg: req.body.msg,
      tags: req.body.tags,
    });
    newMessage
      .save()
      .then((msg) => res.status(200).json(msg))
      .catch((err) => res.status(500).json(err));
  }
);

//@route    GET api/profile/test
//@des  get all messages auth route
//@access   Private
router.get(
  "/messaqe",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Message.find()
      .then((msg) => res.status(200).json(msg))
      .catch((err) => res.status(500).json(err));
    //res.json(req.user);
  }
);

//@route    GET api/profile/test
//@des  get a single message by id auth route
//@access   Private
router.get(
  "/message/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Message.findOne({ id: req.params.id })
      .then((msg) => res.status(200).json(msg))
      .catch((err) => res.status(500).json(err));
  }
);

//@route    GET api/profile/test
//@des  get all tags messages auth route
//@access   Private
router.get(
  "/messages/:tags",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //res.status(500).json(req.params)
    Message.find({ tags: req.params.tags })
      .then((msg) => res.status(200).json(msg))
      .catch((err) => res.status(500).json(err));
  }
);

module.exports = router;
