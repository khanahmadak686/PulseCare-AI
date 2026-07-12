const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

const {
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
} = require("../services/passwordService");

exports.forgotPassword = asyncHandler(async (req, res) => {
  await sendResetOTP(req.body.email);

  return apiResponse(
    res,
    200,
    true,
    "Reset OTP sent successfully"
  );
});

exports.verifyResetOTP = asyncHandler(async (req, res) => {
  await verifyResetOTP(req.body.email, req.body.otp);

  return apiResponse(
    res,
    200,
    true,
    "OTP verified successfully"
  );
});

exports.resetPassword = asyncHandler(async (req, res) => {
  await resetPassword(
    req.body.email,
    req.body.password
  );

  return apiResponse(
    res,
    200,
    true,
    "Password changed successfully"
  );
});