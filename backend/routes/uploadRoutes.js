const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer memory storage configuration (passes buffer to controller)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // Limit uploads to 4MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Protected routes to upload logo/banner
router.post('/logo', protect, upload.single('image'), uploadImage);
router.post('/banner', protect, upload.single('image'), uploadImage);

module.exports = router;
