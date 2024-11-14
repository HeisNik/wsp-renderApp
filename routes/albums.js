const express = require('express')
const router = express.Router()
const {checkUser} = require('../middleware/logger')
const authUser = require('../middleware/auth')
const {requireOwnership, requireAdmin} = require('../middleware/roles')

const {
  getAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum
} = require('../controllers/albums')

router.get('/', getAlbums)
router.post('/', createAlbum)
router.put('/:id', requireAdmin, updateAlbum)
router.delete('/:id', deleteAlbum)

module.exports = router
