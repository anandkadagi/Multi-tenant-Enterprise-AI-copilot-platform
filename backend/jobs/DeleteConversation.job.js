const cron = require("node-cron");
const conversationService = require("../services/conversation_history/conversation.service");

// runs every hour, on the hour
cron.schedule("0 * * * *", async () => {
    try {
        await conversationService.deleteExpiredConversations();
    } catch (error) {
        console.error("Conversation cleanup failed:", error);
    }
});