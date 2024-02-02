const { BlackListModel } = require("../models/blacklist.models");
const { UserModel } = require("../models/user.models");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, mobilenumber } = req.body;
    const user = new UserModel({ username, email, password, mobilenumber });
    await user.save();
    res.status(200).send({ msg: "User has been created successfully" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUserWithMail = await UserModel.findOne({ email });

    const passwordValidation = await findUserWithMail.comparePasswordIsSame(
      password
    );

    if (!passwordValidation) {
      return res.status(401).send({ mag: "Password is incorrect" });
    }

    const access_token = await findUserWithMail.generateAccessToken();
    const refresh_token = await findUserWithMail.generateRefreshToken();

    res.cookie("access_token", access_token);
    res.cookie("refresh_token", refresh_token);

    res.status(200).send({
      msg: "User login successfully",
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const access_token = req.cookies["access_token"];
    const findToken = await BlackListModel.find({ access_token });

    if (findToken.length > 0) {
      return res.status(401).send({ msg: "You are already logged out" });
    }

    const blackListToken = new BlackListModel({ access_token });
    await blackListToken.save();
    res.status(200).send({ msg: "User logged out successfully" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, email } = req.body;
    const findUserForResetPassword = await UserModel.findOne({ email });

    if (!findUserForResetPassword) {
      return res.status(401).send({ msg: "User not found" });
    }

    const oldPasswordValidation =
      await findUserForResetPassword.comparePasswordIsSame(oldPassword);

    if (!oldPasswordValidation) {
      return res.status(401).send({ msg: "Your old password is incorrect" });
    }

    findUserForResetPassword.password = newPassword;
    await findUserForResetPassword.save({ validateBeforeSave: false });
    res.status(201).send({ mag: "Your password changed successfully" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
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
      return res.status(400).send({ msg: "User not found by this email" });
    }

    //now generate otp
    const otp = generateFourDigitOTP();

    await saveOTPToUserDocument(findUserWithThisEmail._id, otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vijuuuchouhan@gmail.com",
        pass: "Vije@8899",
      },
    });

    const mailOptions = {
      from: "vijuuuchouhan@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    res.status(200).send({ msg: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  requestForOtp,
};
