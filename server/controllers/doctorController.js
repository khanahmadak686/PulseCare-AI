const Doctor = require("../models/Doctor");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// Add Doctor
const addDoctor = asyncHandler(async (req, res) => {
  const {
    userId,
    specialization,
    qualification,
    experience,
    consultationFee,
    hospital,
    about,
    availableDays,
    availableSlots,
  } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role !== "doctor") {
    res.status(400);
    throw new Error("User role must be doctor");
  }

  const exists = await Doctor.findOne({ user: userId });

  if (exists) {
    res.status(400);
    throw new Error("Doctor profile already exists");
  }

  const doctor = await Doctor.create({
    user: userId,
    specialization,
    qualification,
    experience,
    consultationFee,
    hospital,
    about,
    availableDays,
    availableSlots,
  });

  res.status(201).json({
    success: true,
    message: "Doctor Added Successfully",
    doctor,
  });
});

// Get All Doctors
const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find()
    .populate("user", "name email phone");

  res.json({
    success: true,
    total: doctors.length,
    doctors,
  });
});

module.exports = {
  addDoctor,
  getDoctors,
};