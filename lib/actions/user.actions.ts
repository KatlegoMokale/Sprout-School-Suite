"use server";
import { getBaseUrl } from "../utils";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { connectToDatabase } from "../mongodb";
import Class from "../models/Class";
import Staff from "../models/Staff";
import Student from "../models/Student";
import Fee from "../models/Fee";
import Transaction from "../models/Transaction";
import SchoolFees from "../models/SchoolFees";
import PettyCash from "../models/PettyCash";
import Event from "../models/Event";
import Grocery from "../models/Grocery";
import StudentSchoolFees from "../models/StudentSchoolFees";
import Payment from "../models/Payment";
import EventTransaction from "../models/EventTransaction";

export const newClass = async (classData: NewClassParms) => {
  try {
    await connectToDatabase();
    const newClass = await Class.create(classData);
    return parseStringify(newClass);
  } catch (error) {
    console.error('Error creating new class:', error);
    throw new Error('Failed to create new class');
  }
}

export const newStuff = async (stuffData: NewStuffParams) => {
  try {
    await connectToDatabase();
    console.log('Creating staff with data:', JSON.stringify(stuffData, null, 2));
    const newStuff = await Staff.create(stuffData);
    console.log('Staff created successfully:', newStuff);
    return parseStringify(newStuff);
  } catch (error) {
    console.error('Error creating new staff:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if ('errInfo' in error) {
        console.error('Validation error details:', error.errInfo);
      }
    }
    throw new Error('Failed to create new staff');
  }
}

export async function updateStudentBalance(studentId: string, amount: number) {
  try {
    await connectToDatabase();
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $inc: { balance: -amount } },
      { new: true }
    );
    if (!student) {
      throw new Error('Student not found');
    }
    return parseStringify(student);
  } catch (error) {
    console.error('Error updating student balance:', error);
    throw new Error('Failed to update student balance');
  }
}

export async function updateStudentAmountPaid(id: string, paidAmount: number) {
  try {
    await connectToDatabase();
    const studentFees = await StudentSchoolFees.findByIdAndUpdate(
      id,
      { $set: { paidAmount } },
      { new: true }
    );
    if (!studentFees) {
      throw new Error('Student fees not found');
    }
    return parseStringify(studentFees);
  } catch (error) {
    console.error('Error updating student amount paid:', error);
    throw new Error('Failed to update student amount paid');
  }
}

export async function updateStudentRegBalance(id: string, balance: number) {
  try {
    await connectToDatabase();
    const studentFees = await StudentSchoolFees.findByIdAndUpdate(
      id,
      { $set: { balance } },
      { new: true }
    );
    if (!studentFees) {
      throw new Error('Student fees not found');
    }
    return parseStringify(studentFees);
  } catch (error) {
    console.error('Error updating student registration balance:', error);
    throw new Error('Failed to update student registration balance');
  }
}

export const newPayment = async (paymentData: NewPaymentParms) => {
  try {
    await connectToDatabase();
    const newPayment = await Payment.create(paymentData);
    return parseStringify(newPayment);
  } catch (error) {
    console.error('Error creating new payment:', error);
    throw new Error('Failed to create new payment');
  }
}

export const newSchoolFees = async (schoolFeesData: SchoolFeesSetup) => {
  try {
    await connectToDatabase();
    const newSchoolFees = await SchoolFees.create(schoolFeesData);
    return parseStringify(newSchoolFees);
  } catch (error) {
    console.error('Error creating new school fees:', error);
    throw new Error('Failed to create new school fees');
  }
}

export const newStudentRegistration = async (studentRegistration: StudentReg) => {
  try {
    await connectToDatabase();
    const newRegistration = await StudentSchoolFees.create(studentRegistration);
    return parseStringify(newRegistration);
  } catch (error) {
    console.error('Error creating new student registration:', error);
    throw new Error('Failed to create new student registration');
  }
}

export const newStudent = async (studentData: NewStudentParms) => {
  try {
    await connectToDatabase();
    const newStudent = await Student.create(studentData);
    return parseStringify(newStudent);
  } catch (error) {
    console.error('Error creating new student:', error);
    throw new Error('Failed to create new student');
  }
}

export const newPettyCash = async (data: NewPettyCashParms) => {
  try {
    await connectToDatabase();
    const newPettyCash = await PettyCash.create(data);
    return parseStringify(newPettyCash);
  } catch (error) {
    console.error('Error creating new petty cash:', error);
    throw new Error('Failed to create new petty cash');
  }
}

export const newEvent = async (data: NewEventParms) => {
  try {
    await connectToDatabase();
    const newEvent = await Event.create(data);
    return parseStringify(newEvent);
  } catch (error) {
    console.error('Error creating new event:', error);
    throw new Error('Failed to create new event');
  }
}

export const newEventTranaction = async (data: NewEventTransactionParms) => {
  try {
    await connectToDatabase();
    const newEventTransaction = await EventTransaction.create(data);
    return parseStringify(newEventTransaction);
  } catch (error) {
    console.error('Error creating new event transaction:', error);
    throw new Error('Failed to create new event transaction');
  }
}

export const newGrocery = async (data: NewGroceryParms) => {
  try {
    await connectToDatabase();
    const newGrocery = await Grocery.create(data);
    return parseStringify(newGrocery);
  } catch (error) {
    console.error('Error creating new grocery:', error);
    throw new Error('Failed to create new grocery');
  }
}

export const updateStudent = async (studentData: NewStudentParms, id: string) => {
  try {
    await connectToDatabase();
    const updatedStudent = await Student.findByIdAndUpdate(id, studentData, { new: true });
    if (!updatedStudent) {
      throw new Error('Student not found');
    }
    return parseStringify(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    throw new Error('Failed to update student');
  }
}

export const updateClass = async (
  classData: NewClassParms,
  id: string
) => {
  try {
    await connectToDatabase();
    const updatedClass = await Class.findByIdAndUpdate(id, classData, { new: true });
    if (!updatedClass) {
      throw new Error('Class not found');
    }
    return parseStringify(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    throw new Error('Failed to update class');
  }
}

export const updateStuff = async (
  stuffData: NewStuffParams,
  id: string
) => {
  try {
    await connectToDatabase();
    const updatedStuff = await Staff.findByIdAndUpdate(id, stuffData, { new: true });
    if (!updatedStuff) {
      throw new Error('Staff not found');
    }
    return parseStringify(updatedStuff);
  } catch (error) {
    console.error('Error updating staff:', error);
    throw new Error('Failed to update staff');
  }
}