const {prisma}=require('../../prisma/client')

const XLSX = require("xlsx");

const crypto = require("crypto");

const {
    generateAccessToken
} = require("../../utils/generateJWT");

const {sendInviteEmail}=require("../email/email.service")


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