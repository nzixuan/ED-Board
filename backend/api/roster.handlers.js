const RostersList = require("../models/roster.js")
const { createTrail } = require("./auditTrail.controller")
const XLSX = require("xlsx");
const diff = require('deep-diff')
const convert_to_json = (sheet) => {

    let json = {}
    if (!sheet["E1"])
        return {}
    json.date = sheet["E1"]["w"]
    const typeCell = sheet["C1"]
    const jsa = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    let rosters = {}
    //If template is followed
    if (typeCell) {
        let roster = []
        const type = typeCell["v"]
        rosters.staffType = type.toLowerCase()

        for (let y = 3; y < jsa.length; y++) {
            const row = jsa[y]
            if (!row[0])
                continue
            let temp = {
                assignment: row[0].trim()
            }

            for (let x = 1; x < row.length; x++) {
                //TODO: Handle notes and times
                if (row[x])
                    temp[formatShift(jsa[1][x])] = { name: row[x].trim() }
            }
            if (Object.keys(temp).length > 1)
                roster.push(temp)
        }
        rosters.roster = roster
    } else {
        //Nurse Roster
        rosters.staffType = "nurse"
        let roster = {}
        for (let x = 1; x < jsa[2].length; x++) {
            if (jsa[2][x] && jsa[2][x].trim() === "RN") {
                const shift = findShift(jsa, x)
                //Loop through rows to add into roster
                for (let y = 3; y < jsa.length; y++) {
                    const cell = jsa[y][x]
                    if (jsa[y][0].trim() === "Legends")
                        break;
                    //TODO: Handle notes and times and multiple names in 1 row
                    if (cell) {
                        const assignment = jsa[y][0].trim()
                        if (!roster[y])
                            roster[y] = { assignment: assignment }

                        roster[y][formatShift(shift)] = { name: cell.trim() }
                    }
                }
            } else if (jsa[2][x] && jsa[2][x].trim() === "RN/AN") {
                const shift = findShift(jsa, x)
                let assignment = ""
                for (let y = 3; y < jsa.length; y++) {
                    if (jsa[y][0].trim() === "Legends")
                        break;
                    const cell = jsa[y][x]
                    if (!cell)
                        continue;
                    if (cell.charAt(0) === '*') {
                        assignment = cell.substring(1).trim()
                    } else if (assignment) {
                        if (!roster[y])
                            roster[y] = { assignment: assignment }
                        roster[y][formatShift(shift)] = { name: cell.trim() }
                    }
                }
            }
        }
        rosters.roster = Object.values(roster)
    }


    json.rosters = [rosters]

    return json
}

const findShift = (jsa, columnNumber) => {
    let temp = columnNumber;
    //find shift from merged cell
    while (temp >= 0) {
        if (jsa[1][temp])
            break;
        temp--
    }
    return jsa[1][temp]
}

const formatShift = (shift) => {
    const lower = shift.toLowerCase().replace(/\s/g, '')
    return lower
}

async function createNewRoster(username, date, rosters) {
    const newRostersList = new RostersList({
        date: date,
        rosters: rosters
    })

    await newRostersList.save()

    createTrail({
        username: username, type: "create-roster", documentId: newRostersList._id.toString()
    })

    return newRostersList
}

async function editRoster(username, date, rosters) {

    let edited = false;

    const db = await RostersList.findOne({ date: date },).exec()
    for (let i = 0; i < db.rosters.length; i++) {
        if (db.rosters[i].staffType === rosters[0].staffType) {

            const delta = diff(JSON.parse(JSON.stringify(db.rosters[i])), rosters[0])
            // console.log(delta)
            if (!delta)
                return db
            db.rosters[i] = rosters[0]
        }
    }

    await db.save()
    //TODO: Add Delta

    createTrail({
        username: username, type: "edit-roster", documentId: db._id.toString()
    })

    return db
}

async function appendRoster(username, date, rosters) {

    const db = await RostersList.findOne({ date: date },).exec()
    db.rosters.push(rosters[0])
    await db.save()
    //TODO: Add Delta
    createTrail({
        username: username, type: "edit-roster", documentId: db._id.toString()
    })

    return db
}

async function findTypes(date) {
    const types = await RostersList.find({ date: date }).distinct("rosters.staffType")
    return types
}


module.exports = {
    convert_to_json: convert_to_json,
    createNewRoster: createNewRoster,
    findTypes: findTypes,
    editRoster: editRoster,
    appendRoster: appendRoster
}

// var combined_rosters = []
// rosters.forEach((roster) => {
//     var existing = combined_rosters.filter((x, y) => {
//         return x.date === roster.date
//     })

//     if (existing.length) {
//         var existingIndex = combined_rosters.indexOf(existing[0]);
//         combined_rosters[existingIndex].roster = combined_rosters[existingIndex].roster.concat(roster.roster);
//     } else {
//         combined_rosters.push(roster)
//     }

// })