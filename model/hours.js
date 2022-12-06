const mongoose = require("mongoose");

const hoursSchema = new mongoose.Schema({
  date: { type: String, default: null },
  mark_in: { type: String, default: null },
  mark_out: { type: String, default: null },
  u_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model("hours", hoursSchema);
