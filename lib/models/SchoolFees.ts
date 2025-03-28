import mongoose from 'mongoose';

const schoolFeesSchema = new mongoose.Schema({
  year: { type: String, required: true },
  registrationFee: { type: String, required: true },
  ageStart: { type: String, required: true },
  ageEnd: { type: String, required: true },
  ageUnit: { type: String, required: true },
  monthlyFee: { type: Number, required: true },
  yearlyFee: { type: Number, required: true },
  siblingDiscountPrice: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
schoolFeesSchema.index({ year: 1 });
schoolFeesSchema.index({ ageStart: 1, ageEnd: 1 });
schoolFeesSchema.index({ status: 1 });

// Update timestamp
schoolFeesSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const SchoolFees = mongoose.models.SchoolFees || mongoose.model('SchoolFees', schoolFeesSchema);

export default SchoolFees; 