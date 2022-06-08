const { date } = require("joi");
const mongoose = require("mongoose")

const auditTrailSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["login", "logout", "edit-roster", "create-roster", "delete-roster"],
        required: true,
    },

    delta: {
        type: Object
    },

    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roster"
    },

    deletedDocumentDate: {
        type: Date,
    },
}, { timestamps: true })

const auditTrail = mongoose.model("audit-trail", auditTrailSchema)

module.exports = auditTrail;