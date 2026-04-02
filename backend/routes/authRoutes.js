const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/users')
  .get(protect, adminOnly, getAllUsers);

router
  .route('/users/:id')
  .put(protect, adminOnly, updateUserByAdmin)
  .delete(protect, adminOnly, deleteUserByAdmin);

module.exports = router;