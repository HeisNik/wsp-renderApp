const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    maxlength: [50, 'Input max 50 characters']
  },
  email: {
    type: String,
    required: true,
    maxlength: [50, 'Input max 50 characters'],
    unique: true
  },
  password: {
    type: String,
    required: true,
    maxlength: [50, 'Input max 50 characters']
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  albums: [{ type: Schema.Types.ObjectId, ref: 'Albums' }]
})

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) { 
      user.password = await bcrypt.hash(user.password, 10)
    }
    next()
  })



const User = mongoose.model('User', userSchema)

module.exports = User