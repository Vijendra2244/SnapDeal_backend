const express = require("express");
const {
  getUserAllCartData,
  addCartInUserCartModel,
  deleteCartInCartModel
} = require("../controllers/cart.controllers");

const cartRouter = express.Router();

cartRouter.route("/").get(getUserAllCartData);
cartRouter.route("/addToCart").post(addCartInUserCartModel);
cartRouter.route("/deleteCart").post(deleteCartInCartModel)

module.exports = { cartRouter };
