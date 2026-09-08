const {prisma}=require('../../prisma/client')
const crypto = require("crypto");
const { generateAccessToken } = require("../../utils/generateJWT");

exports.verificationOfPayment=async({ razorpay_order_id, razorpay_payment_id, razorpay_signature })=>{
    try{
        
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            throw new Error("Razorpay signature error")
        }

        const pending = await prisma.pendingSignup.findUnique({
            where: { razorpayOrderId: razorpay_order_id },
        });

        if (!pending) {
            throw new Error("Signup record not found")
        }

        if (pending.status === "completed") {
            throw new Error("This signup has already been completed")
        }

        // create tenant + admin atomically
        const result = await prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: { name: pending.companyName },
            });

            const admin = await tx.user.create({
                data: {
                    tenantId: tenant.id,
                    name: pending.adminName,
                    email: pending.adminEmail,
                    passwordHash: pending.passwordHash,
                    role: "TENANT_ADMIN"
                },
            });

            await tx.pendingSignup.update({
                where: { id: pending.id },
                data: { status: "completed" },
            });

            return { tenant, admin };
        });

        const token = generateAccessToken({
            userId: result.admin.id,
            tenantId: result.tenant.id,
            role: result.admin.role,
            email: result.admin.email,
        });

        return res.json( token );

    }catch(error){
        throw new Error(error.message || "Error in payment verification");
    }
}