const mongoose = require("mongoose");

const DemandSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
});

const Demand = mongoose.model("Demand", DemandSchema);

module.exports = Demand;
