import mongoose from 'mongoose';

const grocerySchema = new mongoose.Schema({
    summary: {
        type: String,
        required: true
    },
    totalPaid: {
        type: Number,
        required: true
    },
    store: {
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
grocerySchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Create indexes
grocerySchema.index({ date: -1 });
grocerySchema.index({ store: 1 });

const Grocery = mongoose.models.Grocery || mongoose.model('Grocery', grocerySchema);

export default Grocery; 