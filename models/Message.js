const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  msg: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("messsage", MessageSchema);
