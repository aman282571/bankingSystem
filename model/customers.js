const mongoose = require("mongoose");
const schema1 = new mongoose.Schema({
  name: String,
  balance: Number,
  email: String,
});
module.exports = mongoose.model("customers", schema1);
