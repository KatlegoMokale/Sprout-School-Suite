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
  transactionType: z.string().min(3),
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


export const studentFormSchema = () => z.object({
  // Student Information
  firstName: z.string().min(1, "First name is required"),
  secondName: z.string().optional(),
  surname: z.string().min(1, "Surname is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.string(),
  gender: z.string().min(1, "Gender is required"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().default("South Africa")
  }),
  homeLanguage: z.string().min(1, "Home language is required"),
  allergies: z.string().optional(),
  medicalAidNumber: z.string().optional(),
  medicalAidScheme: z.string().optional(),
  studentClass: z.string().min(1, "Class is required"),
  studentStatus: z.enum(["active", "inactive", "graduated"]).default("active"),
  balance: z.number().min(0).default(0),
  lastPaid: z.string().optional(),

  // Parent 1 Information
  parent1: z.object({
    relationship: z.string().min(1, "Relationship is required"),
    firstName: z.string().min(1, "First name is required"),
    surname: z.string().min(1, "Surname is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    idNumber: z.string().min(1, "ID number is required"),
    gender: z.string().min(1, "Gender is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    address: z.object({
      street: z.string().min(1, "Street address is required"),
      city: z.string().min(1, "City is required"),
      province: z.string().min(1, "Province is required"),
      postalCode: z.string().min(1, "Postal code is required"),
      country: z.string().default("South Africa")
    }),
    occupation: z.string().optional(),
    workNumber: z.string().optional()
  }),

  // Parent 2 Information (all optional)
  parent2: z.object({
    relationship: z.string().optional(),
    firstName: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    phoneNumber: z.string().optional(),
    idNumber: z.string().optional(),
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      province: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().default("South Africa").optional()
    }).optional(),
    occupation: z.string().optional(),
    workNumber: z.string().optional()
  }).optional()
});


export const newStuffFormSchema = () => z.object({
  firstName: z.string().min(3),
  secondName: z.string().optional(),
  surname: z.string().min(3),
  dateOfBirth: z.string().min(3),
  gender: z.enum(['male', 'female']),
  idNumber: z.string().min(13).max(13),
  position: z.string().min(3),
  contact: z.string().min(10).max(10),
  email: z.string().email(),
  address: z.object({
    street: z.string().min(3),
    city: z.string().min(3),
    province: z.string().min(3),
    postalCode: z.string().min(3),
    country: z.string().min(3)
  }).optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

export const classAndFeesFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Class name must be at least 3 characters"),
  ageStart: z.number().min(0).max(12),
  ageEnd: z.number().min(0).max(12),
  ageUnit: z.enum(["months", "years"]),
  teacherId: z.string().min(3, "Teacher ID must be at least 3 characters"),
  teacherName: z.string().min(3, "Teacher name must be at least 3 characters"),
  monthlyFee: z.number().min(0),
})

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
// export const schoolFeesSchema = () => z.object({
//   year: z.number(),
//   registrationFee: z.number(),
//   age: z.string(),
//   monthlyFee: z.number(),
//   yearlyFee: z.number(),
//   siblingDiscountPrice: z.number(),
// });

// New Table: school_fees
export const schoolFeesSchema = () => z.object({
  year: z.number(),
  registrationFee: z.number(),
  ageStart: z.number().min(0).max(12),
  ageEnd: z.number().min(0).max(12),
  ageUnit: z.enum(["months", "years"]),
  monthlyFee: z.number(),
  yearlyFee: z.number(),
  siblingDiscountPrice: z.number(),
});




// New Table: student_fees
export const studentFeesSchema = () => z.object({
  studentId: z.string(),
  schoolFeesRegId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  fees: z.number(),
  totalFees: z.number(),
  paidAmount: z.number().optional(),
  balance: z.number(),
  paymentFrequency: z.enum(['monthly', 'quarterly', 'yearly']),
  paymentDate: z.number(),
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
export const staffSalarySchema = () => z.object({
  staffId: z.string().min(1, "Staff member is required"),
  baseSalary: z.number().min(0, "Base salary must be a positive number"),
  bonuses: z.number().min(0, "Bonuses must be a positive number"),
  deductions: z.number().min(0, "Deductions must be a positive number"),
  paymentDate: z.string().min(1, "Payment date is required"),
  staffStatus: z.enum(['Active', 'Non-Active']),
});


export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export const positionColors = {
  teacher: "bg-emerald-500",
  cleaner: "bg-amber-500",
  administrator: "bg-sky-500",
}

export interface IStuff {
  _id: string;
  firstName: string;
  secondName?: string;
  surname: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  idNumber: string;
  position: string;
  contact: string;
  email: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface IClass {
  _id: string;
  name: string;
  age: string;
  teacherId: string;
  teacherName: string;
  capacity: number;
  currentEnrollment: number;
  schedule: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ITransactions {
  $id: string;
  studentId: string;
  firstName: string;
  surname: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionType: string;
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


export interface ISchoolFeesReg {
  $id: string;
  year: number;
  registrationFee: number;
  ageStart: number;
  ageEnd: number;
  ageUnit: string;
  monthlyFee: number;
  yearlyFee: number,
  siblingDiscountPrice: number,
}


export interface IStudent {
  _id?: string;
  firstName: string;
  secondName?: string;
  surname: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  dateOfBirth: string;
  gender: string;
  age: string;
  homeLanguage: string;
  allergies?: string;
  medicalAidNumber?: string;
  medicalAidScheme?: string;
  studentClass: string;
  parent1: {
    relationship: string;
    firstName: string;
    surname: string;
    address: {
      street: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
    };
    dateOfBirth: string;
    gender: string;
    idNumber: string;
    occupation?: string;
    phoneNumber: string;
    email: string;
    workNumber?: string;
  };
  parent2?: {
    relationship?: string;
    firstName?: string;
    surname?: string;
    address?: {
      street?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      country?: string;
    };
    dateOfBirth?: string;
    gender?: string;
    idNumber?: string;
    occupation?: string;
    phoneNumber?: string;
    email?: string;
    workNumber?: string;
  };
  balance: number;
  lastPaid?: string;
  studentStatus: "active" | "inactive" | "graduated";
  createdAt?: Date;
  updatedAt?: Date;
}



export interface ISchoolFees {
  $id: string
  year: number
  registrationFee: number;
  ageStart: number
  ageEnd: number
  ageUnit: string
  monthlyFee: number
  yearlyFee: number
}

export interface IStudentFeesSchema {
  $id: string; 
  studentId: string;
  schoolFeesRegId: string;
  startDate: string;
  endDate: string;
  fees: number;
  totalFees: number;
  paidAmount: number;
  balance: number;
  paymentFrequency: string;
  paymentDate: number
};

export interface NewStudentParms {
  firstName: string;
  secondName?: string;
  surname: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  dateOfBirth: string;
  gender: string;
  age: string;
  homeLanguage: string;
  allergies?: string;
  medicalAidNumber?: string;
  medicalAidScheme?: string;
  studentClass: string;
  studentStatus: 'active' | 'inactive' | 'graduated';
  balance: number;
  lastPaid?: string;
  parent1: {
    relationship: string;
    firstName: string;
    surname: string;
    email: string;
    phoneNumber: string;
    idNumber: string;
    gender: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
    };
    occupation?: string;
    workNumber?: string;
  };
  parent2?: {
    relationship?: string;
    firstName?: string;
    surname?: string;
    email?: string;
    phoneNumber?: string;
    idNumber?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: {
      street?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      country?: string;
    };
    occupation?: string;
    workNumber?: string;
  };
}