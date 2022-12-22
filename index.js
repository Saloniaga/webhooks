const express = require("express");
const bp = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express().use(bp.json());
const token = process.env.WHATSAPP_TOKEN; //for sending request
let verifytoken = process.env.VERIFY_TOKEN; //for verifying webhook

app.listen(8000 || process.env.PORT, () => {
  console.log("webhook is listening");
});

app.get("/", (req, res) => {
  res.send("hey");
});

//SETUP WEBHOOK INITIALLY TO GET INFO ON VERIFICATION REQUEST PAYLOAD
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === verifytoken) {
      console.log("webhook veified");
      res.status(200).send(challenge);
    } else {
      console.log("token did not match");
      res.status(403);
    }
  }
});

app.post("/webhook", async (req, res) => {
  let body = req.body;
  console.log(JSON.stringify(body, null, 2)); //checking incoming webhook message
  // console.log("req consoled");

  if (body.object) {
    // console.log(body.entry[0].changes[0].value);
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        body.entry[0].changes[0].value.metadata.phone_number_id;
      //extracting phone number from webhook payload
      let from = body.entry[0].changes[0].value.messages[0].from;
      let msg_body = body.entry[0].changes[0].value.messages[0].text.body;

      console.log("from: " + from);
      console.log("received: " + msg_body);

      await axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v15.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "you message was: " + msg_body },
        },
        headers: { "Content-Type": "application/json" },
      });
      console.log("token: " + token);
      res.status(200).send("task done");
    } else {
      res.status(404).send("request format not correct");
    }
  }
});
