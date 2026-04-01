const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');

// Create booking
const createBooking = async (req, res) => {
  try {
    const { slotId, bookingDate, startTime, endTime } = req.body;

    const parkingSlot = await ParkingSlot.findById(slotId);
    if (!parkingSlot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    if (!parkingSlot.availability) {
      return res.status(400).json({ message: 'Parking slot is not available' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      slotId,
      bookingDate,
      startTime,
      endTime,
      status: 'active',
    });

    parkingSlot.availability = false;
    await parkingSlot.save();

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('slotId', 'slotNumber location type pricePerHour')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('slotId', 'slotNumber location type pricePerHour');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update booking
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.bookingDate = req.body.bookingDate || booking.bookingDate;
    booking.startTime = req.body.startTime || booking.startTime;
    booking.endTime = req.body.endTime || booking.endTime;
    booking.status = req.body.status || booking.status;

    const updatedBooking = await booking.save();
    return res.status(200).json(updatedBooking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const parkingSlot = await ParkingSlot.findById(booking.slotId);
    if (parkingSlot) {
      parkingSlot.availability = true;
      await parkingSlot.save();
    }

    await booking.deleteOne();
    return res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};