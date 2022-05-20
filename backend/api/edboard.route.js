const express = require("express")
const User = require("../models/user.js")
const UserCtrl = require("./user.controller.js")
const RosterCtrl = require("./roster.controller.js")

const router = express.Router()

//Add audit trail for login 
router.route("/user/login").post(UserCtrl.login)
router.route("/user/verify").get(UserCtrl.verifyJWT, UserCtrl.verify)
router.route("/user/register").post(UserCtrl.register)

//Testing for roster schema
router.route("/roster/add").get(RosterCtrl.createRoster)

//end point for tracking log out
module.exports = router