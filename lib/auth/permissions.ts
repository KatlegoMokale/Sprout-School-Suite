import { UserRole } from "@/lib/models/user.model";

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ["users:manage", "students:write", "fees:write", "finance:write"],
  manager: ["students:write", "fees:write", "finance:read"],
  teacher: ["students:read", "attendance:write"],
  accountant: ["finance:write", "fees:write", "students:read"],
};

export const ALL_PERMISSIONS = [
  "users:manage",
  "students:read",
  "students:write",
  "attendance:write",
  "fees:write",
  "finance:read",
  "finance:write",
];
