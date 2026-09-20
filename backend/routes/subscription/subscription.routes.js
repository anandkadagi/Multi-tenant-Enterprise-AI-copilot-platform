const express = require("express");
const router = express.Router(); 
const subscriptionController=require("../../controller/checkSubscription/subscription.controller")
// Subscription Status
router.get("/status", subscriptionController.getStatus);

router.post("/renew", subscriptionController.initiateRenewal);

router.post("/renew/verify", subscriptionController.verifyRenewal);

module.exports = router;  