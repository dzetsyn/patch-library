const model = require('../models/book')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')


const getAllItemsFromDB = async () => {
  return new Promise((resolve, reject) => {
    model.find(
      {},
      '-updatedAt -createdAt',
      {
        sort: {
          name: 1
        }
      },
      (err, items) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message))
        }
        resolve(items)
      }
    )
  })
}

exports.getAllItems = async (req, res) => {
  try {
    res.status(200).json(await getAllItemsFromDB())
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.createItem = async (req, res) => {
  try {
    req = matchedData(req)
    console.log(req)
    //const doesCityExists = await cityExists(req.name)
    //if (!doesCityExists) {
    res.status(201).json(await db.createItem(req, model))
    //}
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.deleteItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}
