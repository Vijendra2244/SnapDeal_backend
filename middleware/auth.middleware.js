const jwt = require("jsonwebtoken");
const BlackListModel = require("../models/blacklist.models");
const dotenv = require("dotenv");
dotenv.config();

const auth = async (req, res, next) => {
  const access_token = req.cookies["access_token"];
  const refresh_token = req.cookies["refresh_token"];

  try {
    const isBlackListedToken = await BlackListModel.exists({
      token: access_token,
    });

    if (isBlackListedToken) {
      return res.status(400).send("Token is expired, please login again");
    }

    jwt.verify(access_token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.message === "jwt expired") {
          jwt.verify(
            refresh_token,
            process.env.REFRESH_SECRET_KEY,
            async (err, refreshDecoded) => {
              if (err) {
                return res
                  .status(400)
                  .send("Refresh token is invalid or expired");
              } else {
                const access_token = jwt.sign(
                  {
                    userId: refreshDecoded.userId,
                    username: refreshDecoded.username,
                  },
                  process.env.ACCESS_SECRET_KEY,
                  {
                    expiresIn: process.env.ACCESS_SECRET_KEY_EXPIRESIN,
                  }
                );

                res.cookie("access_token", access_token);
                res.status(200).send("user access");
                next();
              }
            }
          );
        }
      } else {
        req.body.userId = decoded.userId;
        req.body.username = decoded.username;
        next();
      }
    });
  } catch (error) {
    res.status(400).send("Please login again");
  }
};

module.exports = { auth };
