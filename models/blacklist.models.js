const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema(
  {
    access_token: {
      type: String,
    },
  },
  { versionKey: false }
);

const BlackListModel = mongoose.model("Black", blacklistSchema);

module.exports = { BlackListModel };
