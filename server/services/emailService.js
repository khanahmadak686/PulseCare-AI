const transporter = require("../config/mail");

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("✅ Email Sent Successfully");
  } catch (error) {
    console.log("❌ Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;