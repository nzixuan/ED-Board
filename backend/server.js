import express from "express"
import cors from "cors"
import edboard from "./api/edboard.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/edboard", edboard);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

export default app