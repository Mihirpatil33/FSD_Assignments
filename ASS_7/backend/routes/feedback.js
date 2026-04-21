const express = require('express');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /api/feedback — Submit feedback (students only)
router.post('/', auth, async (req, res) => {
  try {
    const { subject, teacher, rating, comment, category, isAnonymous } = req.body;
    if (!subject || !teacher || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const feedback = await Feedback.create({
      student: req.user.id,
      subject, teacher, rating, comment, category, isAnonymous,
    });
    res.status(201).json({ message: 'Feedback submitted ✅', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/feedback — Get all feedback (admin sees all, student sees own)
router.get('/', auth, async (req, res) => {
  try {
    let feedbacks;
    if (req.user.role === 'admin') {
      feedbacks = await Feedback.find().populate('student', 'name email').sort({ createdAt: -1 });
    } else {
      feedbacks = await Feedback.find({ student: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/feedback/stats — Admin overview stats
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const total = await Feedback.countDocuments();
    const avgRatingResult = await Feedback.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]);
    const avgRating = avgRatingResult[0]?.avg?.toFixed(2) || 0;
    const byCategory = await Feedback.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    res.json({ total, avgRating, byCategory });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/feedback/:id — Admin delete feedback
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
