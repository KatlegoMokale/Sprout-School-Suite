import mongoose from 'mongoose';

const studentSchoolFeesSchema = new mongoose.Schema({
  schoolfeesSchemaId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolFees', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  year: { type: Number, required: true },
  age: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrationFee: { type: Number, required: true },
  fees: { type: Number, required: true },
  totalFees: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  balance: { type: Number, required: true },
  paymentFrequency: { type: String, enum: ['monthly', 'quarterly', 'yearly'], required: true },
  nextPaymentDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
studentSchoolFeesSchema.index({ studentId: 1 });
studentSchoolFeesSchema.index({ schoolfeesSchemaId: 1 });
studentSchoolFeesSchema.index({ status: 1 });
studentSchoolFeesSchema.index({ nextPaymentDate: 1 });

// Update timestamp
studentSchoolFeesSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const StudentSchoolFees = mongoose.models.StudentSchoolFees || mongoose.model('StudentSchoolFees', studentSchoolFeesSchema);

export default StudentSchoolFees; 