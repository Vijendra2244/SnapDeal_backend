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

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
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
app.use(
  cookieParser({
    httpOnly: true,
    secure: true,
    sameSite: "none",
  })
);

app.get("/", (req, res) => {
  try {
    res.status(200).send({ mag: "Home page" });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/carts", auth, cartRouter);

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
