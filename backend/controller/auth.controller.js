const prisma = require("../config/prisma");

const {
    hashPassword
} = require("../utils/password");

const {
    comparePassword
} = require("../utils/password");

const {
    generateAccessToken
} = require("../utils/jwt");

exports.register = async (req, res) => {

    const {
        name,
        email,
        password,
        tenantId
    } = req.body;

    const existing = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existing)
        return res.status(400).json({
            message: "Email already exists"
        });

    const passwordHash =
        await hashPassword(password);

    const user =
        await prisma.user.create({

            data: {

                name,

                email,

                passwordHash,

                tenantId,

                role: "EMPLOYEE"

            }

        });

    res.json(user);

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