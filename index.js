const express = require("express");
const dotenv = require("dotenv");
const { connectionToDB } = require("./config/db");
const { userRouter } = require("./routes/user.routes");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { productRouter } = require("./routes/product.routes");
const { auth } = require("./middleware/auth.middleware");
const { cartRouter } = require("./routes/cart.routes");
const { google } = require("googleapis");
const { UserModel } = require("./models/user.models");
const { GoogleModel } = require("./models/google.models");
const { orderRouter } = require("./routes/order.routes");

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "https://snapdealbackend-production.up.railway.app",
      "https://snapdeal0101.netlify.app",
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  try {
    res.status(200).send({ status: "success", msg: "Home page of snapdeal" });
  } catch (error) {
    res.status(400).send({ status: "fail", err: error.message });
  }
});

//Google Oauth

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scopes = ["https://www.googleapis.com/auth/userinfo.email"];
const redirectUrl =
  "https://snapdealbackend-production.up.railway.app/google/callback";

app.get("/login", async (req, res) => {
  try {
    const authUrl = getAuthUrl();
    res.redirect(authUrl);
  } catch (error) {
    console.error(error);
  }
});

app.get("/google/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const tokens = await exchangeCodeForTokens(code);
    const email = await getUserEmail(tokens.access_token);
    const userAuthDetail = new GoogleModel({ email });
    await userAuthDetail.save();
    req.body = email;
    res.redirect("/");
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Error occurred during authentication");
  }
});

async function exchangeCodeForTokens(code) {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUrl
  );
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
}

async function getUserEmail(accessToken) {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUrl
  );
  oauth2Client.setCredentials({ access_token: accessToken });

  const userInfo = google.oauth2({ version: "v2", auth: oauth2Client });
  const { data } = await userInfo.userinfo.get();

  return data.email || "";
}

function getAuthUrl() {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUrl
  );
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  return authUrl;
}

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/carts", auth, cartRouter);
app.use("/payment",orderRouter)

app.listen(PORT, () => {
  try {
    connectionToDB
      .then((res) => {
        console.log("connected to db");
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(`server is running on port ${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});
