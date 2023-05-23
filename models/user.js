const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  id: { type: String, required: true, min: 3 },
  name: { type: String, required: true, min: 3 },
  email: { type: String, required: true, min: 8 },
  password: { type: String, required: true, min: 15 },
  bought_tickets: { type: Array, required: false },
  money_balance: {type: Number, required: true }
});

module.exports = mongoose.model("User", userSchema);