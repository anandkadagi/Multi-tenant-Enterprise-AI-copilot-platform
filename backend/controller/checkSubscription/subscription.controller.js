// controllers/subscription.controller.js
const subscriptionService = require("../../services/subscription/subscription.services");

exports.getStatus = async (req, res) => {
    try {
        const { tenantId } = req.user;
        const state = await subscriptionService.getSubscriptionState(tenantId);

        return res.json({
            valid: state.valid,
            reason: state?.reason ?? null,
            plan: state.subscription?.plan ?? null,
            status: state.subscription?.status ?? null,
            expiresAt: state.subscription?.expiresAt ?? null,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.initiateRenewal = async (req, res) => {
    try {
        const { tenantId } = req.user;
        const order = await subscriptionService.initiateRenewal(tenantId);
        return res.json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.verifyRenewal = async (req, res) => {
    try {
        const { tenantId } = req.user;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment verification fields" });
        }

        const result = await subscriptionService.verifyRenewal({
            tenantId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        return res.json({ success: true, expiresAt: result.expiresAt });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};