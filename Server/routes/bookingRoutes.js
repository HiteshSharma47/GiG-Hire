const express = require("express");
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Gig = require("../models/Gig");
const {
  protect,
  workerOnly,
  clientOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, clientOnly, async (req, res) => {
  try {
    const { gigId, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(gigId)) {
      return res.status(400).json({ message: "Invalid gig ID." });
    }

    const gig = await Gig.findOne({
      _id: gigId,
      status: "active",
    });

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found or unavailable.",
      });
    }

    if (gig.worker.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot book your own gig.",
      });
    }

    const existingBooking = await Booking.findOne({
      gig: gig._id,
      client: req.user.id,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "You already have an active booking for this gig.",
      });
    }

    const booking = await Booking.create({
      gig: gig._id,
      client: req.user.id,
      worker: gig.worker,
      price: gig.price,
      message: message || "",
    });

    res.status(201).json({
      message: "Booking request sent successfully!",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create booking.",
      error: error.message,
    });
  }
});

router.get("/my-bookings", protect, clientOnly, async (req, res) => {
  try {
    const bookings = await Booking.find({
      client: req.user.id,
    })
      .populate("gig", "title category location imageUrl")
      .populate("worker", "name email phone")
      .sort({ createdAt: -1 });

    const safeBookings = bookings.map((booking) => {
      const bookingData = booking.toObject();

      if (
        bookingData.status !== "accepted" &&
        bookingData.status !== "completed"
      ) {
        if (bookingData.worker) {
          delete bookingData.worker.email;
          delete bookingData.worker.phone;
        }
      }

      return bookingData;
    });

    res.json(safeBookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your bookings.",
      error: error.message,
    });
  }
});

router.get("/worker-requests", protect, workerOnly, async (req, res) => {
  try {
    const bookings = await Booking.find({
      worker: req.user.id,
    })
      .populate("gig", "title category location imageUrl")
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking requests.",
      error: error.message,
    });
  }
});

router.patch("/:id/status", protect, workerOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      worker: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (
      booking.status === "pending" &&
      !["accepted", "rejected"].includes(status)
    ) {
      return res.status(400).json({
        message: "Pending bookings can only be accepted or rejected.",
      });
    }

    if (booking.status === "accepted" && status !== "completed") {
      return res.status(400).json({
        message: "Accepted bookings can only be marked as completed.",
      });
    }

    if (!["pending", "accepted"].includes(booking.status)) {
      return res.status(400).json({
        message: "This booking can no longer be updated.",
      });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: `Booking ${status} successfully.`,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking.",
      error: error.message,
    });
  }
});

module.exports = router;