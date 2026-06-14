

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

    const {
        email,
        password
    } = req.body;

    const user =
        await prisma.user.findUnique({

            where: {
                email
            }

        });

    if (!user)
        return res.status(401).json({
            message: "Invalid credentials"
        });

    const valid =
        await comparePassword(
            password,
            user.passwordHash
        );

    if (!valid)
        return res.status(401).json({
            message: "Invalid credentials"
        });

    const token =
        generateAccessToken(user);

    res.json({
        token
    });

};

exports.bulk_register=async(req,res)=>{
    try{
           const result =
            await authService.bulk_register_service({
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

exports.set_password_controller = async(req,res)=>{
    try{
            const result =
            await authService.set_password_service(req.body);

            return res.status(201).json(result);
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}