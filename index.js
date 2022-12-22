const express = require("express");
const bp = require("body-parser");

const app = express().use(bp.json());

app.get("/", (req, res) => {
  res.send("hey");
});

app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  let mytoken = "strongtoken";
  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

app.listen(8000, () => {
  console.log("webhook is listening");
});
