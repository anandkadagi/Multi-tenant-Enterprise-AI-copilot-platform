
const {prisma}=require('../../prisma/client')
const MAX_TURNS = 10;
const CONVERSATION_TTL_HOURS = 24;

const getCutoffTime = () => new Date(Date.now() - CONVERSATION_TTL_HOURS * 60 * 60 * 1000);

exports.createConversation = async (userId, companyId) => {
    try{
        return prisma.conversation.create({
        data: { userId, companyId }
    });
    }catch(error){
        throw new Error(error.message || "Error in create conversation");
    }
    
};

exports.getHistory = async (conversationId, userId, companyId) => {
    try{
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
            companyId,
            createdAt: { gte: getCutoffTime() }
        },
        include: {
            messages: {
                orderBy: { createdAt: "asc" },
                take: MAX_TURNS * 2
            }
        }
    });

    if (!conversation) return [];

    return conversation.messages.map(m => ({
        role: m.role,
        content: m.content
    }));
}catch(error){
        throw new Error(error.message || "Error in get conversation history");
    }
};

exports.appendMessage = async (conversationId, role, content) => {
    try{
    await prisma.conversationMessage.create({
        data: { conversationId, role, content }
    });
}catch(error){
        throw new Error(error.message || "Error in append Message");
    }
};

exports.listActiveConversations = async (userId, companyId) => {
    try{
    return prisma.conversation.findMany({
        where: {
            userId,
            companyId,
            createdAt: { gte: getCutoffTime() }
        },
        orderBy: { createdAt: "desc" }
    });
}catch(error){
        throw new Error(error.message || "Error in List conversation");
    }
};

exports.deleteExpiredConversations = async () => {
    try{
    const result = await prisma.conversation.deleteMany({
        where: { createdAt: { lt: getCutoffTime() } }
    });
    console.log(`Deleted ${result.count} expired conversations`);
    return result.count;
}catch(error){
        throw new Error(error.message || "Error in delete conversation");
    }
};