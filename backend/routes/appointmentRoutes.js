const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  uploadAppointmentDocument,
  addPrescription,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, authorize('patient', 'admin'), createAppointment);
router.get('/my', protect, authorize('patient', 'admin'), getPatientAppointments);
router.get('/doctor', protect, authorize('doctor', 'admin'), getDoctorAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, authorize('doctor', 'admin'), updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);
router.post(
  '/:id/documents',
  protect,
  upload.single('document'),
  uploadAppointmentDocument
);
router.post(
  '/:id/prescription',
  protect,
  authorize('doctor', 'admin'),
  addPrescription
);

module.exports = router;
