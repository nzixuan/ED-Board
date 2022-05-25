const auditTrail = require("../models/auditTrail.js")
const { auditValidation } = require("../validation.js")

class AuditTrailController {
    static async createAudit(req, res, next) {
        try {
            createTrail(req.body)
        }
        catch (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json({ message: "Trail created" })
    }

    static async viewAudit(req, res, next) {
        const auditPerPage = req.query.auditPerPage ? parseInt(req.query.auditPerPage, 10) : 15
        const page = req.query.page ? parseInt(req.query.page, 10) : 0
        let audits = []
        let filters = {}
        let totalNum = 0
        const date = new Date(req.query.date)
        const endDate = new Date(req.query.date)
        endDate.setDate(endDate.getDate() + 1)

        filters = {
            createdAt: { $gt: date, $lt: endDate }
        }
        try {
            audits = await auditTrail.find(filters).limit(auditPerPage).skip(auditPerPage * page)
            totalNum = await auditTrail.countDocuments(filters)
        } catch (e) {
            console.error('Unable to issue command', e.message)
        }

        let response = {
            audits: audits,
            page: page,
            filters: filters,
            entries_per_page: auditPerPage,
            total_result: totalNum
        }

        return res.json(response)
    }
}

const createTrail = (data) => {
    const validationError = auditValidation(data).error

    if (validationError)
        throw new Error(validationError.details[0].message)
    const trail = new auditTrail(data)
    trail.save()
}
module.exports = {
    AuditTrailController: AuditTrailController, createTrail: createTrail
}