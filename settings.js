const mongoose = require("mongoose");

const settingssSchema = mongoose.Schema({
    serverID: String,
    enabled: Boolean,
    logs: Object,
    exceptions: Object,
})

module.exports = mongoose.model("defender", settingssSchema)