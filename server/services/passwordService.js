const bcrypt = require("bcryptjs");
const PasswordReset = require("../models/PasswordReset");
const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("./emailService");

// Send Reset OTP
const sendResetOTP = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  await PasswordReset.deleteOne({ email });

  const otp = generateOTP();

  await PasswordReset.create({
    email,
    otp,
    verified: false,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendEmail(
    email,
    "PulseCare AI Password Reset",
    `<h2>Your Password Reset OTP</h2>
     <h1>${otp}</h1>
     <p>OTP expires in 5 minutes.</p>`
  );
};

// Verify Reset OTP
const verifyResetOTP = async (email, otp) => {
  const record = await PasswordReset.findOne({ email });

  if (!record) throw new Error("OTP not found");

  if (record.expiresAt < new Date()) {
    await PasswordReset.deleteOne({ email });
    throw new Error("OTP expired");
  }

  if (record.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  record.verified = true;
  await record.save();
};

// Reset Password
const resetPassword = async (email, password) => {
  const record = await PasswordReset.findOne({ email });

  if (!record || !record.verified) {
    throw new Error("OTP verification required");
  }

  const user = await User.findOne({ email });

  user.password = await bcrypt.hash(password, 10);

  await user.save();

  await PasswordReset.deleteOne({ email });
};

module.exports = {
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
};