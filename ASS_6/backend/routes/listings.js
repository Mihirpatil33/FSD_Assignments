const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

// ── Multer setup for image uploads ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// ── GET /api/listings ── Browse / search / filter ───────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      category, minPrice, maxPrice, location, condition,
      year, search, page = 1, limit = 12, sort = '-createdAt',
    } = req.query;

    const query = { status: 'available' };

    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (year) query.year = Number(year);
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('seller', 'name email phone location')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      listings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/listings/featured ── Featured listings ─────────────────────────
router.get('/featured', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'available', featured: true })
      .populate('seller', 'name location')
      .sort('-createdAt')
      .limit(6);
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/listings/my ── Current user's listings ─────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort('-createdAt');
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/listings/:id ── Single listing ──────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'seller',
      'name email phone location createdAt'
    );
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    // Increment view count
    listing.views += 1;
    await listing.save();

    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/listings ── Create listing ────────────────────────────────────
router.post('/', protect, upload.array('images', 8), async (req, res) => {
  try {
    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const listing = await Listing.create({
      ...req.body,
      images,
      seller: req.user._id,
    });

    res.status(201).json({ success: true, listing });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── PUT /api/listings/:id ── Update listing ──────────────────────────────────
router.put('/:id', protect, upload.array('images', 8), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const newImages = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    const images = [...(listing.images || []), ...newImages];

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images },
      { new: true, runValidators: true }
    );

    res.json({ success: true, listing: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/listings/:id ── Delete listing ───────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await listing.deleteOne();
    res.json({ success: true, message: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
