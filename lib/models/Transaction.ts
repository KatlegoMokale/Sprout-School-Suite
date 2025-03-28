import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  Type: { type: String, required: true },
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: String, required: true },
  transactionType: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentMethod: String,
  reference: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
transactionSchema.index({ studentId: 1 });
transactionSchema.index({ paymentDate: 1 });
transactionSchema.index({ transactionType: 1 });
transactionSchema.index({ status: 1 });

// Update timestamp
transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction; 