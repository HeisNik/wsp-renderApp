const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const APIError = require('../errors/apiError')


const passport = require('passport')

const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      throw new APIError(err, 500)
    }
    if (!user) {
      throw new APIError('Invalid email or password', 401)
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      return res.json({ message: 'Login successful' })
    })
  })(req, res, next)
}

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' })
    }
    res.json({ message: 'Logout successful' })
  })
}
  
  module.exports = {login, logout}
  