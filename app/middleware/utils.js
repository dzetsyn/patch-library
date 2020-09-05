const mongoose = require('mongoose')
const requestIp = require('request-ip')
const { validationResult } = require('express-validator')


exports.removeExtensionFromFile = (file) => {
  return file.split('.').slice(0, -1).join('.').toString()
}

exports.getIP = (req) => requestIp.getClientIp(req)

exports.getBrowserInfo = (req) => req.headers['user-agent']

exports.getCountry = (req) =>
  req.headers['cf-ipcountry'] ? req.headers['cf-ipcountry'] : 'XX'

exports.handleError = (res, err) => {
  // Prints error in console
  if (process.env.NODE_ENV === 'development') {
    console.log(err)
  }
  // Sends error to user
  res.status(err.code).json({
    errors: {
      msg: err.message
    }
  })
}

exports.buildErrObject = (code, message) => {
  return {
    code,
    message
  }
}

exports.validationResult = (req, res, next) => {
  try {
    validationResult(req).throw()
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase()
    }
    return next()
  } catch (err) {
    return this.handleError(res, this.buildErrObject(422, err.array()))
  }
}

exports.buildSuccObject = (message) => {
  return {
    msg: message
  }
}

exports.isIDGood = async (id) => {
  return new Promise((resolve, reject) => {
    const goodID = mongoose.Types.ObjectId.isValid(id)
    return goodID
      ? resolve(id)
      : reject(this.buildErrObject(422, 'ID_MALFORMED'))
  })
}

exports.itemNotFound = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message))
  }
  if (!item) {
    reject(this.buildErrObject(404, message))
  }
}

exports.itemAlreadyExists = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message))
  }
  if (item) {
    reject(this.buildErrObject(422, message))
  }
}
