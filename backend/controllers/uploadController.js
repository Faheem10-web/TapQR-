const cloudinary = require('../config/cloudinary');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/logo OR /api/upload/banner
// @access  Private
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please select a file to upload' });
    }

    // Convert memory buffer to Base64 Data URI
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload payload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'tapqr',
      resource_type: 'auto',
    });

    res.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Cloudinary upload controller error:', error);
    res.status(500).json({ success: false, error: 'Image upload to storage failed' });
  }
};

module.exports = {
  uploadImage,
};
