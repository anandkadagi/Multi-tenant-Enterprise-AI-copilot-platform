const {prisma}=require('../../prisma/client')

const {
    hashPassword
} = require("../../utils/password");

const {sendInviteEmail}=require("../email/email.service")

exports.set_password_service = async ({token,password}) =>{
    try{
        const employee =
    await prisma.user.findFirst({

      where: {

        setupToken: token,

        setupExpiry: {
          gt: new Date()
        }
      }
    });

  if (!employee) {

    throw new Error(
      "Invalid or expired token"
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  await prisma.user.update({

    where: {
      id: employee.id
    },

    data: {

      password: hashedPassword,

      isActive: true,

      setupToken: null,

      setupExpiry: null
    }
  });

  return {
    message:
      "Password set successfully"
  };

    }catch(error){
          throw new Error(error.message || "Error in set password");
      }
}