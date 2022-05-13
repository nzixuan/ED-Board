const express = require("express")
const cors = require("cors")
const edboard = require("./api/edboard.route.js")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/edboard", edboard);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))


module.exports = app