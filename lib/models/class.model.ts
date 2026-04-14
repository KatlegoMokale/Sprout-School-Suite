import mongoose, { Schema, Document, models } from "mongoose";

// ─── Class (with fees) ───────────────────────────────────────────────
export interface IClass extends Document {
  name: string;
  ageStart: number;
  ageEnd: number;
  ageUnit: "months" | "years";
  teacherId: string;
  teacherName: string;
  monthlyFee: number;
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, minlength: 3 },
    ageStart: { type: Number, required: true, min: 0, max: 12 },
    ageEnd: { type: Number, required: true, min: 0, max: 12 },
    ageUnit: { type: String, enum: ["months", "years"], required: true },
    teacherId: { type: String, required: true },
    teacherName: { type: String, required: true },
    monthlyFee: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Class = models.Class || mongoose.model<IClass>("Class", ClassSchema);
export default Class;
