

const registerCompany=require("../../services/registerCompany/register.services")

exports.initiateSignup = async (req, res) => {
    try {
        const { companyName, adminName, adminEmail, password } = req.body;

        if (!companyName || !adminName || !adminEmail || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result= await registerCompany.register({ companyName, adminName, adminEmail, password });

        return res.json(result);
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

