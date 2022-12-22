const express = require("express");
const bp = require("body-parser");

const app = express().use(bp.json());

app.get("/", (req, res) => {
  res.send("hey");
});

app.listen(8000, () => {
  console.log("webhook is listening");
});
