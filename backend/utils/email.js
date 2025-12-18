
require("dotenv").config();
const nodemailer = require("nodemailer");

// Create transporter (Outlook, Gmail, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send registration email
const sendRegistrationEmail = async (email, username, password) => {
  await transporter.sendMail({
    from: `"Wegagen Bank" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Wegagen Bank Channel status Registration Details",
    html: `
      <p>Dear ${username},</p>
      <p>Your account has been successfully created.</p>
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Password:</strong> ${password}</p>
      <br/>
      <p>Please log in and change your password immediately.</p>
       <p><a href="${process.env.LOGIN_USER}">
  ${process.env.LOGIN_USER}
</a></p>
      <br/>
      <p>Best regards,<br>Wegagen Bank</p>
    `
  });

  console.log(`Registration email sent → ${email}`);
};

module.exports = { sendRegistrationEmail };
