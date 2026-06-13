const bcrypt = require("bcrypt");
const {prisma}=require('./client')

async function main() {
    
    const tenant = await prisma.tenant.create({
        data: {
            name: "System",
            slug: "system"
        }
    });

    const password = await bcrypt.hash("admin123", 10);

    await prisma.user.create({

        data: {

            name: "Super Admin",

            email: "admin@123.com",

            passwordHash: password,

            role: "SUPER_ADMIN",

            tenantId: tenant.id

        }

    });

    console.log("Seed completed");
}

main();