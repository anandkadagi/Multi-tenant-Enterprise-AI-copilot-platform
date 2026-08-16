const prisma = new PrismaClient();
const {prisma}=require('../../prisma/client')
const MAX_TURNS = 10;

exports.ensureConversation = async (conversationId, userId, companyId) => {
    await prisma.conversation.upsert({
        where: { id: conversationId },
        update: {},
        create: {
            id: conversationId,
            userId,
            companyId
        }
    });
};

exports.getHistory = async (conversationId, userId, companyId) => {
    
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
            companyId
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
};

exports.appendMessage = async (conversationId, role, content) => {
    await prisma.conversationMessage.create({
        data: {
            conversationId,
            role,
            content
        }
    });
};