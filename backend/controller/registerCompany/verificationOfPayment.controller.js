
const registerCompany=require("../../services/registerCompany/verificationOfPayment.services")

exports.verificationOfPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment verification fields" });
        }

        const result=await registerCompany.verificationOfPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

        return res.json({result});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
