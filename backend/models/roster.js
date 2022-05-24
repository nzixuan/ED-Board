const mongoose = require("mongoose")

const rosteredStaffSchema = mongoose.Schema({
    assignment: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    shift: {
        type: String,
        enum: ["AM", "PM", "ND", "Straddle"]
    },
    staffType: {
        type: String,
        enum: ["Doctor", "Nurse", "Logistics", "HA", "EYE"],
        required: true
    },
    note: {
        type: String,
    },
})

const rosterSchema = mongoose.Schema({
    date: {
        type: Date
    },
    roster: {
        type: [rosteredStaffSchema]
    }
}, { timestamps: true })

const Roster = mongoose.model("roster", rosterSchema)

module.exports = Roster;