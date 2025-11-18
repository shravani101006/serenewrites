const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: String,
  userId: String
});

module.exports = mongoose.model("Post", PostSchema);
