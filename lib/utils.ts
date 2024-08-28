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

export const paymentFormSchema = () => z.object({
  //new payment Form
  studentId: z.string().min(3),
  firstName: z.string().min(3),
  surname: z.string().min(3),
  amount: z.string().min(3),
  paymentMethod: z.string().min(3),
  paymentDate: z.string().min(3),
  datecreated: z.string().min(3),

});


export const newStudentFormSchema = () => z.object({
  //new student form

  firstName: z.string().min(3),
  secondName: z.string().min(3),
  surname: z.string().min(3),
  address1: z.string().min(3).max(100),
  city: z.string().min(3).max(50),
  province: z.string().min(3).max(20),
  postalCode: z.string().min(3).max(6),
  dateOfBirth: z.string().min(3),
  gender: z.string().min(3),
  age: z.string().min(1).max(3),
  homeLanguage: z.string().min(3),
  allergies: z.string().optional(),
  medicalAidNumber: z.string().optional(),
  medicalAidScheme: z.string().optional(),
  class: z.string().optional(),


  p1_relationship: z.string().min(3),
  p1_firstName: z.string().min(3),
  p1_surname: z.string().min(3),
  p1_address1: z.string().min(3).max(100),
  p1_city: z.string().min(3).max(50),
  p1_province: z.string().min(3).max(20),
  p1_postalCode: z.string().min(3).max(6),
  p1_dateOfBirth: z.string().min(3),
  p1_gender: z.string().min(3),
  p1_idNumber : z.string().min(13).max(13),
  p1_occupation: z.string().optional(),
  p1_phoneNumber: z.string().min(10).max(10),
  p1_email: z.string().email().optional(),
  p1_workNumber: z.string().optional(),

  p2_relationship: z.string().min(3),
  p2_firstName: z.string().min(3),
  p2_surname: z.string().min(3),
  p2_address1: z.string().min(3).max(100),
  p2_city: z.string().min(3).max(50),
  p2_province: z.string().min(3).max(20),
  p2_postalCode: z.string().min(3).max(6),
  p2_dateOfBirth: z.string().min(3),
  p2_gender: z.string().min(3),
  p2_idNumber : z.string().min(13).max(13),
  p2_occupation: z.string().optional(),
  p2_phoneNumber: z.string().min(10).max(10),
  p2_email: z.string().email().optional(),
  p2_workNumber: z.string().optional(),



});

export const newParentFormSchema = (type: string) => z.object({
  //new student form

  firstName: z.string().min(3),
  surname: z.string().min(3),
  address1: z.string().min(3).max(100),
  city: z.string().min(3).max(50),
  province: z.string().min(3).max(20),
  postalCode: z.string().min(3).max(6),
  dateOfBirth: z.string().min(3),
  gender: z.string().min(3),
  idNumber : z.string().min(13).max(13),
  occupation: z.string().optional(),
  contactNumber: z.string().min(10).max(10),
  email: z.string().email(),
  workNumber: z.string().optional(),


});

