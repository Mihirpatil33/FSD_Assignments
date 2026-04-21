const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

// ── POST /api/appointments ── Book an appointment ────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { listingId, date, timeSlot, message } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.status !== 'available') {
      return res.status(400).json({ success: false, message: 'This vehicle is no longer available' });
    }
    if (listing.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot book your own listing' });
    }

    // Check for existing appointment same slot
    const clash = await Appointment.findOne({
      listing: listingId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (clash) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked. Please choose another.' });
    }

    const appointment = await Appointment.create({
      listing: listingId,
      buyer: req.user._id,
      seller: listing.seller,
      date: new Date(date),
      timeSlot,
      message,
    });

    await appointment.populate([
      { path: 'listing', select: 'title category make model year price images location' },
      { path: 'seller', select: 'name email phone' },
    ]);

    res.status(201).json({ success: true, appointment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── GET /api/appointments/my ── Buyer's appointments ─────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ buyer: req.user._id })
      .populate('listing', 'title category make model year price images location status')
      .populate('seller', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/appointments/seller ── Seller's incoming appointments ────────────
router.get('/seller', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ seller: req.user._id })
      .populate('listing', 'title category make model year price images location')
      .populate('buyer', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/appointments/:id ── Update status (seller confirms/cancels, buyer cancels) ─
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, sellerNote } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const isBuyer = appointment.buyer.toString() === req.user._id.toString();
    const isSeller = appointment.seller.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Buyers can only cancel
    if (isBuyer && status !== 'cancelled') {
      return res.status(403).json({ success: false, message: 'Buyers can only cancel appointments' });
    }

    appointment.status = status;
    if (sellerNote) appointment.sellerNote = sellerNote;
    await appointment.save();

    await appointment.populate([
      { path: 'listing', select: 'title make model year' },
      { path: 'buyer', select: 'name email' },
      { path: 'seller', select: 'name email' },
    ]);

    res.json({ success: true, appointment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── GET /api/appointments/:id ── Single appointment ──────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('listing', 'title category make model year price images location')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const isBuyer = appointment.buyer._id.toString() === req.user._id.toString();
    const isSeller = appointment.seller._id.toString() === req.user._id.toString();
    if (!isBuyer && !isSeller) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
