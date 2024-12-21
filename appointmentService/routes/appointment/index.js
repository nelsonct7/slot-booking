const express = require("express");
const router = express.Router();
const Appointment = require("../../models/Appointment");
const slotService = require("../../services/slotService");

// Get available slots for a date
router.get("/slots/:date", async (req, res) => {
  try {
    const availableSlots = await slotService.getAvailableSlots(
      req.params.date,
      Appointment
    );
    res.json({ slots: availableSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book an appointment
router.post("/book", async (req, res) => {
  try {
    const { name, phoneNumber, date, timeSlot } = req.body;
    console.log("[!] ",req.body);
    if (!name || !phoneNumber || !date || !timeSlot) {
      return res
        .status(400)
        .json({ error: "Required fields are missing. Please verify" });
    }
    // Validate the slot is available
    const availableSlots = await slotService.getAvailableSlots(
      date,
      Appointment
    );
    if (!availableSlots.includes(timeSlot)) {
      return res.status(400).json({ error: "Time slot is not available" });
    }

    const appointment = new Appointment({
      name,
      phoneNumber,
      date,
      timeSlot,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ error: "This slot is already booked" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
