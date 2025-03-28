import mongoose from 'mongoose';

const staffSalarySchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  baseSalary: { type: Number, required: true },
  bonuses: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  paymentDate: { type: String, required: true },
  staffStatus: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  paymentMethod: String,
  reference: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
staffSalarySchema.index({ staffId: 1 });
staffSalarySchema.index({ paymentDate: 1 });
staffSalarySchema.index({ paymentStatus: 1 });

// Update timestamp
staffSalarySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const StaffSalary = mongoose.models.StaffSalary || mongoose.model('StaffSalary', staffSalarySchema);

export default StaffSalary; 