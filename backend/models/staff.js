const mongoose = require("mongoose")

const staffSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
})

const Staff = mongoose.model("staff", staffSchema)

module.exports = Staff;