const mongoose = require("mongoose");

const settingssSchema = mongoose.Schema({
    status: Boolean,
    cds: Number,
    prefix: String,
    roles: Array,
    prisoners:  Array,
    autorole: String
})

module.exports = mongoose.model("setting", settingssSchema)