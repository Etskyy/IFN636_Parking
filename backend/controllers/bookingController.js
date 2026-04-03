const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');

const userOwnsBooking = (booking, reqUser) => {
  return booking.userId.toString() === reqUser._id.toString();
};

const isHalfHourTime = (time) => {
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  const [hours, minutes] = time.split(':').map(Number);
  return hours >= 0 && hours <= 23 && (minutes === 0 || minutes === 30);
};

const getBookingStartDateTime = (bookingDate, startTime) => {
  const date = new Date(bookingDate);
  const [hours, minutes] = startTime.split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const getBookingEndDateTime = (bookingDate, endTime) => {
  const date = new Date(bookingDate);
  const [hours, minutes] = endTime.split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const overlaps = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};

const bookingIsPast = (booking) => {
  const end = getBookingEndDateTime(booking.bookingDate, booking.endTime);
  return end < new Date();
};

const normalizePastStatuses = async (query) => {
  const bookings = await Booking.find(query);

  const updates = bookings
    .filter((booking) => booking.status === 'active' && bookingIsPast(booking))
    .map((booking) =>
      Booking.findByIdAndUpdate(booking._id, { status: 'completed' }, { new: true })
    );

  if (updates.length > 0) {
    await Promise.all(updates);
  }
};

const findOverlappingBooking = async ({
  slotId,
  bookingDate,
  startTime,
  endTime,
  excludeBookingId = null,
}) => {
  const sameDayBookings = await Booking.find({
    slotId,
    bookingDate,
    status: { $in: ['active'] },
    ...(excludeBookingId ? { _id: { $ne: excludeBookingId } } : {}),
  });

  const newStart = getBookingStartDateTime(bookingDate, startTime);
  const newEnd = getBookingEndDateTime(bookingDate, endTime);

  return sameDayBookings.find((booking) => {
    const existingStart = getBookingStartDateTime(booking.bookingDate, booking.startTime);
    const existingEnd = getBookingEndDateTime(booking.bookingDate, booking.endTime);
    return overlaps(newStart, newEnd, existingStart, existingEnd);
  });
};

// Create booking
const createBooking = async (req, res) => {
  try {
    const { slotId, bookingDate, startTime, endTime, licensePlate } = req.body;

    if (!slotId || !bookingDate || !startTime || !endTime || !licensePlate) {
      return res.status(400).json({ message: 'Please fill in all booking fields' });
    }

    if (!isHalfHourTime(startTime) || !isHalfHourTime(endTime)) {
      return res.status(400).json({
        message: 'Bookings must use 30-minute intervals only',
      });
    }

    const bookingStart = getBookingStartDateTime(bookingDate, startTime);
    const bookingEnd = getBookingEndDateTime(bookingDate, endTime);

    if (bookingEnd <= bookingStart) {
      return res.status(400).json({
        message: 'End time must be after start time',
      });
    }

    const parkingSlot = await ParkingSlot.findById(slotId);

    if (!parkingSlot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    // availability now means "enabled/disabled by admin", not "currently booked forever"
    if (!parkingSlot.availability) {
      return res.status(400).json({ message: 'Parking spot is currently disabled' });
    }

    const overlappingBooking = await findOverlappingBooking({
      slotId,
      bookingDate,
      startTime,
      endTime,
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: 'This parking spot is already booked for that time range',
      });
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

    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email role')
      .populate('slotId', 'slotNumber location type pricePerHour');

    return res.status(201).json(populatedBooking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get bookings
// query ?scope=mine forces only current user's bookings
// query ?scope=all lets admins view all bookings
const getBookings = async (req, res) => {
  try {
    const scope = req.query.scope || '';

    let query = { userId: req.user._id };

    if (scope === 'all' && req.user.role === 'admin') {
      query = {};
    }

    await normalizePastStatuses(query);

    const bookings = await Booking.find(query)
      .populate('userId', 'name email role')
      .populate('slotId', 'slotNumber location type pricePerHour')
      .sort({ bookingDate: -1, startTime: -1, createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email role')
      .populate('slotId', 'slotNumber location type pricePerHour');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && !userOwnsBooking(booking, req.user)) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    if (booking.status === 'active' && bookingIsPast(booking)) {
      booking.status = 'completed';
      await booking.save();
      booking = await Booking.findById(req.params.id)
        .populate('userId', 'name email role')
        .populate('slotId', 'slotNumber location type pricePerHour');
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

    if (req.user.role !== 'admin' && !userOwnsBooking(booking, req.user)) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    if (booking.status !== 'active') {
      return res.status(400).json({
        message: 'Only active bookings can be changed',
      });
    }

    if (bookingIsPast(booking)) {
      booking.status = 'completed';
      await booking.save();
      return res.status(400).json({
        message: 'Past bookings cannot be changed',
      });
    }

    const newBookingDate = req.body.bookingDate ?? booking.bookingDate;
    const newStartTime = req.body.startTime ?? booking.startTime;
    const newEndTime = req.body.endTime ?? booking.endTime;
    const newLicensePlate = req.body.licensePlate ?? booking.licensePlate;
    const newStatus = req.body.status ?? booking.status;

    if (!isHalfHourTime(newStartTime) || !isHalfHourTime(newEndTime)) {
      return res.status(400).json({
        message: 'Bookings must use 30-minute intervals only',
      });
    }

    const newStart = getBookingStartDateTime(newBookingDate, newStartTime);
    const newEnd = getBookingEndDateTime(newBookingDate, newEndTime);

    if (newEnd <= newStart) {
      return res.status(400).json({
        message: 'End time must be after start time',
      });
    }

    const overlappingBooking = await findOverlappingBooking({
      slotId: booking.slotId,
      bookingDate: newBookingDate,
      startTime: newStartTime,
      endTime: newEndTime,
      excludeBookingId: booking._id,
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: 'This parking spot is already booked for that time range',
      });
    }

    booking.bookingDate = newBookingDate;
    booking.startTime = newStartTime;
    booking.endTime = newEndTime;
    booking.licensePlate = newLicensePlate;
    booking.status = newStatus;

    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('userId', 'name email role')
      .populate('slotId', 'slotNumber location type pricePerHour');

    return res.status(200).json(populatedBooking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && !userOwnsBooking(booking, req.user)) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status !== 'active') {
      return res.status(400).json({ message: 'Only active bookings can be cancelled' });
    }

    if (bookingIsPast(booking)) {
      booking.status = 'completed';
      await booking.save();
      return res.status(400).json({ message: 'Past bookings cannot be cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    return res.status(200).json({ message: 'Booking cancelled successfully' });
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

    if (req.user.role !== 'admin' && !userOwnsBooking(booking, req.user)) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
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
  cancelBooking,
  deleteBooking,
};