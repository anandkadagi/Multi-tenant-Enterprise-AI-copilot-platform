
const setPassword= require("../../services/setPassword/set_password.service");

exports.set_password_controller = async(req,res)=>{
    try{
            const result =
            await setPassword.set_password_service(req.body);

            return res.status(201).json(result);
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}