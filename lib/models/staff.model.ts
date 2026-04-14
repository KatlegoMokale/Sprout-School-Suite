import mongoose, { Schema, Document, models } from "mongoose";

// ─── Staff ───────────────────────────────────────────────────────────
export interface IStaff extends Document {
  firstName: string;
  secondName?: string;
  surname: string;
  address1: string;
  dateOfBirth: string;
  idNumber: string;
  gender: string;
  email: string;
  contact: string;
  position: string;
  startDate: string;
}

const StaffSchema = new Schema<IStaff>(
  {
    firstName: { type: String, required: true, minlength: 3 },
    secondName: { type: String },
    surname: { type: String, required: true, minlength: 3 },
    address1: { type: String, required: true, minlength: 3, maxlength: 150 },
    dateOfBirth: { type: String, required: true },
    idNumber: { type: String, required: true, minlength: 13, maxlength: 13 },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true, minlength: 10, maxlength: 10 },
    position: { type: String, required: true },
    startDate: { type: String, required: true },
  },
  { timestamps: true }
);

const Staff = models.Staff || mongoose.model<IStaff>("Staff", StaffSchema);
export default Staff;
