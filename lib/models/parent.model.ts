import mongoose, { Schema, Document, models } from "mongoose";

// ─── Parent ──────────────────────────────────────────────────────────
export interface IParent extends Document {
  firstName: string;
  surname: string;
  address1: string;
  dateOfBirth: string;
  gender: string;
  idNumber: string;
  occupation?: string;
  contactNumber: string;
  email: string;
  workNumber?: string;
}

const ParentSchema = new Schema<IParent>(
  {
    firstName: { type: String, required: true, minlength: 3 },
    surname: { type: String, required: true, minlength: 3 },
    address1: { type: String, required: true, minlength: 3, maxlength: 150 },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    idNumber: { type: String, required: true, minlength: 13, maxlength: 13 },
    occupation: { type: String },
    contactNumber: { type: String, required: true, minlength: 10, maxlength: 10 },
    email: { type: String, required: true, unique: true },
    workNumber: { type: String },
  },
  { timestamps: true }
);

const Parent = models.Parent || mongoose.model<IParent>("Parent", ParentSchema);
export default Parent;
