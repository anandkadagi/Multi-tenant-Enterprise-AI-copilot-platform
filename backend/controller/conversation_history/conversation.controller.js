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
        },{ responseType: "stream" });

        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");

        let fullAnswer = "";
        let citations = [];

        // const { answer, citations } = response.data;

        // await conversationService.appendMessage(conversationId, "user", query);
        // await conversationService.appendMessage(conversationId, "assistant", answer);

        // return res.json({ answer, citations });

        response.data.on("data", (chunk) => {
            const text = chunk.toString();
            if (text.includes("__CITATIONS__")) {
                // split the answer text from the citations marker
                const [answerPart, citationsPart] = text.split("__CITATIONS__");
                if (answerPart) {
                    fullAnswer += answerPart;
                    res.write(answerPart);   // forward remaining answer text to client
                }
                citations = JSON.parse(citationsPart);
                // don't forward the raw marker/JSON to the client
            } else {
                fullAnswer += text;
                res.write(text);   // forward this chunk to the client immediately
            }
        });

        response.data.on("end", async () => {
            // save the complete answer to DB now that streaming is done
            await conversationService.appendMessage(conversationId, "user", query);
            await conversationService.appendMessage(conversationId, "assistant", fullAnswer);
            res.write(`\n\n__CITATIONS__${JSON.stringify(citations)}`);  
            res.end();   // close the response to the client
        });

        response.data.on("error", (err) => {
            console.error("Stream error:", err);
            res.end();
        });
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