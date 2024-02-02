const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  requestForOtp,
} = require("../controllers/user.controllers");

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/resetpassword").post(resetPassword);
userRouter.route("/otprequest").post(requestForOtp);

module.exports = { userRouter };
