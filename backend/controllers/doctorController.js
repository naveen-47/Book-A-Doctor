const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get all doctors with search, filters & pagination
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const {
      search,
      specialization,
      minFee,
      maxFee,
      rating,
      day,
      sort,
    } = req.query;

    const query = { isApproved: 'approved' };

    // Text search on name, hospitalName, or specialization
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { hospitalName: { $regex: search, $options: 'i' } },
        { hospitalAddress: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by specialization
    if (specialization && specialization !== 'All') {
      query.specialization = { $regex: `^${specialization}$`, $options: 'i' };
    }

    // Filter by consultation fee range
    if (minFee || maxFee) {
      query.fees = {};
      if (minFee) query.fees.$gte = Number(minFee);
      if (maxFee) query.fees.$lte = Number(maxFee);
    }

    // Filter by minimum rating
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Filter by available day
    if (day) {
      query.availableDays = day;
    }

    // Sorting
    let sortOptions = { rating: -1, experienceYears: -1 };
    if (sort === 'fee_asc') sortOptions = { fees: 1 };
    if (sort === 'fee_desc') sortOptions = { fees: -1 };
    if (sort === 'experience') sortOptions = { experienceYears: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };

    const doctors = await Doctor.find(query).sort(sortOptions);

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error('Get Doctors Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching doctors',
    });
  }
};

// @desc    Get top rated featured doctors
// @route   GET /api/doctors/top
// @access  Public
const getTopDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: 'approved' })
      .sort({ rating: -1, reviewsCount: -1 })
      .limit(6);

    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error('Get Top Doctors Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching top doctors',
    });
  }
};

// @desc    Get all unique medical specialties with counts
// @route   GET /api/doctors/specialties
// @access  Public
const getSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.aggregate([
      { $match: { isApproved: 'approved' } },
      {
        $group: {
          _id: '$specialization',
          count: { $sum: 1 },
          minFee: { $min: '$fees' },
        },
      },
      { $sort: { count: -1, _id: 1 } },
    ]);

    res.json({
      success: true,
      specialties: specialties.map((s) => ({
        name: s._id,
        count: s.count,
        minFee: s.minFee,
      })),
    });
  } catch (error) {
    console.error('Get Specialties Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching specialties',
    });
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error('Get Doctor By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctor details',
    });
  }
};

// @desc    Check doctor available slots for a given date
// @route   GET /api/doctors/:id/availability?date=YYYY-MM-DD
// @access  Public
const getDoctorAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date query parameter (YYYY-MM-DD)',
      });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Find all active booked appointments for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: date,
      status: { $in: ['pending', 'confirmed'] },
    }).select('timeSlot status');

    const bookedSlots = bookedAppointments.map((a) => a.timeSlot);

    // Calculate slot availability status
    const allSlots = doctor.availableTimeSlots.map((slot) => ({
      slot,
      isAvailable: !bookedSlots.includes(slot),
    }));

    res.json({
      success: true,
      date,
      doctor: doctor.name,
      availableSlots: allSlots,
      bookedSlots,
    });
  } catch (error) {
    console.error('Doctor Availability Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking availability',
    });
  }
};

// @desc    Update doctor profile (for logged in doctor)
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const {
      specialization,
      qualifications,
      experienceYears,
      fees,
      bio,
      hospitalName,
      hospitalAddress,
      availableDays,
      availableTimeSlots,
      profileImage,
    } = req.body;

    if (specialization) doctor.specialization = specialization;
    if (qualifications) doctor.qualifications = qualifications;
    if (experienceYears !== undefined) doctor.experienceYears = Number(experienceYears);
    if (fees !== undefined) doctor.fees = Number(fees);
    if (bio !== undefined) doctor.bio = bio;
    if (hospitalName !== undefined) doctor.hospitalName = hospitalName;
    if (hospitalAddress !== undefined) doctor.hospitalAddress = hospitalAddress;
    if (availableDays) doctor.availableDays = availableDays;
    if (availableTimeSlots) doctor.availableTimeSlots = availableTimeSlots;
    if (profileImage) doctor.profileImage = profileImage;

    const updatedDoctor = await doctor.save();

    res.json({
      success: true,
      message: 'Doctor profile updated successfully',
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error('Update Doctor Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating doctor profile',
    });
  }
};

module.exports = {
  getDoctors,
  getTopDoctors,
  getSpecialties,
  getDoctorById,
  getDoctorAvailability,
  updateDoctorProfile,
};
