
const uploadUsers= require("../../services/uploadUsers/upload_users.service");

exports.bulk_register=async(req,res)=>{
    try{
           const result =
            await uploadUsers.bulk_register_service({
        filePath: req.file.path,
        tenantId: req.user.tenantId
      });

        return res.status(201).json(result); 
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}