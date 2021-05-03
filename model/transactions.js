const mongoose = require("mongoose");
const schema2 = new mongoose.Schema({
  from: String,
  amount: Number,
  to: String,
  card: String,
});
module.exports = mongoose.model("transactions", schema2);
