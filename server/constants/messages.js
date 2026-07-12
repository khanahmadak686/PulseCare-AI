const MESSAGES = {
  // Auth
  REGISTER_SUCCESS: "Registration Successful",
  LOGIN_SUCCESS: "Login Successful",

  USER_EXISTS: "User already exists",

  INVALID_CREDENTIALS: "Invalid Email or Password",

  EMAIL_REQUIRED: "Email is required",

  EMAIL_NOT_VERIFIED: "Please verify your email first.",

  OTP_SENT: "OTP sent successfully",

  OTP_VERIFIED: "OTP verified successfully",

  OTP_INVALID: "Invalid OTP",

  OTP_EXPIRED: "OTP expired",

  OTP_REQUIRED: "OTP is required",

  TOO_MANY_ATTEMPTS:
    "Maximum OTP attempts exceeded",

  // Common
  SERVER_ERROR: "Internal Server Error",

  UNAUTHORIZED: "Unauthorized",

  NOT_FOUND: "Resource Not Found",
};

module.exports = MESSAGES;