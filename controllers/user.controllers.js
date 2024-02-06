const { BlackListModel } = require("../models/blacklist.models");
const { UserModel } = require("../models/user.models");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { uploadOnCloudinary } = require("../utils/cloudinary.utils.js");
dotenv.config();

const registerUser = async (req, res) => {
  try {
    const { username, email, password, mobilenumber } = req.body;

    const passwordValidation =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const passwordMatchedOrNot = passwordValidation.test(password);
    if (!passwordMatchedOrNot) {
      return res.status(401).send({
        status: "fail password",
        msg: "Password must have at least one uppercase character, one number, one special character, and be at least 8 characters long.",
      });
    }

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      return res
        .status(401)
        .send({ status: "fail avatar", msg: "Avatar file is required" });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      return res
        .status(401)
        .send({ status: "fail avatar", msg: "Avatar file is required" });
    }

    const user = new UserModel({
      username,
      email,
      password,
      mobilenumber,
      avatar: avatar ? avatar.url : null,
    });
    await user.save();
    res
      .status(200)
      .send({ status: "success", msg: "User has been created successfully" });
  } catch (error) {
    res.status(400).send({ status: "fail", msg: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    const findUserWithMail = await UserModel.findOne({ email });

    const passwordValidation = await findUserWithMail.comparePasswordIsSame(
      password
    );

    if (!passwordValidation) {
      return res
        .status(401)
        .send({ status: "fail", msg: "Password is incorrect" });
    }

    const access_token = await findUserWithMail.generateAccessToken();
    const refresh_token = await findUserWithMail.generateRefreshToken();

    res.cookie("access_token", access_token, cookiesOption);
    res.cookie("refresh_token", refresh_token, cookiesOption);

    res.status(200).send({
      status: "success",
      msg: "User login successfully",
    });
  } catch (error) {
    res.status(400).send({ status: "fail", msg: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const access_token = req.cookies["access_token"];
    const findToken = await BlackListModel.findOne({ access_token });

    if (findToken) {
      return res
        .status(401)
        .send({ status: "fail", msg: "You are already logged out" });
    }

    const blackListToken = new BlackListModel({ access_token });
    await blackListToken.save();
    res
      .status(200)
      .send({ status: "success", msg: "User logged out successfully" });
  } catch (error) {
    res.status(400).send({ status: "fail", msg: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, email } = req.body;
    const findUserForResetPassword = await UserModel.findOne({ email });

    if (!findUserForResetPassword) {
      return res.status(401).send({ status: "fail", msg: "User not found" });
    }

    const oldPasswordValidation =
      await findUserForResetPassword.comparePasswordIsSame(oldPassword);

    if (!oldPasswordValidation) {
      return res
        .status(401)
        .send({ status: "fail", msg: "Your old password is incorrect" });
    }

    findUserForResetPassword.password = newPassword;
    await findUserForResetPassword.save({ validateBeforeSave: false });
    res
      .status(201)
      .send({ status: "success", msg: "Your password changed successfully" });
  } catch (error) {
    res.status(400).send({ status: "fail", msg: error.message });
  }
};

//generate 4 digit otp with the help of this function
const generateFourDigitOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

//create one function to update otp in user document

const saveOTPToUserDocument = async (userId, otp) => {
  await UserModel.findByIdAndUpdate(userId, { $set: { otp } });
};

const requestForOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const findUserWithThisEmail = await UserModel.findOne({ email });
    if (!findUserWithThisEmail) {
      return res
        .status(400)
        .send({ status: "fail", msg: "User not found by this email" });
    }

    //now generate otp
    const otp = generateFourDigitOTP();

    await saveOTPToUserDocument(findUserWithThisEmail._id, otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).send({ status: "success", msg: "opt send " });
  } catch (error) {
    res.status(200).send({ status: "fail", msg: error.message });
  }
};

const otpVerify = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const otpFindInUserModel = await UserModel.find({ email });

    if (!otpFindInUserModel) {
      return res.status(400).send({
        status: "success",
        msg: "User with this email not found please enter your correct mail",
      });
    }
    const otpWhichIsStoreInUserDocument = otpFindInUserModel[0].otp;

    if (otpWhichIsStoreInUserDocument == otp) {
      return res
        .status(201)
        .send({ status: "success", msg: "Otp verified successfully" });
    } else {
      return res
        .status(401)
        .send({ status: "fail", msg: "Invalid otp please enter correct otp" });
    }
  } catch (error) {
    res.status(200).send({ status: "fail", msg: error.message });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body;
    const findUserWithEmail = await UserModel.findOne({ email });
    if (!findUserWithEmail) {
      return res.status(400).send({ status: "fail", msg: "User not found" });
    }
    findUserWithEmail.password = newPassword;
    await findUserWithEmail.save();
    res
      .status(201)
      .send({ status: "success", msg: "Password reset successfully" });
  } catch (error) {
    res.status(200).send({ status: "fail", msg: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  requestForOtp,
  otpVerify,
  forgetPassword,
};
