const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');

// Helper to check whether a booking belongs to the current user
const userOwnsBooking = (booking, reqUser) => {
  return booking.userId.toString() === reqUser._id.toString();
};

// Create booking
const createBooking = async (req, res) => {
  try {
    const { slotId, bookingDate, startTime, endTime, licensePlate } = req.body;

    if (!slotId || !bookingDate || !startTime || !endTime || !licensePlate) {
      return res.status(400).json({ message: 'Please fill in all booking fields' });
    }

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
      licensePlate,
      status: 'active',
    });

    parkingSlot.availability = false;
    await parkingSlot.save();

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get bookings
// Admins: all bookings
// Normal users: only their own bookings
const getBookings = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };

    const bookings = await Booking.find(query)
      .populate('userId', 'name email role')
      .populate('slotId', 'slotNumber location type pricePerHour')
      .sort({ bookingDate: -1, createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
// Admins: any booking
// Normal users: only their own booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email role')
      .populate('slotId', 'slotNumber location type pricePerHour');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && !userOwnsBooking(booking, req.user)) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update booking
// Admins: can edit any booking
// Normal users: can edit only their own booking
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && !userOwnsBooking(booking, req.user)) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    if (req.body.bookingDate !== undefined) booking.bookingDate = req.body.bookingDate;
    if (req.body.startTime !== undefined) booking.startTime = req.body.startTime;
    if (req.body.endTime !== undefined) booking.endTime = req.body.endTime;
    if (req.body.licensePlate !== undefined) booking.licensePlate = req.body.licensePlate;
    if (req.body.status !== undefined) booking.status = req.body.status;

    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('userId', 'name email role')
      .populate('slotId', 'slotNumber location type pricePerHour');

    return res.status(200).json(populatedBooking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete booking
// Admins: can delete any booking
// Normal users: can delete only their own booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && !userOwnsBooking(booking, req.user)) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
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