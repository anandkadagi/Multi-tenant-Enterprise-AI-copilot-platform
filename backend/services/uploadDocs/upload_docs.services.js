const {prisma}=require('../../prisma/client')

exports.saveDocs=async({userId,tenantId,file, response})=>{
    try{
         await prisma.document.create({
            data: {
                tenantId,
                name: file.originalname,
                uploadedBy: userId,
                chunks: response.data.chunks || 0,
                status: response.data.stored ? "processed" : "failed",
            },
        });
    }catch(error){
        throw new Error(error.message || "Error in save docs");
    }
}

exports.listDocuments=async ({tenantId})=>{
    try{
        const documents = await prisma.document.findMany({
            where: { tenantId },
            orderBy: { createdAt: "desc" },
        });
        return documents;
    }catch(error){
        throw new Error(error.message || "Error in list docs");
    }
}