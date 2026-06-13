const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {

    return jwt.sign(
        {
            userId: user.id,
            tenantId: user.tenantId,
            role: user.role,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );

};

module.exports = {
    generateAccessToken
};