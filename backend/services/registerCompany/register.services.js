const {prisma}=require('../../prisma/client')
const bcrypt = require("bcrypt");
const razorpay = require("../../utils/razorpay");

exports.register=async({ companyName, adminName, adminEmail, password })=>{
    try{        
        
        const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
                if (existingUser) {
                    throw new Error("An account with this email already exists")
                }
                
                const existingPending = await prisma.pendingSignup.findUnique({ where: { adminEmail } });
                if (existingPending && existingPending.status === "pending") {
                    await prisma.pendingSignup.delete({ where: { id: existingPending.id } });
                }
                
                const passwordHash = await bcrypt.hash(password, 10);
        
                const amount = parseInt(process.env.SUBSCRIPTION_AMOUNT_INR, 10);
                
                const order = await razorpay.orders.create({
                    amount,
                    currency: "INR",
                    receipt: `signup_${Date.now()}`,
                });
                
                await prisma.pendingSignup.create({
                    data: {
                        companyName,
                        adminName,
                        adminEmail,
                        passwordHash,
                        razorpayOrderId: order.id,
                        status: "pending",
                    },
                });
        
                return ({
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    keyId: process.env.RAZORPAY_KEY_ID,
                });
    }catch(error){
        console.log("FULL ERROR OBJECT:", error);
    console.log("ERROR KEYS:", Object.keys(error));
    console.log("ERROR.ERROR:", error.error);
        throw new Error(error.message);
    }
}