const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
    userID: String,
    level: Number,
    xp: Number
})

module.exports = mongoose.model("xp", xpSchema)