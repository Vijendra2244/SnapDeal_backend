const express = require("express");
const {
  getAllProducts,
  createdProducts,
  updateProducts,
  deleteProduct,
} = require("../controllers/product.controllers");
const { upload } = require("../middleware/multer.middleware");
const { auth } = require("../middleware/auth.middleware");

const productRouter = express.Router();

productRouter.route("/").get(auth, getAllProducts);
// productRouter
//   .route("/create")
//   .post(upload.single("productImage"), auth, createdProducts);
// productRouter.route("/updateProduct/:id").patch(auth, updateProducts);
// productRouter.route("/deleteProduct/:id").delete(auth, deleteProduct);

module.exports = { productRouter };
