import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  teacherName: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentEnrollment: { type: Number, default: 0 },
  schedule: {
    startTime: String,
    endTime: String,
    days: [String]
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
classSchema.index({ name: 1 });
classSchema.index({ teacherId: 1 });
classSchema.index({ status: 1 });

// Update timestamp
classSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Class = mongoose.models.Class || mongoose.model('Class', classSchema);

export default Class; 