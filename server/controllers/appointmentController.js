const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// ===========================
// Book Appointment
// ===========================
const bookAppointment = asyncHandler(async (req, res) => {

  const {
    patientId,
    doctorId,
    appointmentDate,
    timeSlot,
    symptoms,
  } = req.body;

  const patient = await User.findById(patientId);

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  const alreadyBooked = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate,
    timeSlot,
    status: {
      $in: [
        "Pending",
        "Confirmed",
      ],
    },
  });

  if (alreadyBooked) {
    res.status(400);
    throw new Error("Time Slot Already Booked");
  }

  const appointment = await Appointment.create({
    patient: patientId,
    doctor: doctorId,
    appointmentDate,
    timeSlot,
    symptoms,
  });

  res.status(201).json({
    success: true,
    message: "Appointment Booked Successfully",
    appointment,
  });

});

// ===========================
// Get All Appointments
// ===========================
const getAppointments = asyncHandler(async (req, res) => {

  const appointments = await Appointment.find()
    .populate("patient", "name email phone")
    .populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "name",
      },
    });

  res.json({
    success: true,
    total: appointments.length,
    appointments,
  });

});

module.exports = {
  bookAppointment,
  getAppointments,
};