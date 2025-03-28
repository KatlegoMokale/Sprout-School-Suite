import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String
    },
    surname: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    idNumber: {
        type: String,
        required: true,
        unique: true
    },
    position: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'staff'
});

// Update the updatedAt timestamp before saving
staffSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Create indexes (excluding email since it's already indexed by unique: true)
staffSchema.index({ firstName: 1 });
staffSchema.index({ surname: 1 });
staffSchema.index({ position: 1 });
staffSchema.index({ status: 1 });

const Staff = mongoose.models.staff || mongoose.model('staff', staffSchema);

export default Staff; 