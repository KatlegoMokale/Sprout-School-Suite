import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card', 'bank transfer'], required: true },
  paymentType: { type: String, enum: ['registration', 'school fees', 'event'], required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
paymentSchema.index({ studentId: 1 });
paymentSchema.index({ paymentDate: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentType: 1 });

// Update timestamp
paymentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment; 