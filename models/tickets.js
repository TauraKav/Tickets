const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  id: { type: String, required: true, min: 3 },
  title: { type: String, required: true, min: 3 },
  ticket_price: { type: Number, required: true},
  from_location: { type: String, required: true, min: 3 },
  to_location: { type: String, required: true, min: 3 },
  to_location_photo_url: { type: String, required: true, min: 3 }
});

module.exports = mongoose.model("ticket", ticketSchema);