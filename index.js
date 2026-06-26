const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
