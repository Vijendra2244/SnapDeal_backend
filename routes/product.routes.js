const express = require("express");
const {
  getAllProducts,
  createdProducts,
  updateProducts,
  deleteProduct,
} = require("../controllers/product.controllers");
const { upload } = require("../middleware/multer.middleware");

const productRouter = express.Router();

productRouter.route("/").get(getAllProducts);
productRouter
  .route("/create")
  .post(upload.single("productImage"), createdProducts);
productRouter.route("/updateProduct/:id").patch(updateProducts);
productRouter.route("/deleteProduct/:id").delete(deleteProduct);

module.exports = { productRouter };
