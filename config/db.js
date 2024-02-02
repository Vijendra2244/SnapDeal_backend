const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()

const connectionToDB = mongoose.connect(process.env.MONGODB_URL);

module.exports = { connectionToDB };
