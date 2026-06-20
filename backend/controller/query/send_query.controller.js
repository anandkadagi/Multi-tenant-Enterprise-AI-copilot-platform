const query_service=require("../../services/query/send_query.service")

exports.send_query_controller =async (req, res)=>{
    try{
        const result=await query_service.send_query_service(req.body);
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}