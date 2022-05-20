const Staff = require("../models/staff.js")
const Roster = require("../models/roster.js")
const RosteredStaff = require("../models/rosteredStaff.js")

class RosterController {
    static async createRoster(req, res, next) {
        // // Creation of new staff and roster
        // const nurse = new Staff({ name: "nemu" })
        // nurse.save()
        // const nurse2 = new Staff({ name: "nemu2" })
        // nurse2.save()

        // const staff1 = new RosteredStaff({
        //     role: "Sr 1",
        //     staff: nurse._id
        // })
        // const staff2 = new RosteredStaff({ role: "Sr 2", staff: nurse2._id })
        // staff1.save()
        // staff2.save()

        // const roster = new Roster({ date: '2022-12-22', roster: [staff1._id, staff2._id] })
        // roster.save()

        // test query role from roster

        Roster.findOne({ date: '2022-12-22' }).populate({ path: 'roster', populate: { path: 'staff' } }).exec((err, roster) => {
            console.log(roster.roster)
        })

        //test populate from roster


        return res.json({ message: "Success" })
    }
}
module.exports = RosterController