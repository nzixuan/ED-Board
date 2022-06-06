const Roster = require("../models/roster.js")
const XLSX = require("xlsx");

const convert_to_json = (sheet) => {
    let json = {}
    if (!sheet["E1"])
        return {}
    json.date = sheet["E1"]["w"]
    const typeCell = sheet["C1"]
    const jsa = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    let roster = []
    //If template is followed
    if (typeCell) {
        const type = typeCell["v"]
        for (let y = 3; y < jsa.length; y++) {
            const row = jsa[y]
            for (let x = 1; x < row.length; x++) {
                //TODO: Handle notes and times
                if (row[x])
                    roster.push({ assignment: row[0], name: row[x], shift: jsa[1][x], staffType: type.toLowerCase() })
            }
        }
    } else {
        //Nurse Roster
        for (let x = 1; x < jsa[2].length; x++) {
            if (jsa[2][x] && jsa[2][x].trim() === "RN") {
                const shift = findShift(jsa, x)
                //Loop through rows to add into roster
                for (let y = 3; y < jsa.length; y++) {
                    const cell = jsa[y][x]
                    if (jsa[y][0].trim() === "Legends")
                        break;
                    //TODO: Handle notes and times and multiple names in 1 row
                    if (cell)
                        roster.push({ assignment: jsa[y][0], name: cell, shift: shift, staffType: "nurse" })
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
                        assignment = cell.substring(1)
                    } else if (assignment) {
                        roster.push({ assignment: assignment, name: cell, shift: shift, staffType: "nurse" })
                    }
                }
            }
        }
    }
    json.roster = roster
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

module.exports = {
    convert_to_json: convert_to_json
}