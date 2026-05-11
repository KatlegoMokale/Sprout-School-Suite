import mongoose, { Schema, Document, models } from "mongoose";

export type UserRole = "admin" | "manager" | "teacher" | "accountant";

export interface IUser extends Document {
  firstName?: string;
  secondName?: string;
  surname?: string;
  dateOfBirth?: string;
  idNumber?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  contact?: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  profileImage?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String },
    secondName: { type: String },
    surname: { type: String },
    dateOfBirth: { type: String },
    idNumber: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    province: { type: String },
    postalCode: { type: String },
    contact: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "manager", "teacher", "accountant"],
      default: "teacher",
    },
    permissions: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    bio: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
