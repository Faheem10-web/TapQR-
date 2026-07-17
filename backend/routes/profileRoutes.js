const express = require('express');
const { check } = require('express-validator');
const {
  getUserProfiles,
  getProfileBySlug,
  createProfile,
  updateProfile,
  deleteProfile,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get logged in user's profiles
router.get('/', protect, getUserProfiles);

// Publicly fetch profile by slug
router.get('/:slug', getProfileBySlug);

// Protected profile operations
router.post(
  '/',
  protect,
  [
    check('slug', 'Slug is required').not().isEmpty(),
    check('name', 'Business Name is required').not().isEmpty(),
  ],
  createProfile
);

router.put('/:id', protect, updateProfile);
router.delete('/:id', protect, deleteProfile);

module.exports = router;
