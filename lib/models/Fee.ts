import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  schoolFeesRegId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolFees', required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  fees: { type: Number, required: true },
  totalFees: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  balance: { type: Number, required: true },
  paymentFrequency: { type: String, required: true },
  paymentDate: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'partial', 'paid', 'overdue'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
feeSchema.index({ studentId: 1 });
feeSchema.index({ schoolFeesRegId: 1 });
feeSchema.index({ status: 1 });
feeSchema.index({ paymentDate: 1 });

// Update timestamp
feeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Fee = mongoose.models.Fee || mongoose.model('Fee', feeSchema);

export default Fee; 