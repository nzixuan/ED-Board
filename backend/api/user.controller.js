const User = require("../models/user.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { registrationValidation, loginValidation, changePasswordValidation, deleteUserValidation } = require("../validation.js")
const { createTrail } = require("./auditTrail.controller")
const { db } = require("../models/user.js")
class UserController {
    static async login(req, res, next) {
        const userLoggingIn = req.body;

        if (!userLoggingIn) return res.status(400).json({ message: "Server Error" })

        const validationError = loginValidation(userLoggingIn).error

        if (validationError) {
            return res.status(400).json({ message: validationError.details[0].message })
        } else {
            User.findOne({ username: userLoggingIn.username.toLowerCase() })
                .then(dbUser => {
                    if (!dbUser) {
                        return res.status(400).json({ message: "Invalid Username or Password" })
                    }
                    bcrypt.compare(userLoggingIn.password, dbUser.password)
                        .then(isCorrect => {
                            if (isCorrect) {
                                const payload = {
                                    id: dbUser._id,
                                    username: dbUser.username,
                                    role: dbUser.role
                                }
                                jwt.sign(
                                    payload,
                                    process.env.PASSPORTSECRET,
                                    { expiresIn: 1800 },
                                    (err, token) => {
                                        createTrail({ username: dbUser.username, type: "login" })
                                        return res.json({ message: "Success", token: "Bearer " + token })
                                    }
                                )
                            } else {
                                return res.status(400).json({ message: "Invalid Username or Password" })
                            }
                        })

                })
        }
    }

    static async register(req, res, next) {

        const user = req.body

        const takenUsername = await User.findOne({ username: user.username.toLowerCase() })

        const validationError = registrationValidation(user).error

        if (validationError) {
            return res.status(400).json({ message: validationError.details[0].message })
        } else if (takenUsername) {
            return res.status(400).json({ message: "Username has already been taken" })
        } else {
            user.password = await bcrypt.hash(req.body.password, 10)
            const dbUser = new User({
                username: user.username.toLowerCase(),
                password: user.password,
                role: user.role
            });
            dbUser.save()
            return res.json({ message: "User Registered" })
        }
    }

    static async verifyJWT(req, res, next) {
        // removes 'Bearer` from token
        const token = req.headers["token"]?.split(' ')[1]

        if (token) {
            jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
                if (err) return res.status(400).json({ isLoggedIn: false, message: "Failed To Authenticate" })
                req.user = {};
                req.user.id = decoded.id
                req.user.username = decoded.username
                req.user.role = decoded.role
                next()
            })
        } else {
            res.status(400).json({ isLoggedIn: false, message: "Incorrect Token Given" })
        }
    }

    static async verify(req, res, next) {
        return res.json({ isLoggedIn: true, username: req.user.username, role: req.user.role })
    }

    static async logout(req, res, next) {
        try {
            createTrail({ username: req.body.username, type: "logout" })
        }
        catch (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json({ message: "User has logged out" })
    }

    static async viewUsers(req, res, next) {
        let users = []
        if (req.user.role == "super-admin") {
            users = await User.find({ role: { $ne: "super-admin" } })
        } else if (req.user.role == "admin") {
            users = await User.find({ role: "user" })
        }
        if (users === null || users === undefined)
            return res.status(400).json({ message: "Server Error" })
        return res.json({ message: "Success!", users: users })
    }

    static async changePassword(req, res, next) {
        const validationError = changePasswordValidation(req.body).error

        if (validationError)
            return res.status(400).json({ message: validationError.details[0].message })

        const requestedUser = await User.findOne({ username: req.body.username })

        if (requestedUser === null || requestedUser === undefined)
            return res.status(400).json({ message: "Server was not able to find given user" })
        if (!(requestedUser.username === req.user.username || req.user.role === "super-admin"
            || (req.user.role === "admin" && requestedUser.role)))
            return res.status(400).json({ message: "User is not authorised to perform this change" })

        requestedUser.password = await bcrypt.hash(req.body.password, 10)
        await requestedUser.save()
        return res.json({ message: "Password change success!" })
    }

    static async deleteUser(req, res, next) {
        const validationError = deleteUserValidation(req.body).error

        if (validationError)
            return res.status(400).json({ message: validationError.details[0].message })

        const requestedUser = await User.findOne({ username: req.body.username })

        if (requestedUser === null || requestedUser === undefined)
            return res.status(400).json({ message: "Server was not able to find given user" })
        if (!(requestedUser.username === req.user.username || req.user.role === "super-admin"
            || (req.user.role === "admin" && requestedUser.role)))
            return res.status(400).json({ message: "User is not authorised to perform this change" })
        await User.deleteOne({ _id: requestedUser._id });
        return res.json({ message: "User deletion success!" })

    }
}

module.exports = UserController