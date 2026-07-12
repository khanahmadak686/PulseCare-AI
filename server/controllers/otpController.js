const asyncHandler = require("../utils/asyncHandler");
const Otp = require("../models/Otp");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../services/emailService");

// =====================================
// Send OTP
// =====================================
const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Delete old OTP
  await Otp.deleteOne({ email });

  // Generate New OTP
  const otp = generateOTP();

  // Save OTP
  await Otp.create({
    email,
    otp,
    verified: false,
    attempts: 0,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  const html = `
    <div style="font-family:Arial,sans-serif">
      <h2>PulseCare AI</h2>

      <p>Your verification code is</p>

      <h1 style="letter-spacing:5px;">${otp}</h1>

      <p>This OTP will expire in <b>5 minutes</b>.</p>

      <p>If you didn't request this OTP, please ignore this email.</p>
    </div>
  `;

  await sendEmail(
    email,
    "PulseCare AI - Email Verification OTP",
    html
  );

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});

// =====================================
// Verify OTP
// =====================================
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  const otpRecord = await Otp.findOne({ email });

  if (!otpRecord) {
    return res.status(404).json({
      success: false,
      message: "OTP not found. Please request a new OTP.",
    });
  }

  // OTP Expired
  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(400).json({
      success: false,
      message: "OTP has expired",
    });
  }

  // Maximum Attempts
  if (otpRecord.attempts >= 5) {
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(400).json({
      success: false,
      message: "Maximum OTP attempts exceeded. Request a new OTP.",
    });
  }

  // Wrong OTP
  if (otpRecord.otp !== otp) {
    otpRecord.attempts += 1;
    await otpRecord.save();

    return res.status(400).json({
      success: false,
      message: `Invalid OTP. Remaining Attempts: ${
        5 - otpRecord.attempts
      }`,
    });
  }

  // OTP Verified
  otpRecord.verified = true;
  await otpRecord.save();

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

module.exports = {
  sendOTP,
  verifyOTP,
};