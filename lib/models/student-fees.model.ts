import mongoose, { Schema, Document, models } from "mongoose";

// ─── Student Fees ────────────────────────────────────────────────────
export interface IStudentFees extends Document {
  studentId: string;
  schoolFeesRegId: string;
  startDate: string;
  endDate: string;
  fees: number;
  totalFees: number;
  paidAmount?: number;
  balance: number;
  paymentFrequency: "monthly" | "quarterly" | "yearly";
  paymentDate: number;
  discountType?: "none" | "percentage" | "amount";
  discountValue?: number;
  fullExemption?: boolean;
  exemptedMonths?: string[];
  competitionWinner?: boolean;
  competitionTitle?: string;
  registrationNotes?: string;
}

const StudentFeesSchema = new Schema<IStudentFees>(
  {
    studentId: { type: String, required: true, index: true },
    schoolFeesRegId: { type: String, required: true, index: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    fees: { type: Number, required: true },
    totalFees: { type: Number, required: true },
    paidAmount: { type: Number },
    balance: { type: Number, required: true },
    paymentFrequency: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      required: true,
    },
    paymentDate: { type: Number, required: true },
    discountType: {
      type: String,
      enum: ["none", "percentage", "amount"],
      default: "none",
    },
    discountValue: { type: Number, default: 0 },
    fullExemption: { type: Boolean, default: false },
    exemptedMonths: { type: [String], default: [] },
    competitionWinner: { type: Boolean, default: false },
    competitionTitle: { type: String, default: "" },
    registrationNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

const StudentFees =
  models.StudentFees ||
  mongoose.model<IStudentFees>("StudentFees", StudentFeesSchema);
export default StudentFees;
