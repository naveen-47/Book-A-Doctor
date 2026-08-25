const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide doctor email'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    specialization: {
      type: String,
      required: [true, 'Please specify specialization'],
      trim: true,
    },
    qualifications: {
      type: String,
      required: [true, 'Please specify qualifications'],
      default: 'MBBS, MD',
    },
    experienceYears: {
      type: Number,
      required: [true, 'Please specify years of experience'],
      default: 5,
    },
    fees: {
      type: Number,
      required: [true, 'Please specify consultation fees'],
      default: 50,
    },
    bio: {
      type: String,
      default: 'Dedicated healthcare professional providing compassionate and specialized medical care.',
    },
    hospitalName: {
      type: String,
      default: 'City Health Care & Research Center',
    },
    hospitalAddress: {
      type: String,
      default: '450 Wellness Avenue, Medical District, NY',
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    availableTimeSlots: {
      type: [String],
      default: [
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:30 AM - 12:30 PM',
        '02:00 PM - 03:00 PM',
        '03:30 PM - 04:30 PM',
        '05:00 PM - 06:00 PM',
      ],
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 24,
    },
    isApproved: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
