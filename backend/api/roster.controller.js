const { date } = require("joi")
const Joi = require("joi")
const Roster = require("../models/roster.js")
const { rosterValidation, rosterQueryValidation } = require("../validation.js")
const { createTrail } = require("./auditTrail.controller")

class RosterController {

    static async viewRoster(req, res, next) {
        const query = { date: req.query.date, staffType: req.query.staffType }
        const validationError = rosterQueryValidation(query).error
        if (validationError)
            return res.status(400).json({ message: validationError.details[0].message })
        Roster.aggregate([
            { $match: { date: new Date(query.date) } },
            { $unwind: "$roster" },
            ...(query.staffType ? [{
                $match: {
                    "roster.staffType": query.staffType,
                },
            }] : []),
            {
                $sort: {
                    "roster.assignment": 1, "roster.shift": 1
                }
            },
            { $replaceWith: "$roster" },
        ]).exec((err, result) => {
            return res.json(result)

        });
    }

    static async createRoster(req, res, next) {
        const roster = req.body
        const validationError = rosterValidation(roster).error

        if (validationError)
            return res.status(400).json({ message: validationError.details[0].message })

        const newRoster = new Roster({
            date: roster.date,
            roster: roster.roster
        })

        newRoster.save()

        //Audit
        try {
            createTrail({ username: roster.username, type: "create-roster", documentId: newRoster._id.toString() })
        }
        catch (err) {
            return res.status(500).json({ message: err.message })
        }
        return res.json({ message: "Roster Created" })

    }

    static async getTypes(req, res, next) {

        const date = new Date(req.query.date)
        if (!req.query.date)
            return res.status(400).json({ message: "query date is required" })
        if (!date)
            return res.status(400).json({ message: "date is invalid" })
        const types = await Roster.find({ date: date }).distinct("roster.staffType")

        return res.json(types)
    }
    //TODO: Edit Roster 
    static async editRoster(req, res, next) {

    }
}
module.exports = RosterController