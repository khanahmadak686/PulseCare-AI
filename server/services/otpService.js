const Otp = require("../models/Otp");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("./emailService");

// ===============================
// Send OTP Service
// ===============================
const sendOTPService = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  await Otp.deleteOne({ email });

  const otp = generateOTP();

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
    </div>
  `;

  await sendEmail(
    email,
    "PulseCare AI Email Verification",
    html
  );

  return true;
};

// ===============================
// Verify OTP Service
// ===============================
const verifyOTPService = async (email, otp) => {
  const otpRecord = await Otp.findOne({ email });

  if (!otpRecord) {
    throw new Error("OTP not found");
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new Error("OTP expired");
  }

  if (otpRecord.attempts >= 5) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new Error("Maximum OTP attempts exceeded");
  }

  if (otpRecord.otp !== otp) {
    otpRecord.attempts += 1;
    await otpRecord.save();

    throw new Error(
      `Invalid OTP. Remaining Attempts: ${5 - otpRecord.attempts}`
    );
  }

  otpRecord.verified = true;
  await otpRecord.save();

  return true;
};

module.exports = {
  sendOTPService,
  verifyOTPService,
};