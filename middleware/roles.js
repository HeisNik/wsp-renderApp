const APIError = require('../errors/apiError')
const Album = require('../models/album')
const User = require('../models/user')

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') 
        return next()
    throw new APIError('Admin access required.', 403)
  }
  
  const requireOwnership = async (req, res, next) => {
    const userId = req.user.id
    const album = await Album.findById(req.params.id)
    if (!album) {
        throw new APIError(`There is no album with id ${req.params.id}`, 403)
    }
    const resourceOwnerId = album.user

    if (userId.toString() === resourceOwnerId.toString() || req.user.role === 'admin') 
        return next()
    throw new APIError('Not authorized to access this resource.', 403)
  }


module.exports = {requireAdmin, requireOwnership}