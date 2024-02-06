const { CartModel } = require("../models/cart.models");
const mongoose = require("mongoose");
const { ProductModel } = require("../models/product.models");

const getUserAllCartData = async (req, res) => {
  const userDetails = req.user;
  try {
    const cartDataConnection = await CartModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userDetails.userId),
          isRemove: false,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: {
          path: "$productInfo",
        },
      },
    ]).exec();

    return res.status(200).send({
      status: "success",
      msg: "user cart data which is store in cart model",
      userProduct: cartDataConnection,
    });
  } catch (error) {
    return res
      .status(401)
      .send({ status: "fail", msg: "cartData error", error: error.message });
  }
};

const addCartInUserCartModel = async (req, res) => {
  const { productId } = req.body;
  const userDetails = req.user;
  try {
    const productExistOrNot = await ProductModel.exists({
      _id: new mongoose.Types.ObjectId(productId),
    });
    if (!productExistOrNot) {
      return res
        .status(400)
        .send({status:"fail", msg: "User product is not available" });
    }
    const availableCartInModelOrNot = await CartModel.findOne({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userDetails.userId),
    });

    if (availableCartInModelOrNot) {
      if (availableCartInModelOrNot.isRemove) {
        const updatedData = await CartModel.findByIdAndUpdate(
          { _id: availableCartInModelOrNot._id },
          { isRemove: false }
        );
        return res
          .status(201)
          .send({status:"success", msg: "products data add in cart successfully", productsData: updatedData });
      } else {
        return res
          .status(400)
          .send({status:"fail", msg: "product available all ready in cart" });
      }
    }

    const addProductToCart = new CartModel({
      userId: new mongoose.Types.ObjectId(userDetails.userId),
      productId: new mongoose.Types.ObjectId(productExistOrNot._id),
      isRemove:false
    });
    await addProductToCart.save();
    return res
      .status(201)
      .send({status:"success", msg: "product added", productData: addProductToCart });
  } catch (error) {
    return res
      .status(401)
      .send({status:"fail", msg: "addToCart error", error: error.message });
  }
};




module.exports = { getUserAllCartData ,addCartInUserCartModel };
