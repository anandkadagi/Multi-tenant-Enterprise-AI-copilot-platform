// middlewares/checkSubscription.middleware.js
const subscriptionService = require("../services/subscription/subscription.service");

const checkSubscription = async (req, res, next) => {
    try {
        const { tenantId } = req.user;

        const state = await subscriptionService.getSubscriptionState(tenantId);

        if (!state.valid) {
            return res.status(402).json({
                message:
                    state.reason === "expired"
                        ? "Your subscription has expired"
                        : "No active subscription found",
                reason: state.reason,
                expiresAt: state.subscription?.expiresAt ?? null,
            });
        }

        req.subscription = state.subscription;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = checkSubscription;