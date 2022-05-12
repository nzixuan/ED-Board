import app from "./server.js"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const port = process.env.PORT || 8000


console.log(process.env.dbURI)
mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }).then((res) => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
})
  .catch(err => console.log(err))

