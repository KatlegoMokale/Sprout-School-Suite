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
  },
  { timestamps: true }
);

const StudentFees =
  models.StudentFees ||
  mongoose.model<IStudentFees>("StudentFees", StudentFeesSchema);
export default StudentFees;
