const User = require('../models/user')
const { use } = require('../routes/albums')
const APIError = require('../errors/apiError')

const createUser = async (req, res, next) => {
    const { name, email, password, passwordConfirmation, role } = req.body

    if (!name || !email || !password || !passwordConfirmation) {
        throw new APIError('All fields are required', 400)
    }
  
    if (password !== passwordConfirmation) {
        throw new APIError('Passwords do not match', 400)
    }
    
      const user = new User({ name, email, password, role })
      await user.save() 
      res.status(201).json({ message: 'User registered successfully' })
  }


  // testicontroller, että varmistutaan salasanan hashauksesta, kun sitä muutetaan
  const updateUser = async (req, res, next) => {
    const { id } = req.params
    const { name, email, password, passwordConfirmation } = req.body

    if (!name || !email || !password || !passwordConfirmation) {
        const error = new Error('All fields are required')
        error.status = 400
        return next(error)
    }
  
    if (password !== passwordConfirmation) {
        const error = new Error('Passwords do not match')
        error.status = 400
        return next(error)
    }
  
      const user = await User.findById(id)
  
      if (!user) {
        const error = new Error(`User not found with id ${id}`)
        error.status = 404
        return next(error)
      }
  
      user.name = name
      user.email = email
      user.password = password
  
      await user.save()
  
      res.status(200).json({ success: true, data: "User updated succesfully" })
  }

const deleteUser = async (req, res, next) => {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)
    if (!user) {
        throw new APIError(`User not found with id ${id}`, 404)
    }
    res.status(204).end()
}


module.exports = {
    createUser,
    updateUser,
    deleteUser
}