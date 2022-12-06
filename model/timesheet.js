const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema({
  date: { type: String, default: null },
  project: { type: String, default: null },
  type_work: { type: String, default: null },
  department: { type: String, default: null },
  description: { type: String, default: null },
  duration: { type: String, default: null },
  u_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model("timesheet", timesheetSchema);
