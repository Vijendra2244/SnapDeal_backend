const dotenv = require("dotenv")
dotenv.config()
const crypto=require("crypto");
const Razorpay = require("razorpay");
const { OrderModel } = require("../models/order.models");


//razorpay configuaration

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const paymentCheckout = async(req, res) => {
  const { name, amount } = req.body;
  const order = await razorpay.orders.create({
    amount: Number(amount*100),
    currency: "INR",
  });
  await OrderModel.create({
    order_id:order.id,
    name:name,
    amount:amount
  });
  console.log(order)
  res.json({order})
}

const paymentVerification = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const body_data=razorpay_order_id+"|"+razorpay_payment_id;

    const expect= crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
    .update(body_data).digest("hex");

    const isValid=expect===razorpay_signature;

    if(isValid){
        await OrderModel.findOne({order_id:razorpay_order_id},{
            $set:{razorpay_payment_id,razorpay_order_id,razorpay_signature}
        })
        res.redirect(`http://localhost:5173/success?payment_id=${razorpay_order_id}`)
        return
    }else{
        res.redirect("https://snapdeal0101.netlify.app/")
        return
    }
}
module.exports = {paymentCheckout,paymentVerification};