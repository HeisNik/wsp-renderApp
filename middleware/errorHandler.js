const APIError = require('../errors/apiError')

const errorHandlerMiddleware = (err,req,res,next) => {
  if(err instanceof APIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  if (err.code === 11000) {
    return res.status(400).json({ msg: "This email has already registered" })
  }
  return res.status(500).json({ msg: err.message })
  }
  
  module.exports = errorHandlerMiddleware