import mongoose, { Schema, Document, models } from "mongoose";

// ─── Grocery ─────────────────────────────────────────────────────────
export interface IGrocery extends Document {
  summery: string;
  totalPaid: number;
  store: string;
  date: string;
}

const GrocerySchema = new Schema<IGrocery>(
  {
    summery: { type: String, required: true, minlength: 3 },
    totalPaid: { type: Number, required: true, min: 1 },
    store: { type: String, required: true, minlength: 3 },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const Grocery =
  models.Grocery || mongoose.model<IGrocery>("Grocery", GrocerySchema);
export default Grocery;
