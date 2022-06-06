const express = require("express")
const User = require("../models/user.js")
const UserCtrl = require("./user.controller.js")
const RosterCtrl = require("./roster.controller.js")
const { AuditTrailController } = require("./auditTrail.controller.js")

const router = express.Router()

//Delete user
router.route("/user/login").post(UserCtrl.login)
router.route("/user/verify").get(UserCtrl.verifyJWT, UserCtrl.verify)
router.route("/user/register").post(UserCtrl.register)
//TODO: handle timeout
router.route("/user/logout").post(UserCtrl.logout)

router.route("/audit/").get(AuditTrailController.viewAudit)
router.route("/audit/create").post(AuditTrailController.createAudit)

router.route("/roster/").get(RosterCtrl.viewRoster)
router.route("/roster/convert").post(RosterCtrl.ExceltoJson)
router.route("/roster/massCreate").post(RosterCtrl.massCreateRoster)
router.route("/roster/create").post(RosterCtrl.createRoster)
router.route("/roster/types").get(RosterCtrl.getTypes)
//TODO: Edit roster

module.exports = router