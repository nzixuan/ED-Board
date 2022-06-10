const Config = require("../models/config")
const { configValidation } = require("../validation")
const { createTrail } = require("./auditTrail.controller")

class ConfigController {

    static async getBoards(req, res, next) {
        const config = await Config.findOne().exec()

        if (!config)
            return res.json([])
        return res.json(Object.keys(config.boards))

    }

    static async getBoardAssignments(board) {
        const config = await Config.findOne().exec()

        if (!config)
            return []
        return config.boards[board]
    }

    static async setConfig(req, res, next) {
        const validationError = configValidation(req.body).error
        if (validationError)
            return res.status(400).json({ message: validationError.details[0].message })
        const boards = req.body.boards
        const boardNames = req.body.boardNames
        const username = req.body.username
        await Config.findOneAndReplace({}, { boards: boards, boardNames: boardNames }, { upsert: true }).exec()
        try {
            createTrail({ username: username, type: "edit-config" })
        }
        catch (err) {
            return res.status(500).json({ message: err.message })
        }
        return res.json({ message: "Config Set" })

    }
}

module.exports = ConfigController