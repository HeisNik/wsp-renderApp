const express = require('express')
const router = express.Router()

const {
  getAllAlbums,
} = require('../controllers/getAllAlbums')

router.get('/', getAllAlbums)

module.exports = router
