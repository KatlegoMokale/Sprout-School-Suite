import mongoose, { Schema, Document, models } from "mongoose";

// ─── Fund Raising Event ──────────────────────────────────────────────
export interface IEvent extends Document {
  eventName: string;
  amount: number;
  description: string;
  date: string;
}

const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true, minlength: 3 },
    amount: { type: Number, required: true, min: 1 },
    description: { type: String, required: true, minlength: 3 },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const Event = models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
