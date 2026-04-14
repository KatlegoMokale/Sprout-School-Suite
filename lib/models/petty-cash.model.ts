import mongoose, { Schema, Document, models } from "mongoose";

// ─── Petty Cash ──────────────────────────────────────────────────────
export interface IPettyCash extends Document {
  itemName: string;
  quantity: number;
  price: number;
  store: string;
  category: string;
  date: string;
}

const PettyCashSchema = new Schema<IPettyCash>(
  {
    itemName: { type: String, required: true, minlength: 3 },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 1 },
    store: { type: String, required: true, minlength: 3 },
    category: { type: String, required: true, minlength: 3 },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const PettyCash =
  models.PettyCash ||
  mongoose.model<IPettyCash>("PettyCash", PettyCashSchema);
export default PettyCash;
