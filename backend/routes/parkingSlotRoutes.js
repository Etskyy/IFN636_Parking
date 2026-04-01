const express = require('express');
const {
  createParkingSlot,
  getParkingSlots,
  getParkingSlotById,
  updateParkingSlot,
  deleteParkingSlot,
} = require('../controllers/parkingSlotController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getParkingSlots)
  .post(protect, createParkingSlot);

router.route('/:id')
  .get(getParkingSlotById)
  .put(protect, updateParkingSlot)
  .delete(protect, deleteParkingSlot);

module.exports = router;