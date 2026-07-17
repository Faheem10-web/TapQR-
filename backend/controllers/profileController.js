const Profile = require('../models/Profile');
const { validationResult } = require('express-validator');

// @desc    Get all profiles of logged in user
// @route   GET /api/profile
// @access  Private
const getUserProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find({ userId: req.user.id });
    res.json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public profile details by slug
// @route   GET /api/profile/:slug
// @access  Public
const getProfileBySlug = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ slug: req.params.slug });

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Business profile card not found' });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new profile card
// @route   POST /api/profile
// @access  Private
const createProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Add user ID from JWT auth
    req.body.userId = req.user.id;

    // Check if slug is already taken
    const slugExists = await Profile.findOne({ slug: req.body.slug });
    if (slugExists) {
      return res.status(400).json({ success: false, error: 'The profile URL slug is already taken' });
    }

    const profile = await Profile.create(req.body);

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update business profile details
// @route   PUT /api/profile/:id
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile card not found' });
    }

    // Ensure user owns the profile card
    if (profile.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to modify this profile card' });
    }

    // Check if user is changing slug, and if next slug is taken
    if (req.body.slug && req.body.slug !== profile.slug) {
      const slugExists = await Profile.findOne({ slug: req.body.slug });
      if (slugExists) {
        return res.status(400).json({ success: false, error: 'The updated profile URL slug is already taken' });
      }
    }

    // Perform database update
    profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete profile card
// @route   DELETE /api/profile/:id
// @access  Private
const deleteProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile card not found' });
    }

    // Ensure user owns the profile card
    if (profile.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this profile card' });
    }

    await profile.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfiles,
  getProfileBySlug,
  createProfile,
  updateProfile,
  deleteProfile,
};
