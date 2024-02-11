const mongoose = require("mongoose");

const googleUserShema = mongoose.Schema(
  {
    email: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  { versionKey: false }
);

const GoogleModel = mongoose.model("Google", googleUserShema);

module.exports = { GoogleModel };
