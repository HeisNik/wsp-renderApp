const jwt = require('jsonwebtoken')


const authUser = async (req,res,next) => {
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer')) {
    const error = new Error(`No token in header`)
    error.status = 401
    return next(error)
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const { id, email } = decoded
    req.user = { id, email }
    next()
  } catch (error) {
    error = new Error(`Not authorized for this route`)
    error.status = 401
    return next(error)
  }
}

module.exports = authUser