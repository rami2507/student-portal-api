const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: [true, "A module must have a name"] },
  code: { type: String, required: [true, "A module must have a code"] },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
