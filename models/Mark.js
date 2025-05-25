const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  mark: { type: String, required: true },
  markType: {
    type: String,
    enum: ["exam", "ratrappage", "td"],
    required: true,
  },
});

module.exports = mongoose.model("Mark", markSchema);
