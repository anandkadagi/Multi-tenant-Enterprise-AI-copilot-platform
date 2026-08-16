const axios = require("axios");
const conversationService = require("../../services/conversation_history/conversation.service");

exports.createConversation = async (req, res) => {
    try {
        const { userId, tenantId } = req.user;
        const conversation = await conversationService.createConversation(userId, tenantId);
        return res.json({ conversationId: conversation.id });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { query } = req.body;
        const { id: conversationId } = req.params;
        const { id:userId, tenantId } = req.user;

        if (!query) {
            return res.status(400).json({ message: "query is required" });
        }

        const history = await conversationService.getHistory(conversationId, userId, tenantId);

        const response = await axios.post("http://localhost:8000/injection/chat", {
            query,
            tenantId,
            userId,
            history
        });

        const { answer, citations } = response.data;

        await conversationService.appendMessage(conversationId, "user", query);
        await conversationService.appendMessage(conversationId, "assistant", answer);

        return res.json({ answer, citations });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const { id: userId, tenantId } = req.user;

        const history = await conversationService.getHistory(conversationId, userId, tenantId);
        return res.json({ messages: history });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.listConversations = async (req, res) => {
    try {
        const { id: userId, tenantId } = req.user;
        const conversations = await conversationService.listActiveConversations(userId, tenantId);
        return res.json({ conversations });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};