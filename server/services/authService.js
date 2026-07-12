const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Otp = require("../models/Otp");
const generateToken = require("../utils/generateToken");

const registerUserService = async (userData) => {
  const {
    name,
    email,
    password,
    phone,
    gender,
    dateOfBirth,
    role,
  } = userData;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const otpRecord = await Otp.findOne({ email });

  if (!otpRecord) {
    throw new Error("Please verify your email first.");
  }

  if (!otpRecord.verified) {
    throw new Error("Please verify OTP before registration.");
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new Error("OTP expired");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    gender,
    dateOfBirth,
    role: role || "patient",
  });

  await Otp.deleteOne({ _id: otpRecord._id });

  return {
    token: generateToken(user._id),
    user,
  };
};

const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid Email or Password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid Email or Password");
  }

  return {
    token: generateToken(user._id),
    user,
  };
};

module.exports = {
  registerUserService,
  loginUserService,
};