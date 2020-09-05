const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')


const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    isbn: {
      type: String,
      required: true
    },
    takenBy: {
      type: mongoose.Schema.ObjectId,
      default: null,
    },
    returnBy: {
      type: Date,
      default: null,
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
BookSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Book', BookSchema)
