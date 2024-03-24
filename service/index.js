require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require("express");
const mongoose = require("mongoose");
// const path = require("path");
// const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3030;

const quotesDB = require("./quotes");
const connectDB = () =>
  mongoose.connect(
    process.env.DB_CONNECTION_STRING,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

// let quotes = fs.readFileSync(path.resolve(__dirname, "data.json"), "utf-8");
// quotes = JSON.parse(quotes);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// returns a list of quotes
app.get("/api/quotes", async (req, res) => {
  const quotes = await quotesDB.find();

  return res.status(200).json({
    quotes,
  });
});

// get random quote
app.get("/api/quotes/random", async (req, res) => {
  const count = await quotesDB.countDocuments();
  const random = Math.floor(Math.random() * count);
  const randomQuote = await quotesDB.findOne().skip(random);

  return res.status(200).json({
    randomQuote,
  });
});

// return a single quote
app.get("/api/quotes/:id", async (req, res) => {
  const { id } = req.params;
  const quote = await quotesDB.findOne({ id });

  if (!quote) {
    return res.status(404).json({
      message: `Quote not found - ${id}`,
    });
  }

  return res.status(200).json({
    quote
  });
});

app.use("*", (req, res) => {
  return res.status(404).json({
    message: "Page not found",
  });
});

connectDB()
  .then(() => {
    console.log("connected to database");
    app.listen(PORT, () => {
      console.log(`server running in http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));

// quotes.forEach(async (quote) => {
//   try {
//     await quotesDB.create({
//       id: quote.id,
//       book: quote.book,
//       author: quote.author,
//       quote: quote.quote,
//     });
//   } catch (error) {
//     console.log("Error", error);
//   }
// }); 
