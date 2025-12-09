const { User } = require("../models");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");

// Configure Outlook SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate login link
const generateLoginLink = (email) => {
  const token = Buffer.from(email + Date.now()).toString("base64");
  return `${process.env.APP_URL}/login?token=${token}`;
};

// Send a single login email
const sendLoginEmail = async (email) => {
  const loginLink = generateLoginLink(email);

  await transporter.sendMail({
    from: `"Wegagen Bank" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Login Link to Wegagen Bank",
    html: `<p>Dear Customer,</p>
           <p>Click <a href="${loginLink}">here</a> to login to your account.</p>
           <p>Best regards,<br>Wegagen Bank</p>`
  });

  console.log(`Login link sent to: ${email}`);
};

// Send login links to all users with 2-hour interval starting 2:00 AM ET
const sendLoginLinksToUsers = async () => {
  const users = await User.findAll({ attributes: ["email"] });

  for (let i = 0; i < users.length; i++) {
    const email = users[i].email;

    // Schedule each email
    const delayHours = i * 2;
    const sendTime = moment().tz("Africa/Addis_Ababa").startOf("day").add(2 + delayHours, "hours");
    const delay = sendTime.diff(moment().tz("Africa/Addis_Ababa"));

    setTimeout(() => {
      sendLoginEmail(email).catch(console.error);
    }, delay);
  }

  return { message: "Login links scheduled successfully" };
};

// Controller method
const sendEmails = async (req, res) => {
  try {
    const result = await sendLoginLinksToUsers();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to schedule login emails" });
  }
};

module.exports = { sendEmails };
