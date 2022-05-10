import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/doctors", (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
  });
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

export default app