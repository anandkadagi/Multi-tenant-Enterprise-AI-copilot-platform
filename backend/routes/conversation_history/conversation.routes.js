const express = require("express");
const router = express.Router(); 
const conversationController = require("../../controller/conversation_history/conversation.controller");

router.post("/conversations", conversationController.createConversation);
router.post("/conversations/:id/messages", conversationController.sendMessage);
router.get("/conversations/:id/messages", conversationController.getMessages);
router.get("/conversations", conversationController.listConversations);

module.exports = router;