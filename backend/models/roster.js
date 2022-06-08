const mongoose = require("mongoose")

staffSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },
    time: {
        type: String,
    }
}, { _id: false })


rosterSchema = mongoose.Schema({
    assignment: {
        type: String,
        required: true
    },

    am: staffSchema,
    pm: staffSchema,
    straddle1: staffSchema,
    straddle2: staffSchema

}, { _id: false })

const rostersSchema = mongoose.Schema({

    staffType: {
        type: String,
        enum: ["doctor", "nurse", "logs", "ha", "eye"],
        required: true
    },

    roster: [rosterSchema]

}, { _id: false })

const rosterListSchema = mongoose.Schema({
    date: {
        type: Date
    },
    rosters: {
        type: [rostersSchema]
    }
}, { timestamps: true })

const RostersList = mongoose.model("roster", rosterListSchema)

module.exports = RostersList;