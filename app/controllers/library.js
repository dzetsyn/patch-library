const model = require('../models/book')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')


const takenBooks = async (userId) => {
  const item = await db.getItems({ query: {} }, model, { takenBy: userId });
  return item.totalDocs;
}

const overdueBooks = async (userId) => {
  const overdueItems = await db.getItems({ query: {} }, model, { takenBy: userId, returnBy: { $lte: new Date().toISOString() } });
  return overdueItems.totalDocs;
}

const allOverdueBooks = async () => {
  const overdueItems = await db.getItems({ query: {} }, model, { returnBy: { $lte: new Date().toISOString() } });
  return overdueItems;
}

const bookAvailable = async (bookId) => {
  const book = await db.getItem(bookId, model);
  if (book && book.returnBy === null && book.takenBy === null) return true;
  return false;
}

exports.checkoutBook = async (req, res) => {
  try {
    const userId = await utils.isIDGood(req.user._id);
    req = matchedData(req);
    const { bookId } = req;

    // check overdue items
    const amountOverdueBooks = await overdueBooks(userId);
    if (amountOverdueBooks > 0) return res.send("overdue!");

    // check the amount of taken books
    const amountTakenBooks = await takenBooks(userId);
    if (amountTakenBooks >= 3) return res.send('too much taken');

    // book availability to check out
    const available = await bookAvailable(bookId);
    if (!available) return res.send('not available');

    const now = new Date();
    const returnBy = new Date(now.setDate(now.getDate() + 14)); // now() + 14 days

    res.status(201).json(await db.updateItem(bookId, model, { takenBy: userId, returnBy }))
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.returnBook = async (req, res) => {
  try {
    const userId = await utils.isIDGood(req.user._id);
    req = matchedData(req);
    const { bookId } = req;
    const amountTakenBooks = await takenBooks(userId);
    console.log(amountTakenBooks)
    if (amountTakenBooks > 3) {
      utils.handleError(res, utils.buildErrObject(422, 'error.message'))
    } else
      //res.send(amountTakenBooks);
      res.status(201).json(await db.updateItem(bookId, model, { takenBy: null, returnBy: null }))
  } catch (error) {
    utils.handleError(res, error)
  }
}


exports.overdueBooks = async (req, res) => {
  try {
    res.status(201).json(await allOverdueBooks())
  } catch (error) {
    utils.handleError(res, error)
  }
}
