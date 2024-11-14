require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
app.use(express.json())
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGODB_URI
const config = require('./config')
const morgan = require('morgan')
app.use(morgan('tiny'))
const connectMongoDB = require('./db/mongodb')
app.use(express.urlencoded({ extended: true }))


app.use(express.static('./public'))

const albumRoutes = require('./routes/albums')

const errorHandlerMiddleware = require('./middleware/errorHandler')

app.use('/api/albums', albumRoutes)

app.all('*', (req, res) => {
  res.status(404).send('<h1>Not found!</h1>')
})

app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connectMongoDB(config.MONGODB_URI)
    app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}/api/albums ...`))
  } catch (error) {
    console.log(error)
  }
}
  
start()

module.exports = app