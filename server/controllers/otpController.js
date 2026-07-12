const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

const {
  sendOTPService,
  verifyOTPService,
} = require("../services/otpService");

// ===============================
// Send OTP
// ===============================
const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await sendOTPService(email);

  return apiResponse(
    res,
    200,
    true,
    "OTP Sent Successfully"
  );
});

// ===============================
// Verify OTP
// ===============================
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await verifyOTPService(email, otp);

  return apiResponse(
    res,
    200,
    true,
    "OTP Verified Successfully"
  );
});

module.exports = {
  sendOTP,
  verifyOTP,
};