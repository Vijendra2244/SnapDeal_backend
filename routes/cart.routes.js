const express = require("express");
const {
  getUserAllCartData,
  addCartInUserCartModel,
} = require("../controllers/cart.controllers");

const cartRouter = express.Router();

cartRouter.route("/").get(getUserAllCartData);
cartRouter.route("/addToCart").post(addCartInUserCartModel);

module.exports = { cartRouter };
