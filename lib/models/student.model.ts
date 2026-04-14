import mongoose, { Schema, Document, models } from "mongoose";

// ─── Guardian Sub-Document ───────────────────────────────────────────
const GuardianSchema = new Schema(
  {
    relationship: { type: String },
    firstName: { type: String },
    surname: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    idNumber: { type: String },
    gender: { type: String },
    dateOfBirth: { type: String },
    address1: { type: String },
    city: { type: String },
    province: { type: String },
    postalCode: { type: String },
    occupation: { type: String },
    workNumber: { type: String },
  },
  { _id: false }
);

// ─── Student ─────────────────────────────────────────────────────────
export interface IGuardian {
  relationship?: string;
  firstName?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  idNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  address1?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  occupation?: string;
  workNumber?: string;
}

export interface IStudent extends Document {
  firstName: string;
  secondName?: string;
  surname: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  address1: string;
  city?: string;
  province?: string;
  postalCode?: string;
  homeLanguage: string;
  allergies?: string;
  medicalAidNumber?: string;
  medicalAidScheme?: string;
  studentClass: string;
  studentStatus: "active" | "non-active";
  balance: number;
  lastPaid?: string;
  guardian1: IGuardian;
  guardian2?: IGuardian;
}

const StudentSchema = new Schema<IStudent>(
  {
    firstName: { type: String, required: true },
    secondName: { type: String },
    surname: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    age: { type: String },
    gender: { type: String, required: true },
    address1: { type: String, required: true },
    city: { type: String },
    province: { type: String },
    postalCode: { type: String },
    homeLanguage: { type: String, required: true },
    allergies: { type: String },
    medicalAidNumber: { type: String },
    medicalAidScheme: { type: String },
    studentClass: { type: String, required: true },
    studentStatus: {
      type: String,
      enum: ["active", "non-active"],
      default: "active",
    },
    balance: { type: Number, default: 0 },
    lastPaid: { type: String },

    // Embedded guardian documents (replaces flat p1_ / p2_ fields)
    guardian1: { type: GuardianSchema, required: true },
    guardian2: { type: GuardianSchema },
  },
  { timestamps: true }
);

const Student =
  models.Student || mongoose.model<IStudent>("Student", StudentSchema);
export default Student;
