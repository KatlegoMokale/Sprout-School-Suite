import mongoose, { Schema, Document, models } from "mongoose";

// ─── Event Transaction ───────────────────────────────────────────────
export interface IEventTransaction extends Document {
  eventId: string;
  eventName: string;
  childId: string;
  childName: string;
  amount: number;
  datePaid: string;
  quantity: number;
  paymentStatus: "paid" | "pending" | "overdue";
}

const EventTransactionSchema = new Schema<IEventTransaction>(
  {
    eventId: { type: String, required: true, index: true },
    eventName: { type: String, required: true },
    childId: { type: String, required: true, index: true },
    childName: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    datePaid: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "overdue"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const EventTransaction =
  models.EventTransaction ||
  mongoose.model<IEventTransaction>(
    "EventTransaction",
    EventTransactionSchema
  );
export default EventTransaction;
