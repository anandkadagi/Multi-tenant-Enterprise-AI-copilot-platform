// jobs/expireSubscriptions.job.js
const cron = require("node-cron");
const subscriptionService = require("../services/subscription/subscription.services");

// every day at 00:30
cron.schedule("30 0 * * *", async () => {
    try {
        await subscriptionService.markExpiredSubscriptions()
    } catch (error) {
        console.error("Subscription expiry job failed:", error);
    }
});