import mongoose, { Schema, Document, models } from "mongoose";

// ─── Fee Transaction ─────────────────────────────────────────────────
export interface IFeeTransaction extends Document {
  studentId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  feeType: "registration" | "re-registration" | "school-fees";
}

const FeeTransactionSchema = new Schema<IFeeTransaction>(
  {
    studentId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentDate: { type: String, required: true },
    feeType: {
      type: String,
      enum: ["registration", "re-registration", "school-fees"],
      required: true,
    },
  },
  { timestamps: true }
);

const FeeTransaction =
  models.FeeTransaction ||
  mongoose.model<IFeeTransaction>("FeeTransaction", FeeTransactionSchema);
export default FeeTransaction;
