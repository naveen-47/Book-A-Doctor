const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Create / Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient / User)
const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, symptoms, paymentMethod } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctorId, appointmentDate, and timeSlot',
      });
    }

    // Verify doctor exists and is approved
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (doctor.isApproved !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This doctor is currently not accepting new appointments',
      });
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'Selected time slot is already booked for this doctor. Please select another slot.',
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctor._id,
      appointmentDate,
      timeSlot,
      symptoms: symptoms || 'General Medical Consultation',
      paymentStatus: 'paid',
      paymentAmount: doctor.fees,
      paymentMethod: paymentMethod || 'Online Payment (Card/UPI)',
      status: 'confirmed', // Auto-confirm on successful booking
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('patient', 'name email phone avatar');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: populated,
    });
  } catch (error) {
    console.error('Create Appointment Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating appointment',
    });
  }
};

// @desc    Get all appointments for the logged-in patient
// @route   GET /api/appointments/my
// @access  Private (Patient)
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor')
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error('Get Patient Appointments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your appointments',
    });
  }
};

// @desc    Get all appointments for the logged-in doctor
// @route   GET /api/appointments/doctor
// @access  Private (Doctor)
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone avatar gender dob address')
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      doctor,
      appointments,
    });
  } catch (error) {
    console.error('Get Doctor Appointments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctor appointments',
    });
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor')
      .populate('patient', 'name email phone avatar gender dob address');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Access control: only the patient, doctor, or admin can view
    const isPatient = appointment.patient._id.toString() === req.user._id.toString();
    let isDoctor = false;
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (doctor && appointment.doctor._id.toString() === doctor._id.toString()) {
        isDoctor = true;
      }
    }
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment',
      });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error('Get Appointment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching appointment details',
    });
  }
};

// @desc    Update appointment status (confirm, complete, cancel)
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor / Admin)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, doctorNotes } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    if (doctorNotes) {
      appointment.doctorNotes = doctorNotes;
    }

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('patient', 'name email phone avatar');

    res.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment: updated,
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating appointment status',
    });
  }
};

// @desc    Cancel appointment (by Patient or Doctor)
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed appointment',
      });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = reason || 'Cancelled by user';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    console.error('Cancel Appointment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling appointment',
    });
  }
};

// @desc    Upload document / report / prescription to appointment
// @route   POST /api/appointments/:id/documents
// @access  Private
const uploadAppointmentDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const newDoc = {
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      uploadedBy: req.user.role,
      fileType: req.file.mimetype.includes('pdf') ? 'pdf' : 'image',
      uploadedAt: new Date(),
    };

    appointment.documents.push(newDoc);
    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: newDoc,
      documents: appointment.documents,
    });
  } catch (error) {
    console.error('Upload Document Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error uploading document',
    });
  }
};

// @desc    Doctor adds/updates prescription for appointment
// @route   POST /api/appointments/:id/prescription
// @access  Private (Doctor)
const addPrescription = async (req, res) => {
  try {
    const { diagnosis, medicines, advice } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.prescription = {
      diagnosis: diagnosis || '',
      medicines: medicines || '',
      advice: advice || '',
      issuedAt: new Date(),
    };
    appointment.status = 'completed'; // Completing the appointment upon adding prescription

    await appointment.save();

    res.json({
      success: true,
      message: 'Prescription added and appointment marked as completed',
      prescription: appointment.prescription,
      appointment,
    });
  } catch (error) {
    console.error('Add Prescription Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving prescription',
    });
  }
};

module.exports = {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  uploadAppointmentDocument,
  addPrescription,
};
