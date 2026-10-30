const mongoose = require('mongoose');
const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Household Works',
        'Repairing / Fixing',
        'Plumbing',
        'Electrical Work',
        'Cleaning',
        'Painting',
        'Gardening',
        'Design & Technology',
        'Other Services',
      ],
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    deliveryTime: {
      type: String,
      required: true,
      enum: [
        'Same day',
        '1 day',
        '2-3 days',
        '1 week',
        'Flexible',
      ],
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Gig', gigSchema);