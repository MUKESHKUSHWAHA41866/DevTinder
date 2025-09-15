const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount,membershipDuration } = require("../utils/constants");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')


paymentRouter.post("/payment/create",userAuth, async (req, res) =>{
    try {
         const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
     const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    // Save it in my database
    console.log(order);

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    } catch (err) {
         return res.status(500).json({ msg: err.message });
    }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    console.log("Webhook Called");
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      console.log("INvalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    // const user = await User.findOne({ _id: payment.userId });
    // user.isPremium = true;
    // user.membershipType = payment.notes.membershipType;
    // console.log("User saved");

    // await user.save();


    const user = await User.findById(payment.userId);

if (user) {
  const plan = (payment.notes.membershipType || "").toLowerCase();
  const months = membershipDuration[plan] || 0;

  if (months > 0) {
    const now = new Date();

    // if user already has active premium, extend from current validity
    const baseDate =
      user.membershipValidity && new Date(user.membershipValidity) > now
        ? new Date(user.membershipValidity)
        : now;

    const newValidity = new Date(baseDate);
    newValidity.setMonth(newValidity.getMonth() + months);

    user.isPremium = true;
    user.membershipType = plan;
    user.membershipValidity = newValidity;

    await user.save();
    console.log(
      `✅ User ${user._id} upgraded to ${plan}, valid till ${newValidity}`
    );
  }
}


    // Update the user as premium

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    // return success response to razorpay

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
//   const user = req.user.toJSON();
//   console.log(user);
//   if (user.isPremium) {
//     return res.json({ ...user });
//   }
//   return res.json({ ...user });
// });

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  const now = new Date();

  let isActive = false;
  if (user.isPremium && user.membershipValidity && new Date(user.membershipValidity) > now) {
    isActive = true;
  }

  return res.json({ ...user, isPremium: isActive });
});

module.exports = paymentRouter;