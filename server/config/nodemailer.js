const nodemailer = require("nodemailer");
const { MAILER_EMAILID, MAILER_PASSWORD, APP_NAME } = require("./envConfig");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAILER_EMAILID,
    pass: MAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to send email
const sendEmail = async (options) => {
  const mailOptions = {
    from: `"${APP_NAME}" <${MAILER_EMAILID}>`,
    to: options.to, // Recipient(s)
    subject: options.subject, // Subject line
    text: options.text, // Plain text body
    html: options.html, // HTML body (optional)
  };
  // Send email using the transporter
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;