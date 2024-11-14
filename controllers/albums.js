const Album = require('../models/album')
const User = require('../models/user')
const APIError = require('../errors/apiError')
const {requireOwnership, requireAdmin} = require('../middleware/roles')

const getAlbums = async (req, res) => {
    const { artist, year, title, genre, sort, numericFilters, fields, search, startYear, endYear } = req.query
    const queryObject = {}

    if (artist) {
      queryObject.artist = artist
    }
    if (year) {
      queryObject.year = year
    }
    if (title) {
      queryObject.title = title
    }
    if (genre) {
      queryObject.genre = genre
    }
    if (numericFilters) {
      const operatorMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
      }
      const regEx = /\b(>|>=|=|<|<=)\b/g
      let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
      const options = ['year']
      filters = filters.split(',').forEach((item) => {
        const [field, operator, value] = item.split('-')
        if (options.includes(field)) {
          queryObject[field] = { [operator]: Number(value) }
        }
      })
    }

    if (startYear || endYear) {
      queryObject.year = {}
      if (startYear) {
        queryObject.year.$gte = Number(startYear)
      }
      if (endYear) {
        queryObject.year.$lte = Number(endYear)
      }
    }

    if (search) {
      queryObject.$or = [
        { artist: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ]
    }
   
    let albumsQuery = Album.find(queryObject)

    if (sort) {
      const sortList = sort.split(',').join(' ')
      albumsQuery = albumsQuery.sort(sortList)
    }
    if (fields) {
      const fieldsList = fields.split(',').join(' ')
      albumsQuery = albumsQuery.select(fieldsList).select('-_id')
    }

    const albums = await albumsQuery
    res.status(200).json({ albums })
}

const createAlbum = async (req, res) => {
    //const user = await User.findById(req.user.id)
    const album = req.body
    //album.user = user.id
    //user.albums = user.albums.concat(album.id)
    await Album.create(album)
    res.status(201).json({album})
}

const deleteAlbum = async (req, res, next) => {
    const { id } = req.params
    const deleteAlbum = await Album.findByIdAndDelete(id)
    if (!deleteAlbum) {
      throw new APIError(`Album not found with id ${id}`, 404)
    }

    res.status(204).end()
}

const updateAlbum = async (req, res, next) => {
  const { id } = req.params
  const { artist, title, year, genre, tracks } = req.body

    const album = await Album.findById(id)

    if (!album) {
      throw new APIError(`Album not found with id ${id}`, 404)
    }

    album.artist = artist
    album.title = title
    album.year = year
    album.genre = genre
    album.tracks = tracks

    const updatedAlbum = await album.save()

    res.status(200).json({ success: true, data: updatedAlbum })
}

module.exports = {deleteAlbum, getAlbums, createAlbum, updateAlbum}