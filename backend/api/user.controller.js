const User = require("../models/user.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { registrationValidation, loginValidation } = require("../validation.js")
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
                                if (!dbUser.approved)
                                    return res.status(400).json({ message: "User has not been approved" })
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
                role: user.role,
                approved: false
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
}

module.exports = UserController