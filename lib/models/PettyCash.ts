import mongoose from 'mongoose';

const pettyCashSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    store: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
pettyCashSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Create indexes
pettyCashSchema.index({ date: -1 });
pettyCashSchema.index({ category: 1 });
pettyCashSchema.index({ store: 1 });

const PettyCash = mongoose.models.PettyCash || mongoose.model('PettyCash', pettyCashSchema);

export default PettyCash; 