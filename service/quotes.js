const mongoose = require("mongoose");

const quotesDB = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  book: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("quotesDB", quotesDB);
