// services/subscription/subscription.service.js
const { prisma } = require("../../prisma/client");
const razorpay = require("../../utils/razorpay");
const crypto = require("crypto");

exports.getSubscriptionState = async (tenantId) => {
    const subscription = await prisma.subscription.findUnique({
        where: { tenantId },
    });

    if (!subscription) {
        return { valid: false, reason: "no_subscription" };
    }

    if (subscription.status === "cancelled") {
        return { valid: false, reason: "cancelled", subscription };
    }

    if (new Date(subscription.expiresAt) < new Date()) {
        return { valid: false, reason: "expired", subscription };
    }

    return { valid: true, subscription };
};

exports.markExpiredSubscriptions = async () => {
    const result = await prisma.subscription.updateMany({
        where: {
            status: "active",
            expiresAt: { lt: new Date() },
        },
        data: { status: "expired" },
    });

    if (result.count > 0) {
        console.log(`Marked ${result.count} subscriptions as expired`);
    }
    return result.count;
};


exports.initiateRenewal = async (tenantId) => {
    const subscription = await prisma.subscription.findUnique({ where: { tenantId } });

    if (!subscription) {
        throw new Error("No subscription found for this company");
    }

    const amount = parseInt(process.env.SUBSCRIPTION_AMOUNT_INR, 10);

    const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `renewal_${tenantId}_${Date.now()}`,
    });

    return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
    };
};

exports.verifyRenewal = async ({ tenantId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new Error("Razorpay signature verification failed");
    }

    const subscription = await prisma.subscription.findUnique({ where: { tenantId } });

    if (!subscription) {
        throw new Error("No subscription found for this company");
    }

    // idempotency guard — don't extend twice for the same payment
    if (subscription.razorpayPaymentId === razorpay_payment_id) {
        return { expiresAt: subscription.expiresAt };
    }

    // extend from whichever is later: now, or the current expiry (covers early renewals)
    const base = subscription.expiresAt > new Date() ? new Date(subscription.expiresAt) : new Date();
    const expiresAt = new Date(base);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const updated = await prisma.subscription.update({
        where: { tenantId },
        data: {
            status: "active",
            expiresAt,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
        },
    });

    return { expiresAt: updated.expiresAt };
};