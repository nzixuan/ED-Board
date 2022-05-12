export default class UserController {
    static async testing(req, res, next) {
        res.json({ test: "testing testing" })
    }
}