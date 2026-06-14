const nodemailer = require("nodemailer");

const transporter =
nodemailer.createTransport({

  service: "gmail",

  auth: {

    user:
      process.env.EMAIL_USER,

    pass:
      process.env.EMAIL_PASS
  }
});

exports.sendInviteEmail =
async (
  email,
  name,
  token
) => {

  const setupLink =
  `${process.env.FRONTEND_URL}
  /setup-password/${token}`;

  await transporter.sendMail({

    to: email,

    subject:
      "Set Your Password",

    html: `

      <h2>Hello ${name}</h2>

      <p>
      Click below to create password.
      </p>

      <a href="${setupLink}">
      Setup Password
      </a>

    `
  });
};