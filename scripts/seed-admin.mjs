import mongoose from "mongoose";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const DEFAULT_PERMISSIONS = [
  "users:manage",
  "students:write",
  "fees:write",
  "finance:write",
];

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function run() {
  const cwd = process.cwd();
  loadEnvFile(path.join(cwd, ".env.local"));
  loadEnvFile(path.join(cwd, ".env"));

  const mongoUri = process.env.MONGODB_URI;
  const fullName = process.env.ADMIN_FULL_NAME || "System Admin";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required.");
  }

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }

  await mongoose.connect(mongoUri, { bufferCommands: false });

  const userSchema = new mongoose.Schema(
    {
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      password: { type: String, required: true },
      fullName: { type: String, required: true, trim: true },
      role: {
        type: String,
        enum: ["admin", "manager", "teacher", "accountant"],
        default: "teacher",
      },
      permissions: { type: [String], default: [] },
      isActive: { type: Boolean, default: true },
      firstName: { type: String },
      secondName: { type: String },
      surname: { type: String },
      dateOfBirth: { type: String },
      idNumber: { type: String },
      address1: { type: String },
      contact: { type: String },
    },
    { timestamps: true }
  );

  const User = mongoose.models.User || mongoose.model("User", userSchema);
  const normalizedEmail = email.toLowerCase().trim();
  const [firstNameRaw, ...restNames] = fullName.trim().split(/\s+/);
  const firstName = firstNameRaw || "Admin";
  const surname = restNames.join(" ") || "User";
  const secondName = "";

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    existingUser.fullName = fullName;
    existingUser.password = hashPassword(password);
    existingUser.role = "admin";
    existingUser.permissions = DEFAULT_PERMISSIONS;
    existingUser.isActive = true;
    if (!existingUser.firstName) existingUser.firstName = firstName;
    if (!existingUser.surname) existingUser.surname = surname;
    if (!existingUser.secondName) existingUser.secondName = secondName;
    if (!existingUser.dateOfBirth) existingUser.dateOfBirth = "1970-01-01";
    if (!existingUser.idNumber) existingUser.idNumber = "0000000000000";
    if (!existingUser.address1) existingUser.address1 = "System Address";
    if (!existingUser.contact) existingUser.contact = "0000000000";
    await existingUser.save();
    console.log(`Updated admin user: ${normalizedEmail}`);
  } else {
    await User.create({
      firstName,
      secondName,
      surname,
      dateOfBirth: "1970-01-01",
      idNumber: "0000000000000",
      address1: "System Address",
      contact: "0000000000",
      fullName,
      email: normalizedEmail,
      password: hashPassword(password),
      role: "admin",
      permissions: DEFAULT_PERMISSIONS,
      isActive: true,
    });
    console.log(`Created admin user: ${normalizedEmail}`);
  }

  await mongoose.disconnect();
}

run()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error("Admin seed failed:", error.message);
    if (error?.name === "ValidationError" && error?.errors) {
      for (const [key, value] of Object.entries(error.errors)) {
        console.error(` - ${key}: ${value.message}`);
      }
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  });
