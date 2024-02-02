const express = require("express");
const dotenv = require("dotenv");
const { connectionToDB } = require("./config/db");
const { userRouter } = require("./routes/user.routes");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { productRouter } = require("./routes/product.routes");
const { auth } = require("./middleware/auth.middleware");

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());
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
app.use("/products", auth, productRouter);

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
