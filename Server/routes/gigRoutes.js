const express = require('express');
const mongoose = require('mongoose');
const Gig = require('../models/Gig');
const { protect, workerOnly } = require('../middleware/authMiddleware');

const router = express.Router();
const allowedCategories = [
  'Household Works',
  'Repairing / Fixing',
  'Plumbing',
  'Electrical Work',
  'Cleaning',
  'Painting',
  'Gardening',
  'Design & Technology',
  'Other Services',
];

const allowedDeliveryTimes = [
  'Same day',
  '1 day',
  '2-3 days',
  '1 week',
  'Flexible',
];

router.post('/', protect, workerOnly, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      price,
      deliveryTime,
      location,
      imageUrl = '',
    } = req.body;

    if (
      !title?.trim() ||
      !category ||
      !description?.trim() ||
      price === undefined ||
      price === null ||
      price === '' ||
      !deliveryTime ||
      !location?.trim()
    ) {
      return res.status(400).json({
        message: 'Please fill in all required gig fields.',
      });
    }

    if (
      !allowedCategories.includes(category) ||
      !allowedDeliveryTimes.includes(deliveryTime)
    ) {
      return res.status(400).json({
        message: 'Invalid category or estimated time.',
      });
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        message: 'Price must be a number greater than zero.',
      });
    }

    if (title.trim().length > 100 ||
        description.trim().length > 2000 ||
        location.trim().length > 100) {
      return res.status(400).json({
        message: 'One or more fields exceed the allowed length.',
      });
    }

    if (
      typeof imageUrl !== 'string' ||
      (imageUrl.trim() &&
        (!/^https?:\/\/\S+$/i.test(imageUrl.trim()) ||
          imageUrl.trim().length > 2048))
    ) {
      return res.status(400).json({
        message: 'Please provide a valid HTTP or HTTPS image URL.',
      });
    }

    const gig = await Gig.create({
      title: title.trim(),
      category,
      description: description.trim(),
      price: numericPrice,
      deliveryTime,
      location: location.trim(),
      imageUrl: imageUrl.trim(),
      worker: req.user.id,
    });

    const populatedGig = await Gig.findById(gig._id)
      .populate('worker', 'name email');

    return res.status(201).json({
      message: 'Gig published successfully.',
      gig: populatedGig,
    });
  } catch (error) {
    console.error('Create gig error:', error.message);

    return res.status(500).json({
      message: 'Unable to publish gig. Please try again.',
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.find({ status: 'active' })
      .populate('worker', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    console.error('Fetch gigs error:', error.message);

    return res.status(500).json({
      message: 'Unable to fetch gigs.',
    });
  }
});

router.get('/my-gigs', protect, workerOnly, async (req, res) => {
  try {
    const gigs = await Gig.find({ worker: req.user.id })
      .populate('worker', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    console.error('Fetch worker gigs error:', error.message);

    return res.status(500).json({
      message: 'Unable to fetch your gigs.',
    });
  }
});


router.delete('/:id', protect, workerOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid gig ID.',
      })
    }

    const gig = await Gig.findOneAndDelete({
      _id: req.params.id,
      worker: req.user.id,
    })

    if (!gig) {
      return res.status(404).json({
        message: 'Gig not found or you do not have permission to delete it.',
      })
    }

    return res.status(200).json({
      message: 'Gig deleted successfully.',
    })
  } catch (error) {
    console.error('Delete gig error:', error.message)

    return res.status(500).json({
      message: 'Unable to delete gig.',
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid gig ID.',
      });
    }

    const gig = await Gig.findOne({
      _id: req.params.id,
      status: 'active',
    }).populate('worker', 'name');

    if (!gig) {
      return res.status(404).json({
        message: 'Gig not found.',
      });
    }

    return res.status(200).json({ gig });
  } catch (error) {
    console.error('Fetch gig error:', error.message);

    return res.status(500).json({
      message: 'Unable to fetch gig.',
    });
  }
});

module.exports = router;