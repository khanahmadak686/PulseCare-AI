const asyncHandler = require("../utils/asyncHandler");
const Otp = require("../models/Otp");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../services/emailService");

// ===============================
// Send OTP
// ===============================
const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  await Otp.deleteMany({ email });

  const otp = generateOTP();

  await Otp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  const html = `
      <h2>PulseCare AI</h2>
      <p>Your Verification OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
  `;

  await sendEmail(
    email,
    "PulseCare AI Email Verification",
    html
  );

  res.status(200).json({
    success: true,
    message: "OTP Sent Successfully",
  });
});

// ===============================
// Verify OTP
// ===============================
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const otpData = await Otp.findOne({ email });

  if (!otpData) {
    return res.status(400).json({
      success: false,
      message: "OTP not found",
    });
  }

  if (otpData.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpData._id });

    return res.status(400).json({
      success: false,
      message: "OTP Expired",
    });
  }

  if (otpData.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  await Otp.deleteOne({ _id: otpData._id });

  res.status(200).json({
    success: true,
    message: "OTP Verified Successfully",
  });
});

module.exports = {
  sendOTP,
  verifyOTP,
};