const express = require("express");
const { getAllCart, createCart, updateCart,deleteCart } = require("../controllers/cart.controllers");

const cartRouter = express.Router();

cartRouter.route("/").get(getAllCart);
cartRouter.route("/create").post(createCart);
cartRouter.route("/update/:id").patch(updateCart)
cartRouter.route("/delete:/id").delete(deleteCart)

module.exports = { cartRouter };
