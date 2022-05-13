const app = require("./server")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config()

const port = process.env.PORT || 8000

mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }).then((res) => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
})
  .catch(err => console.log(err))

