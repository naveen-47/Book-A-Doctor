const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllDoctorsAdmin,
  approveDoctor,
  rejectDoctor,
  getAllUsers,
  toggleUserStatus,
  getAllAppointmentsAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Guard all admin routes with protect and authorize('admin')
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/doctors', getAllDoctorsAdmin);
router.put('/doctors/:id/approve', approveDoctor);
router.put('/doctors/:id/reject', rejectDoctor);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/appointments', getAllAppointmentsAdmin);

module.exports = router;
