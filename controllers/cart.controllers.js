const { CartModel } = require("../models/cart.models");
const { UserModel } = require("../models/user.models");

const getAllCart = async (req, res) => {
    try {
      const userId = req.body.userId;
  
      const findUserIdInCartModel = await CartModel.find({ userId });

      if (findUserIdInCartModel.length === 0) {
        return res.status(401).send({ msg: "You need to add your cart in cartModel" });
      }
  
      const currentUserId = findUserIdInCartModel[0].userId;
      if (currentUserId !== userId) {
        return res.status(400).send({ msg: "You are not authorized to get other user's data" });
      }
      const cartData = await CartModel.find();
      res.status(200).send({ msg: "Get all cart", data: { cartData } });
    } catch (error) {
      res.status(400).send({ msg: error.message });
    }
  };
  
const createCart =async(req,res)=>{
    try {
       const userId = req.body.userId
       const {email} = req.body
       const userIdInUserModel = await UserModel.find({email})
       const userIdWhichIsStoreInUserModel   = userIdInUserModel[0]._id.toString()
       if(userIdWhichIsStoreInUserModel!==userId){
        return res.status(401).send({msg:"You are not authorized user"})
       }
       const cartData = new CartModel(req.body)
       await cartData.save()
       res.status(200).send({msg:"Cart added successfully",data:{cartData}})
    } catch (error) {
        res.status(400).send({ msg: error.message });
        
    }
}

const updateCart = async (req, res) => {
    try {
      const userId = req.body.userId;
      const { id } = req.params;
      const data = req.body;
  
      const findCartToUpdate = await CartModel.findById({ _id: id });
  
      if (!findCartToUpdate) {
        return res.status(401).send({ msg: "Cart not found, please add cart" });
      }
  
      if (userId !== findCartToUpdate.userId) {
        return res.status(400).send({ msg: "You are not authorized to update this data" });
      }
  
      const updateData = await CartModel.findByIdAndUpdate({ _id: id }, data);
  
      res.status(201).send({ msg: "Cart updated successfully", data: { updateData } });
    } catch (error) {
      res.status(400).send({ msg: error.message });
    }
  };
  
  const deleteCart = async (req, res) => {
    try {
      const userId = req.body.userId;
      const { id } = req.params;
  
      const findCartToDelete = await CartModel.findById(id);
  
      if (!findCartToDelete) {
        return res.status(404).send({ msg: "Cart not found" });
      }
  
      if (userId !== findCartToDelete.userId.toString()) {
        return res.status(403).send({ msg: "You are not authorized to delete this cart" });
      }
  
      await CartModel.findByIdAndDelete(id);
      res.status(200).send({ msg: "Cart deleted successfully" });
    } catch (error) {
      res.status(400).send({ msg: error.message });
    }
  };
  

module.exports = {getAllCart,createCart,updateCart,deleteCart}