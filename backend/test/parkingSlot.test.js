const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const ParkingSlot = require('../models/ParkingSlot');
const {
  createParkingSlot,
} = require('../controllers/parkingSlotController');

const { expect } = chai;

describe('Parking Slot Controller Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should create a new parking slot successfully', async () => {
    const req = {
      body: {
        slotNumber: 'A1',
        location: 'Level 1',
        type: 'Standard',
        availability: true,
        pricePerHour: 5,
      },
    };

    const createdSlot = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    };

    sinon.stub(ParkingSlot, 'findOne').resolves(null);
    sinon.stub(ParkingSlot, 'create').resolves(createdSlot);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createParkingSlot(req, res);

    expect(ParkingSlot.findOne.calledOnceWith({ slotNumber: 'A1' })).to.be.true;
    expect(ParkingSlot.create.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdSlot)).to.be.true;
  });

  it('should return 400 if parking slot already exists', async () => {
    const req = {
      body: {
        slotNumber: 'A1',
        location: 'Level 1',
        type: 'Standard',
        availability: true,
        pricePerHour: 5,
      },
    };

    sinon
      .stub(ParkingSlot, 'findOne')
      .resolves({ _id: new mongoose.Types.ObjectId(), slotNumber: 'A1' });

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createParkingSlot(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Parking slot already exists' })).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    const req = {
      body: {
        slotNumber: 'A1',
        location: 'Level 1',
        type: 'Standard',
        availability: true,
        pricePerHour: 5,
      },
    };

    sinon.stub(ParkingSlot, 'findOne').throws(new Error('DB Error'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createParkingSlot(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});