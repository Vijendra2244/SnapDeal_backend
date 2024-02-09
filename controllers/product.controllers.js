const { ProductModel } = require("../models/product.models");
const { uploadOnCloudinary } = require("../utils/cloudinary.utils");

const getAllProducts = async (req, res) => {
  try {
    const query = req.query
    const products = await ProductModel.find(query);
    res
      .status(200)
      .send({
        status: "success",
        msg: "Get all products data",
        data: { products },
      });
  } catch (error) {
    res.status(400).send({ status: "fail", msg: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await ProductModel.findById(productId);
    if (!product) {
     
      return res.status(404).send({ status: "fail", msg: "Product not found" });
    }
    res.status(200).send({
      status: "success",
      msg: "Get product by ID",
      data: { product },
    });
  } catch (error) {
   
    res.status(400).send({ status: "fail", msg: error.message });
  }
};

const createdProducts = async (req, res) => {
  try {
    const productImageLocalPath = req.file?.path;
    if (!productImageLocalPath) {
      return res
        .status(401)
        .send({ status: "success", msg: "Product image is required" });
    }

    const productImage = await uploadOnCloudinary(productImageLocalPath);

    if (!productImage) {
      return res
        .status(401)
        .send({ status: "success", msg: "Product image is required" });
    }
    const { price, subtitle, shortDescription, category } = req.body;
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
      .send({
        status: "success",
        msg: "Product added successfully",
        data: { productDetails },
      });
  } catch (error) {
    res.status(400).send({ status: "fail", msg: error.message });
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
      .send({
        status: "success",
        msg: "Product updated successfully",
        data: { products },
      });
  } catch (error) {
    res.status(400).send({ status: "fail", msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const findDataToDelete = await findByIdAndDelete({ _id: id });
    res.status(200).send({
      status: "success",
      msg: "Product deleted successfully",
      data: { findDataToDelete },
    });
  } catch (error) {
    res.status(400).send({ status: "fail", msg: error.message });
  }
};
module.exports = {
  getAllProducts,
  createdProducts,
  updateProducts,
  deleteProduct,
  getProductById
};
