const { validationResult } = require('../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')


exports.bookOperation = [
  check('bookId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

