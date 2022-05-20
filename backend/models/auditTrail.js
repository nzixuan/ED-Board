const mongoose = require("mongoose")

const auditTrailSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    log: {
        type: String,
        required: true,
    },
    delta: {
        type: Object
    },
    editedDocumentId: {
        type: mongoose.Schema.Types.ObjectId
    }
}, { timestamps: true })

const auditTrail = mongoose.model("audit-trail", auditTrailSchema)

module.exports = auditTrail;