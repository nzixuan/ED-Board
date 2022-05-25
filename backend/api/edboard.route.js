const express = require("express")
const User = require("../models/user.js")
const UserCtrl = require("./user.controller.js")
const RosterCtrl = require("./roster.controller.js")
const { AuditTrailController } = require("./auditTrail.controller.js")

const router = express.Router()

router.route("/user/login").post(UserCtrl.login)
router.route("/user/verify").get(UserCtrl.verifyJWT, UserCtrl.verify)
router.route("/user/register").post(UserCtrl.register)
//TODO: handle timeout
router.route("/user/logout").post(UserCtrl.logout)


router.route("/audit/create").post(AuditTrailController.createAudit)
router.route("/audit/").get(AuditTrailController.viewAudit)

//Testing for roster schema
router.route("/roster/create").get(RosterCtrl.createRoster)

module.exports = router