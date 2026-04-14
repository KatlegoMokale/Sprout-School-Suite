// ─── Barrel Export for all Mongoose Models ──────────────────────────
//
// Usage:
//   import { Student, Staff, Payment } from "@/lib/models";
//
// Each model file also exports its TypeScript interface (IStudent, IStaff, etc.)
// so you can type your data throughout the app.

export { default as User } from "./user.model";
export { default as Student } from "./student.model";
export { default as Staff } from "./staff.model";
export { default as Class } from "./class.model";
export { default as Parent } from "./parent.model";
export { default as Payment } from "./payment.model";
export { default as Event } from "./event.model";
export { default as EventTransaction } from "./event-transaction.model";
export { default as PettyCash } from "./petty-cash.model";
export { default as Grocery } from "./grocery.model";
export { default as SchoolFees } from "./school-fees.model";
export { default as StudentFees } from "./student-fees.model";
export { default as FeeTransaction } from "./fee-transaction.model";
export { default as StaffSalary } from "./staff-salary.model";

// Re-export interfaces for convenience
export type { IUser } from "./user.model";
export type { IStudent, IGuardian } from "./student.model";
export type { IStaff } from "./staff.model";
export type { IClass } from "./class.model";
export type { IParent } from "./parent.model";
export type { IPayment } from "./payment.model";
export type { IEvent } from "./event.model";
export type { IEventTransaction } from "./event-transaction.model";
export type { IPettyCash } from "./petty-cash.model";
export type { IGrocery } from "./grocery.model";
export type { ISchoolFees } from "./school-fees.model";
export type { IStudentFees } from "./student-fees.model";
export type { IFeeTransaction } from "./fee-transaction.model";
export type { IStaffSalary } from "./staff-salary.model";
