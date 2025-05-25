const mongoose = require("mongoose");

const emploieSchema = new mongoose.Schema({
  groupe: {
    type: String,
    required: [true, "A emploie must have a groupe"],
  },
  image: {
    type: String,
    required: [true, "A emploie must have an image"],
  },
});

const Emploie = mongoose.model("Emploie", emploieSchema);

module.exports = Emploie;
