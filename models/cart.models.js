const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    username: {
      type: String,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product"
    }
  },
  { versionKey: false }
);

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = { CartModel };
