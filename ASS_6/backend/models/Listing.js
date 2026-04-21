const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['car', 'bike', 'scooter', 'truck', 'van', 'other'],
    },
    make: { type: String, required: true, trim: true },       // e.g. Toyota, Honda
    model: { type: String, required: true, trim: true },      // e.g. Corolla, Civic
    year: {
      type: Number,
      required: true,
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    mileage: { type: Number, default: 0 },                    // km driven
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'needs-repair'],
      default: 'good',
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic', 'cvt'],
      default: 'manual',
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng'],
      default: 'petrol',
    },
    color: { type: String, default: '' },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    images: [{ type: String }],                               // file paths / URLs
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'reserved'],
      default: 'available',
    },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text index for full-text search
listingSchema.index({ title: 'text', make: 'text', model: 'text', description: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
