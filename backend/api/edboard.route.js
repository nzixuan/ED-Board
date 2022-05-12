import express from "express"
import UserCtrl from "./user.controller.js"

const router = express.Router()

//router.route("/user/login").get()
//router.route("/user/verify").get()
router.route("/user").get(UserCtrl.testing)

export default router