const { ProductModel } = require("../models/product.models");
const { uploadOnCloudinary } = require("../utils/cloudinary.utils");

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).send({ msg: "Get all products data", data: { products } });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

const createdProducts = async (req, res) => {
  try {
    const productLocalPath = req.file?.path;
    if (!productLocalPath) {
      throw new Error("product image file is required");
    }

    const productImage = await uploadOnCloudinary(productLocalPath);

    if (!productImage) {
      throw new Error("product image file is required");
    }
    const { price, subtitle, shortDescription,category } = req.body;
    const productDetails = new ProductModel({
      price,
      subtitle,
      category,
      shortDescription,
      productImage: productImage ? productImage.url : null,
    });
    await productDetails.save();
    res
      .status(200)
      .send({ mag: "Product added successfully", data: { productDetails } });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

const updateProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const productsDetailsToUpdate = req.body;
    const products = await ProductModel.findByIdAndUpdate(
      { _id: id },
      productsDetailsToUpdate
    );
    res
      .status(201)
      .send({ msg: "Product updated succeefullt", data: { products } });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const findDataToDelete = await findByIdAndDelete({ _id: id });
    res
      .status(200)
      .send({
        msg: "Product deleted successfully",
        data: { findDataToDelete },
      });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};
module.exports = {
  getAllProducts,
  createdProducts,
  updateProducts,
  deleteProduct,
};
