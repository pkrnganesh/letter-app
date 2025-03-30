const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  picture: String,
  googleAccessToken: String,
  googleRefreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
