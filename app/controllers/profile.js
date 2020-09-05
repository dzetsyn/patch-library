const userModel = require('../models/user')
const bookModel = require('../models/book')
const utils = require('../middleware/utils')
const { matchedData } = require('express-validator')
const auth = require('../middleware/auth')


const getProfileFromDB = async (id) => {
  return new Promise((resolve, reject) => {
    userModel.findById(id, '-_id -updatedAt -createdAt', (err, user) => {
      utils.itemNotFound(err, user, reject, 'NOT_FOUND')
      resolve(user)
    })
  })
}

const getTakenBooks = async (id) => {
  return new Promise((resolve, reject) => {
    bookModel.find({ takenBy: id }, (err, books) => {
      resolve(books)
    })
  })
}

const updateProfileInDB = async (req, id) => {
  return new Promise((resolve, reject) => {
    userModel.findByIdAndUpdate(
      id,
      req,
      {
        new: true,
        runValidators: true,
        select: '-role -_id -updatedAt -createdAt'
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, 'NOT_FOUND')
        resolve(user)
      }
    )
  })
}

const findUser = async (id) => {
  return new Promise((resolve, reject) => {
    userModel.findById(id, 'password email', (err, user) => {
      utils.itemNotFound(err, user, reject, 'USER_DOES_NOT_EXIST')
      resolve(user)
    })
  })
}

const passwordsDoNotMatch = async () => {
  return new Promise((resolve) => {
    resolve(utils.buildErrObject(409, 'WRONG_PASSWORD'))
  })
}

const changePasswordInDB = async (id, req) => {
  return new Promise((resolve, reject) => {
    userModel.findById(id, '+password', (err, user) => {
      utils.itemNotFound(err, user, reject, 'NOT_FOUND')

      // Assigns new password to user
      user.password = req.newPassword

      // Saves in DB
      user.save((error) => {
        if (err) {
          reject(utils.buildErrObject(422, error.message))
        }
        resolve(utils.buildSuccObject('PASSWORD_CHANGED'))
      })
    })
  })
}

exports.getProfile = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.user._id)
    const profile = await getProfileFromDB(id)
    const takenBooks = await getTakenBooks(id)
    const takenBooksArr = takenBooks.map(b => ({
      id: b._id, name: b.name, isbn: b.isbn, returnBy: b.returnBy
    }))
    res.status(200).json({ ...profile['_doc'], books: takenBooksArr })
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.user._id)
    req = matchedData(req)
    res.status(200).json(await updateProfileInDB(req, id))
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.changePassword = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.user._id)
    const user = await findUser(id)
    req = matchedData(req)
    const isPasswordMatch = await auth.checkPassword(req.oldPassword, user)
    if (!isPasswordMatch) {
      utils.handleError(res, await passwordsDoNotMatch())
    } else {
      // all ok, proceed to change password
      res.status(200).json(await changePasswordInDB(id, req))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}
