const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "A user must have a name"] },
  matricule_id: {
    type: String,
    unique: [true, "matricule_id already exists"],
    required: [true, "A user must have a matricule_id"],
  },
  email: {
    type: String,
    unique: [true, "This email already exists"],
    required: [true, "A user must have an email"],
  },
  role: { type: String, enum: ["student", "professor", "agent"] },
  password: { type: String, required: [true, "A user must have a password"] },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
