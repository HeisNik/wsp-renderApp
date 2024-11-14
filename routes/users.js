const express = require('express')
const router = express.Router()
const {requireOwnership, requireAdmin} = require('../middleware/roles')


const {
  createUser,
  deleteUser
} = require('../controllers/users')

router.post('/', createUser)
router.delete('/:id', requireAdmin, deleteUser)


module.exports = router
