const { date } = require("joi")
const Joi = require("joi")
const RostersList = require("../models/roster.js")
const { addRosterListValidation, rosterQueryValidation, massCreateValidation, deleteRosterValidation, laterRosterQueryValidation } = require("../validation.js")
const formidable = require('formidable');
const XLSX = require("xlsx");
const { convert_to_json, createNewRoster, findTypes, editRoster, appendRoster } = require("./roster.handlers.js");
const { createTrail } = require("./auditTrail.controller")
const { ConfigController } = require("./config.controller.js");
const { ConnectionStates } = require("mongoose");

class RosterController {

    static async viewRoster(req, res, next) {

        const validationError = rosterQueryValidation(req.query).error
        if (validationError)
            return res.status(400).json({ message: validationError.details[0].message })
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let date = new Date()
        if (req.query.date)
            date = new Date(req.query.date)

        const day = new Date(date.toDateString())
        let result = await RostersList.findOne({ date: day })
        if (!req.query.board)
            return res.json(result.rosters)

        const assignments = await ConfigController.getBoardAssignments(req.query.board)
        if (!assignments)
            return res.status(400).json({ message: "Config not found" })

        if (!result)
            return res.json({
                rosters: [], timeString: new Date().toLocaleTimeString(),
                dateString: weekday[date.getDay()] + ", " + date.toLocaleDateString('en-GB')
            })

        for (let i = 0; i < result.rosters.length; i++) {
            const roster = result.rosters[i]
            const assignmentSet = new Set(assignments[roster.staffType])
            roster.roster = roster.roster.filter((staff) => {
                const obj = JSON.parse(JSON.stringify(staff))
                const count = Object.values(obj).length
                return (assignmentSet.has(staff.assignment.trim()) && count > 1)
            })
        }


        return res.json({
            rosters: result.rosters, timeString: new Date().toLocaleTimeString(),
            dateString: weekday[date.getDay()] + ", " + date.toLocaleDateString('en-GB')
        })
    }


    static async viewLaterRoster(req, res, next) {

        const validationError = laterRosterQueryValidation(req.query).error
        if (validationError)
            return res.status(400).json({ message: validationError.details[0].message })

        let date = new Date()
        if (req.query.date)
            date = new Date(req.query.date)
        else
            date.setDate(date.getDate() - 1)
        let result = await RostersList.find({ date: { $gte: date } }).sort({ date: 1 })
        return res.json(result)

    }

    static async ExceltoJson(req, res, next) {
        const form = new formidable.IncomingForm({ multiples: true });
        let rosters = []
        form.parse(req, async (err, fields, files) => {

            const entries = files["Upload Excel"].length ? files["Upload Excel"] : [files["Upload Excel"]]
            // Loop through all workbooks

            for (let i = 0; i < entries.length; i++) {
                let roster = []
                const f = entries[i];
                const path = f.filepath;
                const workbook = XLSX.readFile(path);
                //Loop through all sheets
                for (let j = 0; j < workbook.SheetNames.length; j++) {
                    const name = workbook.SheetNames[j]

                    try {
                        roster = await convert_to_json(workbook.Sheets[name])

                    } catch (e) {
                        console.log(e)
                        return res.status(400).json({ message: "Error converting excel", rosters: [] })

                    }
                    const validationError = addRosterListValidation({ username: "admin", ...roster }).error
                    if (validationError)
                        return res.status(400).json({ message: validationError.details[0].message, rosters: [] })
                    if (roster.rosters[0].roster.length > 0)
                        rosters.push(roster)
                }
            }
            if (rosters.length === 0)
                return res.status(400).json({ message: "Empty roster", rosters: [] })
            return res.json({ message: "Convert success", rosters: rosters });

        });

    }

    static async massCreateRoster(req, res, next) {

        const validationError = massCreateValidation(req.body).error
        if (validationError)
            return res.status(400).json({ message: validationError.details[0].message })

        const rosters = req.body.rostersList
        const username = req.body.username
        for (let i = 0; i < rosters.length; i++) {
            const roster = rosters[i]
            try {
                const types = await findTypes(roster.date)
                if (types.length === 0) {
                    //Make new
                    await createNewRoster(username, roster.date, roster.rosters)
                } else if (types.includes(roster.rosters[0].staffType)) {
                    //Edit
                    await editRoster(username, roster.date, roster.rosters)
                } else {
                    // Append
                    await appendRoster(username, roster.date, roster.rosters)
                }
            }
            catch (err) {
                return res.status(500).json({ message: err.message })
            }
        }


        return res.json({ message: "Mass Roster Created" })

    }

    static async createRoster(req, res, next) {

        const validationError = addRosterListValidation(req.body).error
        if (validationError)
            return res.status(400).json({ message: validationError.details[0].message })
        const takenDate = await RostersList.findOne({ date: req.body.date })

        if (takenDate) {
            return res.status(400).json({ message: "Date is already created" })
        }

        try {
            await createNewRoster(req.body.username, req.body.date, req.body.rosters)
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
        const types = await findTypes(date)

        return res.json(types)
    }

    static async deleteRoster(req, res, next) {
        const validationError = deleteRosterValidation(req.body).error
        if (validationError)
            return res.status(400).json({ message: validationError.details[0].message })
        if (req.user.username !== req.body.username)
            return res.status(400).json({ message: "User is not authorised to perform this action" })

        await RostersList.deleteOne({ date: new Date(req.body.date) }).exec();
        try {
            createTrail({
                username: req.body.username, type: "delete-roster", deletedDocumentDate: req.body.date
            })
        }
        catch (err) {
            return res.status(500).json({ message: err.message })
        }
        return res.json("Roster deleted")
    }

}


module.exports = RosterController