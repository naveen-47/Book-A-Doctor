const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get complete administrative statistics & metrics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const approvedDoctors = await Doctor.countDocuments({ isApproved: 'approved' });
    const pendingDoctors = await Doctor.countDocuments({ isApproved: 'pending' });

    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    // Revenue calculation
    const revenueResult = await Appointment.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$paymentAmount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent 6 appointments
    const recentAppointments = await Appointment.find()
      .populate('patient', 'name email avatar')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(6);

    // Specialty distribution
    const specialtyStats = await Doctor.aggregate([
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    res.json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        approvedDoctors,
        pendingDoctors,
        totalAppointments,
        completedAppointments,
        confirmedAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalRevenue,
      },
      recentAppointments,
      specialtyStats,
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving admin statistics',
    });
  }
};

// @desc    Get all doctors (for admin management)
// @route   GET /api/admin/doctors
// @access  Private (Admin)
const getAllDoctorsAdmin = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.isApproved = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { hospitalName: { $regex: search, $options: 'i' } },
      ];
    }

    const doctors = await Doctor.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error('Admin Doctors Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctors',
    });
  }
};

// @desc    Approve a doctor
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private (Admin)
const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    doctor.isApproved = 'approved';
    await doctor.save();

    res.json({
      success: true,
      message: `Doctor ${doctor.name} has been approved successfully!`,
      doctor,
    });
  } catch (error) {
    console.error('Approve Doctor Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving doctor',
    });
  }
};

// @desc    Reject a doctor
// @route   PUT /api/admin/doctors/:id/reject
// @access  Private (Admin)
const rejectDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    doctor.isApproved = 'rejected';
    await doctor.save();

    res.json({
      success: true,
      message: `Doctor ${doctor.name} application has been rejected`,
      doctor,
    });
  } catch (error) {
    console.error('Reject Doctor Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error rejecting doctor',
    });
  }
};

// @desc    Get all users (patients, doctors, admins)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Admin Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
    });
  }
};

// @desc    Toggle user active/blocked status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change status of an Administrator account',
      });
    }

    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();

    res.json({
      success: true,
      message: `User status changed to ${user.status}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Toggle User Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user status',
    });
  }
};

// @desc    Get all appointments across platform
// @route   GET /api/admin/appointments
// @access  Private (Admin)
const getAllAppointmentsAdmin = async (req, res) => {
  try {
    const { status, date } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (date) {
      query.appointmentDate = date;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone avatar')
      .populate('doctor', 'name specialization hospitalName fees')
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error('Admin Appointments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching appointments',
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllDoctorsAdmin,
  approveDoctor,
  rejectDoctor,
  getAllUsers,
  toggleUserStatus,
  getAllAppointmentsAdmin,
};
