const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model("Certificate", CertificateSchema);