const express = require("express");
const dotenv = require("dotenv");
const { connectionToDB } = require("./config/db");
dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.get("/", (req, res) => {
  try {
    res.status(200).send({ mag: "Home page" });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

app.listen(PORT, () => {
  try {
    connectionToDB
      .then((res) => {
        console.log("connected to db");
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(`server is running on port${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});
