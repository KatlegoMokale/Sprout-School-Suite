import mongoose, { Schema, Document, models } from "mongoose";

// ─── User (Authentication) ───────────────────────────────────────────
export interface IUser extends Document {
  firstName: string;
  secondName?: string;
  surname: string;
  dateOfBirth: string;
  idNumber: string;
  address1: string;
  contact: string;
  email: string;
  password: string; // hashed
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, minlength: 3 },
    secondName: { type: String },
    surname: { type: String, required: true, minlength: 3 },
    dateOfBirth: { type: String, required: true },
    idNumber: { type: String, required: true, minlength: 3 },
    address1: { type: String, required: true, minlength: 3, maxlength: 150 },
    contact: { type: String, required: true, minlength: 10, maxlength: 10 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
