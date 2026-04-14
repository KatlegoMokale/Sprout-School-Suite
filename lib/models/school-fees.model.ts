import mongoose, { Schema, Document, models } from "mongoose";

// ─── School Fees Registration ────────────────────────────────────────
export interface ISchoolFees extends Document {
  year: number;
  registrationFee: number;
  ageStart: number;
  ageEnd: number;
  ageUnit: "months" | "years";
  monthlyFee: number;
  yearlyFee: number;
  siblingDiscountType: "percentage" | "amount-per-child";
  siblingDiscountPrice: number;
}

const SchoolFeesSchema = new Schema<ISchoolFees>(
  {
    year: { type: Number, required: true },
    registrationFee: { type: Number, required: true },
    ageStart: { type: Number, required: true, min: 0, max: 12 },
    ageEnd: { type: Number, required: true, min: 0, max: 12 },
    ageUnit: { type: String, enum: ["months", "years"], required: true },
    monthlyFee: { type: Number, required: true },
    yearlyFee: { type: Number, required: true },
    siblingDiscountType: {
      type: String,
      enum: ["percentage", "amount-per-child"],
      default: "percentage",
      required: true,
    },
    siblingDiscountPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

const SchoolFees =
  models.SchoolFees ||
  mongoose.model<ISchoolFees>("SchoolFees", SchoolFeesSchema);
export default SchoolFees;
