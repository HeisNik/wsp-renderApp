const mongoose = require('mongoose')
const { Schema } = mongoose


const albumSchema = new mongoose.Schema({
  artist: { 
    type: String,
    required: true,
    minlength: [3, 'Input min 3 characters'],
    maxlength: [50, 'Input max 50 characters']
  },
  title: {
    type: String,
    required: true,
    minlength: [3, 'Input min 3 characters'],
    maxlength: [50, 'Input max 50 characters']
  },
  year: {
    type: Number,
    required: true,
    min: [1900, 'Cannot be under 1900'],
    max: [2024, 'Cannot be over 2024']
  },
  genre: {
    type: String,
    enum: {
      values: ['Rock', 'Country', 'Rap', 'Pop', 'EDM', 'Jazz', 'Classic'],
      message: '{VALUE} not available'
    }
  },
  tracks: {
    type: Number,
    required: true,
    min: [1,'Cannot be under 1'],
    max: [100, 'Cannot be under 100']
  },
  updatedAt: {
    type: Date
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

albumSchema.pre('save', function(next) {
    this.updatedAt = new Date()
  next()
})

const Album = mongoose.model('Album', albumSchema)

module.exports = Album