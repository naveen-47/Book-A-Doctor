const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Appointment must belong to a patient'],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Appointment must specify a doctor'],
    },
    appointmentDate: {
      type: String, // format YYYY-MM-DD
      required: [true, 'Please specify an appointment date'],
    },
    timeSlot: {
      type: String, // e.g. "09:00 AM - 10:00 AM"
      required: [true, 'Please specify an appointment time slot'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    symptoms: {
      type: String,
      default: 'General Consultation',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'paid',
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'Card / Online',
    },
    documents: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        uploadedBy: { type: String, default: 'patient' },
        fileType: { type: String, default: 'document' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    prescription: {
      diagnosis: { type: String, default: '' },
      medicines: { type: String, default: '' },
      advice: { type: String, default: '' },
      issuedAt: { type: Date },
    },
    doctorNotes: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double bookings for the same doctor, date, and timeSlot (unless cancelled)
appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } },
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
