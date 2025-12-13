require("dotenv").config();
const { User } = require("../models");
const nodemailer = require("nodemailer");

// Create Outlook transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send login email
const sendLoginEmail = async (email) => {
  await transporter.sendMail({
    from: `"Wegagen Bank" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Wegagen Bank Login Link",
    html: `
      <p>Dear All,</p>
      <p>Please click the link below to log in:</p>
      <p><a href="${process.env.LOGIN_USER}">
  ${process.env.LOGIN_USER}
</a></p>
      <br/>
      <p>Best regards,<br>Wegagen Bank</p>
    `
  });

  console.log(`Login link sent → ${email}`);
};

// Send login emails to all system users
const sendEmails = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["email"] });
console.log("list of email", users)
    for (const user of users) {
      if (user.email) {
        await sendLoginEmail(user.email);
      }
    }

    return res.json({ message: "All emails sent successfully" });

  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({ error: "Failed to send emails" });
  }
};

module.exports = { sendEmails };
