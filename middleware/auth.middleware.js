const jwt = require("jsonwebtoken");
const{ BlackListModel} = require("../models/blacklist.models");
const dotenv = require("dotenv");
dotenv.config();

const auth = async (req, res, next) => {
  const access_token = req.cookies["access_token"];
  const refresh_token = req.cookies["refresh_token"];
  console.log(req.body)
  try {
    const isBlackListedToken = await BlackListModel.findOne({
      access_token: access_token,
    });

    if (isBlackListedToken) {
      return res.status(400).send({status:"fail",msg:"Token is blacklisted,please login again"});
    }

    jwt.verify(access_token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
      const cookiesOption = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      }
      if (err) {
        if (err.message === "jwt expired") {
          jwt.verify(
            refresh_token,
            process.env.REFRESH_SECRET_KEY,
            async (err, refreshDecoded) => {
              if (err) {
                return res
                  .status(400)
                  .send({status:"fail",msg:"Refresh token is invalid or expired please login again"});
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

                res.cookie("access_token", access_token,cookiesOption);
                next();
              }
            }
          );
        }
      } else {
         req.user = decoded
        next();
      }
    });
  } catch (error) {
    res.status(400).send({status:"fail",msg:"Please login again"});
  }
};

module.exports = { auth };
