const { date } = require("joi")
const Joi = require("joi")
const Roster = require("../models/roster.js")
const { rosterValidation, rosterQueryValidation, massCreateValidation } = require("../validation.js")
const { createTrail } = require("./auditTrail.controller")
const formidable = require('formidable');
const XLSX = require("xlsx");
const { convert_to_json } = require("./roster.handlers.js")


class RosterController {

    static async ExceltoJson(req, res, next) {
        const form = new formidable.IncomingForm({ multiples: true });
        let rosters = []
        form.parse(req, (err, fields, files) => {
            const entries = files["Upload Excel"]
            // Loop through all workbooks
            for (let i = 0; i < entries.length; i++) {
                let roster = []
                const f = entries[i];
                const path = f.filepath;
                const workbook = XLSX.readFile(path);
                //Loop through all sheets
                for (let j = 0; j < workbook.SheetNames.length; j++) {
                    const name = workbook.SheetNames[j]
                    roster = convert_to_json(workbook.Sheets[name], date)
                    rosters.push(roster)
                }
            }

            return res.json({ message: "success", rosters: rosters });

        });

    }

    static async viewRoster(req, res, next) {
        //TODO: group and push
        // const query = { date: req.query.date, staffType: req.query.staffType }
        // const validationError = rosterQueryValidation(query).error
        // if (validationError)
        //     return res.status(400).json({ message: validationError.details[0].message })
        // Roster.aggregate([
        //     { $match: { date: new Date(query.date) } },
        //     { $unwind: "$roster" },
        //     ...(query.staffType ? [{
        //         $match: {
        //             "roster.staffType": query.staffType,
        //         },
        //     }] : []),
        //     {
        //         $sort: {
        //             "roster.assignment": 1, "roster.shift": 1
        //         }
        //     },
        //     { $replaceWith: "$roster" },
        // ]).exec((err, result) => {
        //     return res.json(result)

        // });
    }

    static massCreateRoster(req, res, next) {
        //TODO:
        const validationError = massCreateValidation(req.body).error
        console.log(req.body)
        if (validationError)
            return res.status(400).json({ message: validationError.details[0].message })

        const rosters = req.body.rosters
        const username = req.body.username
        rosters.forEach(async function addRoster(roster) {
            const types = await Roster.find({ date: roster.date }).distinct("roster.staffType")
            if (types.length === 0) {
                console.log(0)
                //Make new
            } else if (types.includes(roster.roster[0].staffType)) {
                console.log(roster.roster[0].staffType)
                // Append
            } else {
                // Edit
                console.log(roster.roster[0].staffType)
            }
        });

        return res.json({ message: "Mass Roster Created" })

    }

    static async createRoster(req, res, next) {
        //TODO:
        // const roster = req.body
        // const validationError = addRosterValidation(roster).error

        // if (validationError)
        //     return res.status(400).json({ message: validationError.details[0].message })

        // const newRoster = new Roster({
        //     date: roster.date,
        //     roster: roster.roster
        // })

        // newRoster.save()

        // //Audit
        // try {
        //     createTrail({
        //         username: roster.username, type: "create-roster", documentId: newRoster._id.toString()
        //     })
        // }
        // catch (err) {
        //     return res.status(500).json({ message: err.message })
        // }
        // return res.json({ message: "Roster Created" })

    }

    static async getTypes(req, res, next) {
        //TODO:
        // const date = new Date(req.query.date)
        // if (!req.query.date)
        //     return res.status(400).json({ message: "query date is required" })
        // if (!date)
        //     return res.status(400).json({ message: "date is invalid" })
        // const types = await Roster.find({ date: date }).distinct("roster.staffType")

        // return res.json(types)
    }

    //TODO: Edit Roster 
    static async editRoster(req, res, next) {

    }
}
module.exports = RosterController