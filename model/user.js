const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  salary: { type: String, default: null },
  dob: { type: String, default: null },
  department: { type: String, default: null },
  designation: { type: String, default: null },
  type: { type: String, default: null },
  token: { type: String, default: null },
  hours: { type: Array, default: null  },
  role: { type: String, default: 'user' }
});

module.exports = mongoose.model("user", userSchema);
