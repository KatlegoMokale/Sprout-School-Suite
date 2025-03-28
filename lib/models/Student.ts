import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: String,
  province: String,
  postalCode: String,
  country: { type: String, default: 'South Africa' }
});

const parentSchema = new mongoose.Schema({
  relationship: { type: String, required: true },
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  address: addressSchema,
  dateOfBirth: String,
  gender: String,
  idNumber: String,
  occupation: String,
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  workNumber: String
});

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  secondName: String,
  surname: { type: String, required: true },
  address: { type: addressSchema, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: String, required: true },
  homeLanguage: { type: String, required: true },
  allergies: String,
  medicalAidNumber: String,
  medicalAidScheme: String,
  studentClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  parent1: { type: parentSchema, required: true },
  parent2: parentSchema,
  balance: { type: Number, default: 0 },
  lastPaid: Date,
  studentStatus: { type: String, enum: ['active', 'inactive', 'graduated'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
studentSchema.index({ firstName: 1, surname: 1 });
studentSchema.index({ 'parent1.email': 1 });
studentSchema.index({ studentClass: 1 });
studentSchema.index({ studentStatus: 1 });

// Update timestamp
studentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student; 