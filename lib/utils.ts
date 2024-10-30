import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { date, z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "Zar",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const classFormSchema = () => z.object({
  //new class form
  name: z.string().min(3),
  age: z.string().min(3),
  teacherId: z.string().min(3),
  teacherName: z.string().min(3),
});

export const fundRaisingEventSchema = () => z.object({
  //new fund rasising form
  eventName: z.string().min(3),
  amount: z.number().min(1),
  description: z.string().min(3),
  date: z.string().min(3),
});

export const eventTransactionSchema = () => z.object({
  //new event transaction form
  eventId: z.string().min(3),
  eventName: z.string().min(3),
  childId: z.string().min(3),
  childName: z.string().min(3),
  amount: z.number().min(1),
  datePaid: z.string().min(3),
  quantity: z.number().min(1),
  /////New
  paymentStatus: z.enum(['paid', 'pending', 'overdue'])
});

export const pettyCashSchema = () => z.object({
  //new petty cash form
  itemName: z.string().min(3),
  quantity: z.number().min(1),
  price: z.number().min(1),
  store: z.string().min(3),
  category: z.string().min(3),
  date: z.string().min(3),
});

export const grocerySchema = () => z.object({
  //new grocery form
  summery: z.string().min(3),
  totalPaid: z.number().min(1),
  store: z.string().min(3),
  date: z.string().min(3),
});



export const paymentFormSchema = () => z.object({
  //new payment Form
  studentId: z.string().min(3),
  firstName: z.string().min(3),
  surname: z.string().min(3),
  amount: z.number().min(1),
  paymentMethod: z.string().min(3),
  paymentDate: z.string().min(3),
  /////New
  transactionType: z.enum(['fee', 'event', 'salary']),
});

export const authformSchemaLogin = () => z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export const authFormSchema = (type: string) => z.object({
  firstName : type === 'sign-in' ? z.string().optional(): z.string().min(3),
  secondName: type === 'sign-in' ? z.string().optional():  z.string().optional(),
  surname: type === 'sign-in' ? z.string().optional(): z.string().min(3),
  dateOfBirth: type === 'sign-in' ? z.string().optional(): z.string().min(3),
  idNumber: type === 'sign-in' ? z.string().optional(): z.string().min(3),
  address1: type === 'sign-in' ? z.string().optional(): z.string().min(3).max(150),
  contact: type === 'sign-in' ? z.string().optional(): z.string().min(10).max(10),

  //
  email: z.string().email(),
  password: z.string().min(3),
});


export const newStudentFormSchema = () => z.object({
  //new student form

  firstName: z.string().min(3),
  secondName: z.string().optional(),
  surname: z.string().min(3),
  address1: z.string().min(3).max(150),
  dateOfBirth: z.string().min(3),
  gender: z.string().min(3),
  age: z.string().min(1).max(20),
  homeLanguage: z.string().min(3),
  allergies: z.string().optional(),
  medicalAidNumber: z.string().optional(),
  medicalAidScheme: z.string().optional(),
  studentClass: z.string().optional(),


  p1_relationship: z.string().min(3),
  p1_firstName: z.string().min(3),
  p1_surname: z.string().min(3),
  p1_address1: z.string().min(3).max(150),
  p1_dateOfBirth: z.string().min(3),
  p1_gender: z.string().min(3),
  p1_idNumber : z.string().min(13).max(13),
  p1_occupation: z.string().optional(),
  p1_phoneNumber: z.string().min(10).max(10),
  p1_email: z.string().email().optional(),
  p1_workNumber: z.string().optional(),
 
  p2_relationship: z.string().optional(),
  p2_firstName: z.string().optional(),
  p2_surname: z.string().optional(),
  p2_address1: z.string().optional(),
  p2_dateOfBirth: z.string().optional(),
  p2_gender: z.string().optional(),
  p2_idNumber: z.string().optional(),
  p2_occupation: z.string().optional(),
  p2_phoneNumber: z.string().optional(),
  p2_email: z.string().optional(),
  p2_workNumber: z.string().optional(),

  balance: z.number().optional(),
  lastPaid: z.string().optional(),

  studentStatus: z.string().optional(),


});

export const newStuffFormSchema = () => z.object({
  //new student form

  firstName: z.string().min(3),
  secondName: z.string().optional(),
  surname: z.string().min(3),
  address1: z.string().min(3).max(150),
  dateOfBirth: z.string().min(3),
  idNumber: z.string().min(13).max(13),
  gender: z.string().min(3),
  contact: z.string().min(10).max(10),
  position: z.string().min(3),
  startDate: z.string().min(3),




});

export const newParentFormSchema = (type: string) => z.object({
  //new student form

  firstName: z.string().min(3),
  surname: z.string().min(3),
  address1: z.string().min(3).max(150),
  dateOfBirth: z.string().min(3),
  gender: z.string().min(3),
  idNumber : z.string().min(13).max(13),
  occupation: z.string().optional(),
  contactNumber: z.string().min(10).max(10),
  email: z.string().email(),
  workNumber: z.string().optional(),


});

// New Table: school_fees
export const schoolFeesSchema = () => z.object({
  year: z.number(),
  registrationFee: z.number(),
  age: z.string(),
  monthlyFee: z.number(),
  quarterlyFee: z.number(),
  yearlyFee: z.number(),
  siblingDiscountPrice: z.number(),
});

// New Table: student_fees
export const studentFeesSchema = () => z.object({
  schoolfeesSchemaId: z.string(),
  studentId: z.string(),
  year: z.number(),
  age: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  registrationFee: z.number(),
  fees: z.number(),
  totalFees: z.number(),
  paidAmount: z.number(),
  balance: z.number(),
  paymentFrequency: z.enum(['monthly', 'quarterly', 'yearly']),
  nextPaymentDate: z.string(),
});

// New Table: fee_transactions
export const feeTransactionSchema = z.object({
  studentId: z.string(),
  amount: z.number(),
  paymentMethod: z.string(),
  paymentDate: z.string(),
  feeType: z.enum(['registration', 're-registration', 'school-fees']),
});

// New Table: staff_salary
export const staffSalarySchema = z.object({
  staffId: z.string(),
  baseSalary: z.number(),
  bonuses: z.number().optional(),
  deductions: z.number().optional(),
  paymentDate: z.string(),
});


export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export interface IStuff {
  $id: string;
  firstName: string;
  secondName: string;
  surname: string;
  dateOfBirth: string;
  idNumber: string;
  contact: string;
  address1: string;
  gender: string;
  position: string;
}

export  interface IClass {
  $id: string;
  name : string;
  teacherId: string;
  teacherName: string;
}

export interface ITransactions {
  $id: string;
  studentId: string;
  firstName: string;
  surname: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
}

export interface IGrocery {
  $id: string;
  summery: string;
  totalPaid: number;
  store: string;
  date: string;
}


export interface IPettyCash {
  $id: string;
  itemName: string;
  quantity: number;
  price: number;
  store: string;
  category: string;
  date: string;
}

export interface IEvent{
  $id: string;
  eventName: string;
  amount: number;
  description: string;
  date: string;
}

export interface IEventTransaction{
  $id: string;
  eventId: string
  childId: string;
  childName: string;
  amount: number;
  datePaid: string;
  quantity: number;
}



export interface IStudent {
  $id: string;
  firstName: string;
  secondName: string;
  surname: string;
  address1:string;
  city: string;
  province: string;
  postalCode: string;
  dateOfBirth: string;
  gender: string;
  age: string;
  homeLanguage: string;
  allergies: string;
  medicalAidNumber: string;
  medicalAidScheme:string;
  studentClass: string;


  p1_relationship: string;
  p1_firstName: string;
  p1_surname: string;
  p1_address1: string;
  p1_city: string;
  p1_province: string;
  p1_postalCode: string;
  p1_dateOfBirth: string;
  p1_gender: string;
  p1_idNumber : string;
  p1_occupation: string;
  p1_phoneNumber:string;
  p1_email: string;
  p1_workNumber: string;
 
  p2_relationship: string;
  p2_firstName: string;
  p2_surname: string;
  p2_address1: string;
  p2_city: string;
  p2_province: string;
  p2_postalCode: string;
  p2_dateOfBirth: string;
  p2_gender: string;
  p2_idNumber: string;
  p2_occupation: string;
  p2_phoneNumber: string;
  p2_email: string;
  p2_workNumber: string;

  balance: number;
  lastPaid: string;
  studentStatus: string;

}


