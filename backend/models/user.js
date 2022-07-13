const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'super-admin'],
        required: true
    }
}, { timestamps: true })

const User = mongoose.model("user", userSchema)

module.exports = User;