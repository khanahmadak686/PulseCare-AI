const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Otp = require("../models/Otp");

const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

// =========================================
// Register User
// =========================================
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    gender,
    dateOfBirth,
    role,
  } = req.body;

  // Required Fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields",
    });
  }

  // User Already Exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  // OTP Check
  const otpRecord = await Otp.findOne({ email });

  if (!otpRecord) {
    return res.status(400).json({
      success: false,
      message: "Please verify your email first.",
    });
  }

  // OTP Expired
  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(400).json({
      success: false,
      message: "OTP expired. Please request a new OTP.",
    });
  }

  // OTP Verified?
  if (!otpRecord.verified) {
    return res.status(400).json({
      success: false,
      message: "Please verify OTP before registration.",
    });
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    gender,
    dateOfBirth,
    role: role || "patient",
  });

  // Delete OTP after successful registration
  await Otp.deleteOne({ _id: otpRecord._id });

  res.status(201).json({
    success: true,
    message: "Registration Successful",
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// =========================================
// Login User
// =========================================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid Email or Password",
    });
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid Email or Password",
    });
  }

  res.status(200).json({
    success: true,
    message: "Login Successful",
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
});

// =========================================
// Get Logged In User
// =========================================
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};