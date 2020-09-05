const controller = require('../controllers/books')
const validate = require('../controllers/books.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })
const trimRequest = require('trim-request')


router.get('/', controller.getAllItems)

router.post(
  '/',
  requireAuth,
  AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.createItem,
  controller.createItem
)

router.delete(
  '/:id',
  requireAuth,
  AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.deleteItem,
  controller.deleteItem
)

module.exports = router
