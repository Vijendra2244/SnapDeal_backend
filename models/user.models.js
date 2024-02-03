const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobilenumber: {
      type: Number,
      required: true,
    },
    otp: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const hashedPasswordByBcrypt = await bcrypt.hash(this.password, 5);
    this.password = hashedPasswordByBcrypt;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePasswordIsSame = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      username: this.username,
    },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: process.env.ACCESS_SECRET_KEY_EXPIRESIN }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: process.env.REFRESH_SECRET_KEY_EXPIRESIN }
  );
};

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
