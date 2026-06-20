

const authService = require("../services/auth/auth.service");

exports.register_company = async (req, res) => {

    try {

        const result =
            await authService.register_company(req.body);

        return res.status(201).json(result);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

};

exports.register = async (req, res) => {
    try {

        const result =
            await authService.register_user(req.body);

        return res.status(201).json(result);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
    
};



exports.login = async (req, res) => {
    try{
            const result=await authService.login(req.body);
            return res.status(201).json(result);
    }catch(error){
        return res.status(500).json({
            message: err.message
        });
    }

};

