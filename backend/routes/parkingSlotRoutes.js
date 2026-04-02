const express = require('express');
const {
  createParkingSlot,
  getParkingSlots,
  getParkingSlotById,
  updateParkingSlot,
  deleteParkingSlot,
} = require('../controllers/parkingSlotController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getParkingSlots)
  .post(protect, adminOnly, createParkingSlot);

router
  .route('/:id')
  .get(getParkingSlotById)
  .put(protect, adminOnly, updateParkingSlot)
  .delete(protect, adminOnly, deleteParkingSlot);

module.exports = router;