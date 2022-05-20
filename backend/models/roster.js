const mongoose = require("mongoose")

const rosterSchema = mongoose.Schema({
    date: {
        type: Date
    },
    roster: {
        type: [{ type: mongoose.Schema.ObjectId, ref: 'rosteredStaff' }]
    }
}, { timestamps: true })

const Roster = mongoose.model("roster", rosterSchema)

module.exports = Roster;