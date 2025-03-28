import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Holiday', 'Activity', 'Special'],
    required: true
  },
  status: { 
    type: String, 
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
eventSchema.index({ date: -1 });
eventSchema.index({ type: 1 });
eventSchema.index({ status: 1 });

// Update timestamp
eventSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event; 