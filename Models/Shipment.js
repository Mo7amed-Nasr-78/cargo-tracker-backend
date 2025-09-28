import mongoose from 'mongoose';

const shipmentModel = new mongoose.Schema({
    shipmentId: {
        type: String,
        unique: true,
        required: true
    },
    containerId: {
        type: String,
        required: true
    },
    route: [
        {
            coordinates: { type: Array, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    currentLocation: {
        location: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        updatedAt: Date
    },
    currentETA: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'in-transit', 'delayed', 'delivered', 'cancelled'],
        default: 'pending'
    },
    origin: {
        location: { type: String, required: true },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    destination: {
        location: { type: String, required: true },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    }
}, {
    timestamps: true
});

export default mongoose.model('Shipment', shipmentModel);