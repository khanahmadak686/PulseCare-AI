const express = require("express");
const router = express.Router();

const {
  addDoctor,
  getDoctors,
} = require("../controllers/doctorController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Public Route
router.get("/", getDoctors);

// Admin Only Route
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  addDoctor
);

module.exports = router;