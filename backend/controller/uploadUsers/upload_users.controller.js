
const uploadUsers= require("../../services/uploadUsers/upload_users.service");

exports.bulk_register=async(req,res)=>{
    try{
           const result =
            await uploadUsers.bulk_register_service({
        filePath: req.file.path,
        tenantId: "c1a7c4bb-44a7-4251-a3f7-5810f4843db5"
      });

        return res.status(201).json(result); 
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}