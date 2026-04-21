const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true, trim: true },
  teacher: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Teaching Quality', 'Course Content', 'Faculty Behavior', 'Infrastructure', 'Other'],
    default: 'Teaching Quality'
  },
  isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
