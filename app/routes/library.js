const controller = require('../controllers/library')
const validate = require('../controllers/library.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })
const trimRequest = require('trim-request')


router.post(
  '/checkout',
  requireAuth,
  AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validate.bookOperation,
  controller.checkoutBook
)

router.post(
  '/return',
  requireAuth,
  AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validate.bookOperation,
  controller.returnBook
)

router.get(
  '/overdueBooks',
  requireAuth,
  AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  controller.overdueBooks
)

module.exports = router;
