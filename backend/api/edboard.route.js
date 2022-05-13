const express = require("express")
const User = require("../models/user.js")
const UserCtrl = require("./user.controller.js")

const router = express.Router()

router.route("/user/login").post(UserCtrl.login)
router.route("/user/verify").get(UserCtrl.verifyJWT, UserCtrl.verify)
router.route("/user/register").post(UserCtrl.register)
module.exports = router