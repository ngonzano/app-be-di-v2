const express = require("express");

const router = express.Router();

const {
//   createPayment,
  validatePayment,
  paymentForm,
} = require("../controllers/izipayController");

// router.post("/createPayment", createPayment);
router.post("/validatePayment", validatePayment);//pidepe-444e2ee958a2.herokuapp.com/validatePayment

router.post("/paymentForm", paymentForm)

module.exports = { paymentRouter: router };