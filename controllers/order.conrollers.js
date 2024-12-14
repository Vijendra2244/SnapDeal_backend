// const dotenv = require("dotenv")
// dotenv.config()
// const crypto=require("crypto");
// const Razorpay = require("razorpay");
// const { OrderModel } = require("../models/order.models");


// //razorpay configuaration

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


// const paymentCheckout = async(req, res) => {
//   const { name, amount } = req.body;
//   const order = await razorpay.orders.create({
//     amount: Number(amount*100),
//     currency: "INR",
//   });
//   await OrderModel.create({
//     order_id:order.id,
//     name:name,
//     amount:amount
//   });
//   console.log(order)
//   res.json({order})
// }

// const paymentVerification = async (req, res) => {
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

//     const body_data=razorpay_order_id+"|"+razorpay_payment_id;

//     const expect= crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
//     .update(body_data).digest("hex");

//     const isValid=expect===razorpay_signature;

//     if(isValid){
//         await OrderModel.findOne({order_id:razorpay_order_id},{
//             $set:{razorpay_payment_id,razorpay_order_id,razorpay_signature}
//         })
//         res.redirect(`http://localhost:5173/success?payment_id=${razorpay_order_id}`)
//         return
//     }else{
//         res.redirect("https://snapdeal0101.netlify.app/")
//         return
//     }
// }
// module.exports = {paymentCheckout,paymentVerification};


const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { OrderModel } = require("../models/order.models");

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentCheckout = async (req, res) => {
  try {
    console.log("Payment checkout initiated");
    const { name, amount } = req.body;
    console.log(`Received request with name: ${name}, amount: ${amount}`);

    const order = await razorpay.orders.create({
      amount: Number(amount * 100),
      currency: "INR",
    });
    console.log("Order created on Razorpay:", order);

    await OrderModel.create({
      order_id: order.id,
      name: name,
      amount: amount,
    });
    console.log("Order saved to database");

    res.json({ order });
  } catch (error) {
    console.error("Error in paymentCheckout:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const paymentVerification = async (req, res) => {
  try {
    console.log("Payment verification initiated");
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    console.log("Received verification data:", {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    const body_data = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Generated body data for verification:", body_data);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body_data)
      .digest("hex");

    console.log("Expected signature:", expectedSignature);

    const isValid = expectedSignature === razorpay_signature;
    console.log("Signature validation result:", isValid);

    if (isValid) {
      console.log("Payment is valid. Updating database.");

      await OrderModel.findOneAndUpdate(
        { order_id: razorpay_order_id },
        {
          $set: {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          },
        }
      );

      console.log("Database updated successfully");
      res.redirect(`http://localhost:5173/success?payment_id=${razorpay_order_id}`);
    } else {
      console.warn("Invalid payment signature. Redirecting to failure page.");
      res.redirect("https://snapdeal0101.netlify.app/");
    }
  } catch (error) {
    console.error("Error in paymentVerification:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { paymentCheckout, paymentVerification };
