const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

const {
  registerUserService,
  loginUserService,
} = require("../services/authService");

// Register
const registerUser = asyncHandler(async (req, res) => {
  const result = await registerUserService(req.body);

  return apiResponse(
    res,
    201,
    true,
    "Registration Successful",
    {
      token: result.token,
      user: result.user,
    }
  );
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await loginUserService(email, password);

  return apiResponse(
    res,
    200,
    true,
    "Login Successful",
    {
      token: result.token,
      user: result.user,
    }
  );
});

// Profile
const getProfile = asyncHandler(async (req, res) => {
  return apiResponse(
    res,
    200,
    true,
    "Profile fetched successfully",
    req.user
  );
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};