const mongoose = require("mongoose")

const configSchema = mongoose.Schema({
    boards: {
        type: Object,
    },

    boardNames: {
        type: Object,
    }
})

const Config = mongoose.model("config", configSchema)

module.exports = Config;