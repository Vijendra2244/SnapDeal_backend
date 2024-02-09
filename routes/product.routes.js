const express = require("express");
const {
  getAllProducts,
  createdProducts,
  updateProducts,
  deleteProduct,
  getProductById,
} = require("../controllers/product.controllers");
const { upload } = require("../middleware/multer.middleware");
const { auth } = require("../middleware/auth.middleware");

const productRouter = express.Router();

productRouter.route("/").get(getAllProducts);
productRouter
  .route("/create")
  .post(upload.single("productImage"), auth, createdProducts);
productRouter.route("/updateProduct/:id").patch(auth, updateProducts);
productRouter.route("/deleteProduct/:id").delete(auth, deleteProduct);
productRouter.route("/getById/:id").get(getProductById);

module.exports = { productRouter };
