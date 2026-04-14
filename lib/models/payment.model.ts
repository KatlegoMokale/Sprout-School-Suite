import mongoose, { Schema, Document, models } from "mongoose";

// ─── Payment Transaction ─────────────────────────────────────────────
export interface IPayment extends Document {
  studentId: string;
  firstName: string;
  surname: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionType: string;
}

const PaymentSchema = new Schema<IPayment>(
  {
    studentId: { type: String, required: true, index: true },
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    paymentMethod: { type: String, required: true },
    paymentDate: { type: String, required: true },
    transactionType: { type: String, required: true },
  },
  { timestamps: true }
);

const Payment =
  models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;
