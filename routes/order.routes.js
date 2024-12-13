const express  = require("express")
const { paymentCheckout, paymentVerification } = require("../controllers/order.conrollers")

const orderRouter = express.Router()


// orderRouter.route("/checkout").post(paymentCheckout)
// orderRouter.route("/verification").post(paymentVerification)

module.exports  ={orderRouter}