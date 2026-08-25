const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getTopDoctors,
  getSpecialties,
  getDoctorById,
  getDoctorAvailability,
  updateDoctorProfile,
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getDoctors);
router.get('/top', getTopDoctors);
router.get('/specialties', getSpecialties);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);

module.exports = router;
