const {prisma}=require('../../prisma/client')

const XLSX = require("xlsx");

const crypto = require("crypto");

const {
    hashPassword
} = require("../../utils/password");

const {
    comparePassword
} = require("../../utils/password");

const {
    generateAccessToken
} = require("../../utils/generateJWT");

const {sendInviteEmail}=require("../email/email.service")



exports.register_company=async(data)=>{
    try{
        const {

        companyName,
        companySlug,
        plan,

        adminName,
        adminEmail,
        password

    } = data;

    

    const existingUser =
        await prisma.user.findUnique({

            where: {
                email: adminEmail
            }

        });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    

    const existingTenant =
        await prisma.tenant.findUnique({

            where: {
                slug: companySlug
            }

        });

    if (existingTenant) {
        throw new Error("Company slug already exists");
    }

    const passwordHash =
        await hashPassword(password, 10);

    const result =
        await prisma.$transaction(async (tx) => {

           

            const tenant =
                await tx.tenant.create({

                    data: {

                        name: companyName,

                        slug: companySlug

                    }

                });

            

            const subscription =
                await tx.subscription.create({

                    data: {

                        tenantId: tenant.id,

                        plan,

                        status: "ACTIVE",

                        startsAt: new Date(),

                        expiresAt: new Date(
                            Date.now() +
                            30 * 24 * 60 * 60 * 1000
                        )

                    }

                });

        
            const admin =
                await tx.user.create({

                    data: {

                        tenantId: tenant.id,

                        name: adminName,

                        email: adminEmail,

                        passwordHash,

                        role: "TENANT_ADMIN"

                    }

                });

            return {

                tenant,

                subscription,

                admin

            };

        });

    return result;
    }catch(error){
        throw new Error(error.message || "Error in company registration")
    }

}

exports.register_user=async(data)=>{
    try{
    const {
        name,
        email,
        password,
        tenantId
    } = data;

    const existing = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existing){
        throw new Error("User already exists");
    }
        

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

    return user;
    }catch(error){
        throw new Error(error.message || "Error in User Registration");
    }
}

exports.login=async(data)=>{
    try{
    const {
        email,
        password
    } = data;

    const user =
        await prisma.user.findUnique({

            where: {
                email
            }

        });

    if (!user){
        throw new Error("User not found")
    }
        

    const valid =
        await comparePassword(
            password,
            user.passwordHash
        );

    if (!valid){
        throw new Error("Invalid password");
    }
        

    const token =
        generateAccessToken(user);

    return {user,token}
    }catch(error){
        throw new Error(error.message || "Error in login");
    }
}

exports.bulk_register_service=async({filePath,tenantId})=>{
    try{
            const workbook =
    XLSX.readFile(filePath);

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows =
    XLSX.utils.sheet_to_json(sheet);

  let inserted = 0;
  let failed = [];

  for (const row of rows) {

    const email =
      row.Email?.trim().toLowerCase();

    const existing =
      await prisma.user.findUnique({
        where: { email }
      });

    if (existing) {

      failed.push({
        email,
        reason: "Already Exists"
      });

      continue;
    }

    const token =
      crypto.randomBytes(32)
      .toString("hex");

    const employee =
      await prisma.user.create({

        data: {

          tenantId,

          name: row.Name,

          email,

          role:
            row.Role || "User",

          setupToken: token,

          isActive: false,

          setupExpiry:
            new Date(
              Date.now()
              + 24 * 60 * 60 * 1000
            )
        }
      });

    await sendInviteEmail(
      employee.email,
      employee.name,
      token
    );

    inserted++;
  }

  return {
    inserted,
    failed
  };
    }catch(error){
        throw new Error(error.message || "Error in Bulk registration");
    }
}

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