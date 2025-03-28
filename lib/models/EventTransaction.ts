import mongoose from 'mongoose';

const eventTransactionSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  datePaid: { type: Date, required: true },
  type: { type: String, default: 'event' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
eventTransactionSchema.index({ eventId: 1 });
eventTransactionSchema.index({ childId: 1 });
eventTransactionSchema.index({ datePaid: 1 });
eventTransactionSchema.index({ status: 1 });

// Update timestamp
eventTransactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const EventTransaction = mongoose.models.EventTransaction || mongoose.model('EventTransaction', eventTransactionSchema);

export default EventTransaction; 