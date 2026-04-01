const ParkingSlot = require('../models/ParkingSlot');

// Create parking slot
const createParkingSlot = async (req, res) => {
  try {
    const { slotNumber, location, type, availability, pricePerHour } = req.body;

    const existingSlot = await ParkingSlot.findOne({ slotNumber });
    if (existingSlot) {
      return res.status(400).json({ message: 'Parking slot already exists' });
    }

    const parkingSlot = await ParkingSlot.create({
      slotNumber,
      location,
      type,
      availability,
      pricePerHour,
    });

    res.status(201).json(parkingSlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all parking slots
const getParkingSlots = async (req, res) => {
  try {
    const parkingSlots = await ParkingSlot.find().sort({ createdAt: -1 });
    res.status(200).json(parkingSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get parking slot by ID
const getParkingSlotById = async (req, res) => {
  try {
    const parkingSlot = await ParkingSlot.findById(req.params.id);

    if (!parkingSlot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    res.status(200).json(parkingSlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update parking slot
const updateParkingSlot = async (req, res) => {
  try {
    const parkingSlot = await ParkingSlot.findById(req.params.id);

    if (!parkingSlot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    parkingSlot.slotNumber = req.body.slotNumber || parkingSlot.slotNumber;
    parkingSlot.location = req.body.location || parkingSlot.location;
    parkingSlot.type = req.body.type || parkingSlot.type;

    if (req.body.availability !== undefined) {
      parkingSlot.availability = req.body.availability;
    }

    if (req.body.pricePerHour !== undefined) {
      parkingSlot.pricePerHour = req.body.pricePerHour;
    }

    const updatedParkingSlot = await parkingSlot.save();
    res.status(200).json(updatedParkingSlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete parking slot
const deleteParkingSlot = async (req, res) => {
  try {
    const parkingSlot = await ParkingSlot.findById(req.params.id);

    if (!parkingSlot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    await parkingSlot.deleteOne();
    res.status(200).json({ message: 'Parking slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createParkingSlot,
  getParkingSlots,
  getParkingSlotById,
  updateParkingSlot,
  deleteParkingSlot,
};