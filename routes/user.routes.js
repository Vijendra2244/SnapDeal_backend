const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  requestForOtp,
  otpVerify,
  forgetPassword,
} = require("../controllers/user.controllers");

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/resetpassword").post(resetPassword);
userRouter.route("/otpRequest").post(requestForOtp);
userRouter.route("/otpVerify").post(otpVerify);
userRouter.route("/forgotPassword").post(forgetPassword);

module.exports = { userRouter };
