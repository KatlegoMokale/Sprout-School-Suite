import mongoose, { Schema, Document, models } from "mongoose";

// ─── Staff Salary ────────────────────────────────────────────────────
export interface IStaffSalary extends Document {
  staffId: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  paymentDate: string;
  staffStatus: "Active" | "Non-Active";
}

const StaffSalarySchema = new Schema<IStaffSalary>(
  {
    staffId: { type: String, required: true, index: true },
    baseSalary: { type: Number, required: true, min: 0 },
    bonuses: { type: Number, required: true, min: 0 },
    deductions: { type: Number, required: true, min: 0 },
    paymentDate: { type: String, required: true },
    staffStatus: {
      type: String,
      enum: ["Active", "Non-Active"],
      required: true,
    },
  },
  { timestamps: true }
);

const StaffSalary =
  models.StaffSalary ||
  mongoose.model<IStaffSalary>("StaffSalary", StaffSalarySchema);
export default StaffSalary;
