const express = require("express");
const router = express.Router();
const registerCompany = require("../../controller/registerCompany/register.controller");
const verifyPayment=require("../../controller/registerCompany/verificationOfPayment.controller")

router.post("/initiate", registerCompany.initiateSignup);

router.post("/verify", verifyPayment.verificationOfPayment);

module.exports = router;