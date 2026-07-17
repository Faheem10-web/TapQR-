const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  slug: {
    type: String,
    required: [true, 'Please add a slug'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a business name'],
  },
  title: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  whatsapp: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  coverPhoto: {
    type: String,
    default: '',
  },
  theme: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  socials: {
    type: Map,
    of: String,
    default: {},
  },
  hours: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  links: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  services: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  testimonials: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  faqs: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  qrSettings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Profile', ProfileSchema);
