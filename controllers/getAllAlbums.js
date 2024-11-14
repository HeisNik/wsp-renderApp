const Album = require('../models/album')


const getAllAlbums = async (req, res) => {
    const albums = await Album.find({})
    res.status(200).json({ albums })
}

module.exports = {getAllAlbums}