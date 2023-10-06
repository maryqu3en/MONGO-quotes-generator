const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3030;

const quotesDB = require("./quotes");
const connectDB = () => {
  mongoose.connect(
    "mongodb+srv://soubihmeriem:stayingforever@quotes-cluster.dydexmo.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

let quotes = fs.readFileSync(path.resolve(__dirname, "data.json"), "utf-8");
quotes = JSON.parse(quotes);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

quotes.forEach(async (quote) => {
  try {
    await quotesDB.create({
      id: quote.id,
      book: quote.book,
      author: quote.author,
      quote: quote.quote,
    });
  } catch (error) {
    console.log("Error", error);
  }
});

// returns a list of quotes
app.get("/api/quotes", (req, res) => {
  return res.status(200).json({
    quotes,
  });
});

// get random quote
app.get("/api/quotes/random", (req, res) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return res.status(200).json({
    randomQuote,
  });
});

// return a single quote
app.get("/api/quotes/:id", (req, res) => {
  const { id } = req.params;
  const quote = quotes.find((quote) => quote.id == id);

  if (!quote) {
    return res.status(404).json({
      message: `Quote not found - ${id}`,
    });
  }

  return res.status(200).json({
    quote,
  });
});

app.use("*", (req, res) => {
  return res.status(404).json({
    message: "Page not found",
  });
});

app.listen(PORT, () => {
  console.log(`server running in http://localhost:${PORT}`);
  connectDB.then(() => console.log("connected"));
});
