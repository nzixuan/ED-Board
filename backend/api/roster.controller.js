const Roster = require("../models/roster.js")

class RosterController {
    static async createRoster(req, res, next) {
        // // Creation of new staff and roster

        // const roster = new Roster({
        //     date: '2022-12-23', roster: [{
        //         assignment: "Snr Dr 2",
        //         name: "Z X Ng",
        //         shift: "AM",
        //         staffType: "Doctor",
        //         note: "#",
        //     },
        //     {
        //         assignment: "Snr Dr 2",
        //         name: "Z Y Ng",
        //         shift: "PM",
        //         staffType: "Doctor",
        //     },
        //     {
        //         assignment: "Snr Dr 2",
        //         name: "1",
        //         shift: "AM",
        //         staffType: "Doctor",
        //         note: "#",
        //     },
        //     {
        //         assignment: "Snr Dr 1",
        //         name: "2",
        //         shift: "PM",
        //         staffType: "Doctor",
        //     },
        //     {
        //         assignment: "Snr Dr 1",
        //         name: "Z X Ng",
        //         shift: "AM",
        //         staffType: "Doctor",
        //         note: "#",
        //     },
        //     {
        //         assignment: "Snr Dr 3",
        //         name: "Z Y Ng",
        //         shift: "PM",
        //         staffType: "Doctor",
        //     },
        //     {
        //         assignment: "NO",
        //         name: "2okas",
        //         shift: "AM",
        //         staffType: "Nurse",
        //     },
        //     ]
        // })
        // roster.save()

        // test query role from roster

        // Roster.find({ date: '2022-12-22', 'roster.staffType': "Doctor" }).exec((err, result) => {
        //     console.log(result[0].roster)
        // })

        // Roster.find({ date: '2022-12-22', 'roster.shift': "PM" }).exec((err, result) => {
        //     console.log(result[0].roster)
        // })

        //Test Retrieving from database

        Roster.aggregate([
            { $match: { date: new Date("2022-12-23") } },
            { $unwind: "$roster" },
            // {
            //     $match: {
            //         "roster.shift": "PM",
            //     },
            // },
            {
                $match: {
                    "roster.staffType": "Doctor",
                },
            },
            {
                $sort: {
                    "roster.assignment": 1, "roster.shift": 1
                }
            },
            { $replaceWith: "$roster" },
        ]).exec((err, result) => {
            console.log(result)
        });



        return res.json({ message: "Success" })
    }
}
module.exports = RosterController