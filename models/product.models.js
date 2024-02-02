const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productImage: {
      type: String,
    },
    subTitle: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = { ProductModel };
