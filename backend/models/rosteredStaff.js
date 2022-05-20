const mongoose = require("mongoose")

const rosteredStaffSchema = mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff',
        required: true
    }
})

const RosteredStaff = mongoose.model("rosteredStaff", rosteredStaffSchema)

module.exports = RosteredStaff;