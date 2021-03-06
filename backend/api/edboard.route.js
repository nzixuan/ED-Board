const express = require("express")
const User = require("../models/user.js")
const UserCtrl = require("./user.controller.js")
const RosterCtrl = require("./roster.controller.js")
const { ConfigController } = require("./config.controller.js")
const { AuditTrailController } = require("./auditTrail.controller.js")
var sem = require('semaphore')(1);

const router = express.Router()

router.route("/user/login").post(UserCtrl.login)
router.route("/user/logout").post(UserCtrl.logout)
router.route("/user/verify").get(UserCtrl.verifyJWT, UserCtrl.verify)
router.route("/user/register").post(UserCtrl.register)

router.route("/user").get(UserCtrl.verifyJWT, UserCtrl.viewUsers)
router.route("/user/password").post(UserCtrl.verifyJWT, UserCtrl.changePassword)
router.route("/user/delete").post(UserCtrl.verifyJWT, UserCtrl.deleteUser)


router.route("/audit/").get(AuditTrailController.viewAudit)
router.route("/audit/create").post(AuditTrailController.createAudit)

router.route("/roster/").get(RosterCtrl.viewRoster)
router.route("/roster/later").get(RosterCtrl.viewLaterRoster)
router.route("/roster/convert").post(RosterCtrl.ExceltoJson)
router.route("/roster/massCreate").post(UserCtrl.verifyJWT, (req, res, next) => {
    sem.take(async () => {
        const result = await RosterCtrl.massCreateRoster(req, res, next)
        sem.leave()
        return result
    })
})
router.route("/roster/create").post(UserCtrl.verifyJWT, (req, res, next) => {
    sem.take(async () => {
        const result = await RosterCtrl.createRoster(req, res, next)
        sem.leave()
        return result
    })
})
router.route("/roster/delete").post(UserCtrl.verifyJWT, RosterCtrl.deleteRoster)
router.route("/roster/types").get(RosterCtrl.getTypes)

router.route("/config").get(ConfigController.getConfig)
router.route("/config").post(UserCtrl.verifyJWT, ConfigController.setConfig)
router.route("/config/allAssignments").get(ConfigController.getAllAssignments)
router.route("/config/boards").get(ConfigController.getBoards)



module.exports = router