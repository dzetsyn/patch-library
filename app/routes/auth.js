const controller = require('../controllers/auth')
const validate = require('../controllers/auth.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })
const trimRequest = require('trim-request')


router.post(
  '/register',
  trimRequest.all,
  validate.register,
  controller.register
)

router.post('/verify', trimRequest.all, validate.verify, controller.verify)

router.post(
  '/forgot',
  trimRequest.all,
  validate.forgotPassword,
  controller.forgotPassword
)

router.post(
  '/reset',
  trimRequest.all,
  validate.resetPassword,
  controller.resetPassword
)

router.get(
  '/token',
  requireAuth,
  AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  controller.getRefreshToken
)

router.post('/login', trimRequest.all, validate.login, controller.login)

module.exports = router
