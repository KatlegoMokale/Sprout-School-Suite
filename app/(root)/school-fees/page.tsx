'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select1, SelectContent, SelectItem, SelectTrigger, SelectValue1 } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, TrendingUp, CreditCard, Search, Landmark, Calendar } from 'lucide-react';
import Link from "next/link";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchStudents, selectStudents, selectStudentsStatus } from '@/lib/features/students/studentsSlice';
import { fetchClasses, selectClasses, selectClassesStatus } from '@/lib/features/classes/classesSlice';
import { fetchTransactions, selectTransactions, selectTransactionsStatus } from '@/lib/features/transactions/transactionsSlice';
import { fetchStudentSchoolFees, selectStudentSchoolFees, selectStudentSchoolFeesStatus } from '@/lib/features/studentSchoolFees/studentSchoolFeesSlice';
import { fetchSchoolFeesSetup, selectSchoolFeesSetup, selectSchoolFeesSetupStatus } from '@/lib/features/schoolFeesSetup/schoolFeesSetupSlice';
import { IStudent, IStudentFeesSchema, paymentFormSchema } from "@/lib/utils";
import { newPayment, updateStudentAmountPaid, updateStudentRegBalance } from "@/lib/actions/user.actions";
import CustomInputPayment from "@/components/ui/CustomInputPayment";
import SchoolFeesSetup from "@/components/ui/SchoolFeesSetup";
import TransactionImport from "@/components/ui/transaction-import";
import QuickRegistrationBoard from "@/components/ui/QuickRegistrationBoard";

const newPaymentFormSchema = paymentFormSchema();

export default function SchoolFeeManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const students = useSelector(selectStudents);
  const studentsStatus = useSelector(selectStudentsStatus);
  const classes = useSelector(selectClasses);
  const classesStatus = useSelector(selectClassesStatus);
  const transactions = useSelector(selectTransactions);
  const transactionsStatus = useSelector(selectTransactionsStatus);
  const studentSchoolFees = useSelector(selectStudentSchoolFees);
  const studentSchoolFeesStatus = useSelector(selectStudentSchoolFeesStatus);
  const schoolFeesSetup = useSelector(selectSchoolFeesSetup);
  const schoolFeesSetupStatus = useSelector(selectSchoolFeesSetupStatus);

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showUnregistered, setShowUnregistered] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkPrimaryStudentId, setLinkPrimaryStudentId] = useState("");
  const [linkSiblingIds, setLinkSiblingIds] = useState<string[]>([]);
  const [linkSiblingSearch, setLinkSiblingSearch] = useState("");
  const [isSavingLinks, setIsSavingLinks] = useState(false);
  const [isUpdatingBalances, setIsUpdatingBalances] = useState(false);

  const form = useForm<z.infer<typeof newPaymentFormSchema>>({
    resolver: zodResolver(newPaymentFormSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      amount: 0,
      paymentMethod: "",
      paymentDate: "",
      studentId: "",
      transactionType: "school-fees",
    },
  });

  useEffect(() => {
    if (studentsStatus === 'idle') dispatch(fetchStudents());
    if (classesStatus === 'idle') dispatch(fetchClasses());
    if (transactionsStatus === 'idle') dispatch(fetchTransactions());
    if (studentSchoolFeesStatus === 'idle') dispatch(fetchStudentSchoolFees());
    if (schoolFeesSetupStatus === 'idle') dispatch(fetchSchoolFeesSetup());
  }, [dispatch, studentsStatus, classesStatus, transactionsStatus, studentSchoolFeesStatus, schoolFeesSetupStatus]);

  const isLoading = studentsStatus === 'loading' || classesStatus === 'loading' || 
                    transactionsStatus === 'loading' || studentSchoolFeesStatus === 'loading' ||
                    schoolFeesSetupStatus === 'loading';

  const error = studentsStatus === 'failed' || classesStatus === 'failed' || 
                transactionsStatus === 'failed' || studentSchoolFeesStatus === 'failed' ||
                schoolFeesSetupStatus === 'failed'
                ? "Failed to fetch data. Please try again later." : null;

  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      (!selectedClass || student.studentClass === selectedClass) &&
      `${student.firstName} ${student.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (showUnregistered 
        ? !studentSchoolFees.some(fee => fee.studentId === student.$id && new Date(fee.startDate).getFullYear() === selectedYear)
        : studentSchoolFees.some(fee => fee.studentId === student.$id && new Date(fee.startDate).getFullYear() === selectedYear)
      )
    );
  }, [students, selectedClass, searchTerm, showUnregistered, studentSchoolFees, selectedYear]);

  useEffect(() => {
    if (filteredStudents.length === 0) {
      toast({
        title: "No Students Found",
        description: `There are no ${showUnregistered ? 'unregistered' : 'registered'} students for the year ${selectedYear}.`,
        variant: "destructive",
      });
    }
  }, [filteredStudents, showUnregistered, selectedYear]);

  const getClassName = (classId: string) => {
    if (!classId) return "Unknown";
    return classes.find((c) => c.$id === classId)?.name || classId;
  };

  const getAgeInMonths = (dateOfBirth: string) => {
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) return null;
    const now = new Date();
    let months =
      (now.getFullYear() - dob.getFullYear()) * 12 +
      (now.getMonth() - dob.getMonth());
    if (now.getDate() < dob.getDate()) months -= 1;
    return Math.max(0, months);
  };

  const toMonthsRange = (start: number, end: number, unit: "months" | "years") => {
    if (unit === "months") return { min: start, max: end };
    return { min: start * 12, max: end * 12 + 11 };
  };

  const createMissingStudentFeeRecord = async (student: IStudent) => {
    const currentYear = new Date().getFullYear();
    const ageInMonths = getAgeInMonths(student.dateOfBirth);

    const plansResponse = await fetch("/api/school-fees");
    if (!plansResponse.ok) {
      throw new Error("Failed to load school fee plans");
    }
    const allPlans = await plansResponse.json();
    const yearPlans = allPlans.filter((plan: any) => plan.year === currentYear);

    let selectedPlan =
      ageInMonths === null
        ? null
        : yearPlans
            .filter((plan: any) => {
              const { min, max } = toMonthsRange(plan.ageStart, plan.ageEnd, plan.ageUnit);
              return ageInMonths >= min && ageInMonths <= max;
            })
            .sort((a: any, b: any) => (a.ageEnd - a.ageStart) - (b.ageEnd - b.ageStart))[0] ?? null;

    if (!selectedPlan && student.studentClass) {
      const classMatch = classes.find((item) => item.$id === student.studentClass);
      if (classMatch && (classMatch as any).ageStart !== undefined) {
        selectedPlan =
          yearPlans.find(
            (plan: any) =>
              plan.ageStart === (classMatch as any).ageStart &&
              plan.ageEnd === (classMatch as any).ageEnd &&
              plan.ageUnit === (classMatch as any).ageUnit
          ) ?? null;
      }
    }

    if (!selectedPlan && yearPlans.length > 0) {
      selectedPlan = yearPlans[0];
    }

    if (!selectedPlan) {
      throw new Error("No school fee setup found for current year");
    }

    const now = new Date();
    const monthsRemaining = 12 - now.getMonth();
    const totalFees =
      selectedPlan.registrationFee + selectedPlan.monthlyFee * monthsRemaining;

    const createResponse = await fetch("/api/student-fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student.$id,
        schoolFeesRegId: selectedPlan.$id,
        startDate: now.toISOString().split("T")[0],
        endDate: `${currentYear}-12-31`,
        fees: selectedPlan.monthlyFee,
        totalFees,
        paidAmount: 0,
        balance: totalFees,
        paymentFrequency: "monthly",
        paymentDate: 1,
      }),
    });

    const createData = await createResponse.json();
    if (!createResponse.ok) {
      throw new Error(createData?.message || "Failed to create student fee record");
    }

    await fetch(`/api/students/${student.$id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ balance: totalFees }),
    });

    return createData?.data;
  };

  const handlePrimaryStudentChange = (studentId: string) => {
    setLinkPrimaryStudentId(studentId);
    setLinkSiblingSearch("");
    const student = students.find((item) => item.$id === studentId);
    setLinkSiblingIds(student?.linkedStudentIds || []);
  };

  const toggleSiblingSelection = (studentId: string, checked: boolean) => {
    setLinkSiblingIds((prev) =>
      checked ? Array.from(new Set([...prev, studentId])) : prev.filter((id) => id !== studentId)
    );
  };

  const handleSaveSiblingLinks = async () => {
    if (!linkPrimaryStudentId) {
      toast({
        title: "Select Student",
        description: "Please choose the primary child first.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingLinks(true);
    try {
      const response = await fetch("/api/students/link-siblings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: linkPrimaryStudentId,
          siblingIds: linkSiblingIds,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to save sibling links");
      }

      await dispatch(fetchStudents());
      toast({
        title: "Success",
        description: "Sibling links updated successfully.",
      });
      setIsLinkDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update sibling links.",
        variant: "destructive",
      });
    } finally {
      setIsSavingLinks(false);
    }
  };

  const getStudentBalance = (studentId: string) => {
    const studentFee = studentSchoolFees.find(fee => fee.studentId === studentId);
    return studentFee ? studentFee.balance : 0;
  };

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  }, []);

  const paidAsOfTodayByStudent = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.forEach((transaction) => {
      const paymentDate = new Date(transaction.paymentDate);
      if (Number.isNaN(paymentDate.getTime()) || paymentDate > today) return;
      totals[transaction.studentId] = (totals[transaction.studentId] || 0) + (transaction.amount || 0);
    });
    return totals;
  }, [transactions, today]);

  const getCurrentPaidAmount = (studentId: string, totalFees: number) => {
    const paid = paidAsOfTodayByStudent[studentId] || 0;
    return Math.max(0, Math.min(paid, totalFees));
  };

  const generateStatementItems = (
    studentTransactions: any[],
    fees: IStudentFeesSchema[],
    schoolFees: any[]
  ) => {
    const items: { date: string; debit: number; credit: number; balance: number }[] = [];
    let runningBalance = 0;
    const now = new Date();

    const sortedFees = [...fees].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (const fee of sortedFees) {
      const startDate = new Date(fee.startDate);
      const endDate = new Date(fee.endDate);
      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) continue;
      if (startDate > now) continue;

      const plan = schoolFees.find((setup) => setup.$id === fee.schoolFeesRegId);
      if (plan?.registrationFee) {
        runningBalance += plan.registrationFee;
        items.push({
          date: startDate.toISOString(),
          debit: plan.registrationFee,
          credit: 0,
          balance: runningBalance,
        });
      }

      if (fee.competitionWinner) {
        const competitionCredit = Math.max(
          0,
          (fee.totalFees || 0) - Number(plan?.registrationFee || 0)
        );

        if (competitionCredit > 0) {
          runningBalance -= competitionCredit;
          items.push({
            date: startDate.toISOString(),
            debit: 0,
            credit: competitionCredit,
            balance: runningBalance,
          });
        }

        continue;
      }

      runningBalance += fee.fees;
      items.push({
        date: startDate.toISOString(),
        debit: fee.fees,
        credit: 0,
        balance: runningBalance,
      });

      const cursor = new Date(startDate);
      cursor.setMonth(cursor.getMonth() + 1);

      while (cursor <= endDate && cursor <= now) {
        runningBalance += fee.fees;
        items.push({
          date: cursor.toISOString(),
          debit: fee.fees,
          credit: 0,
          balance: runningBalance,
        });
        cursor.setMonth(cursor.getMonth() + 1);
      }
    }

    for (const transaction of studentTransactions) {
      const paymentDate = new Date(transaction.paymentDate);
      if (Number.isNaN(paymentDate.getTime()) || paymentDate > now) continue;
      runningBalance -= transaction.amount;
      items.push({
        date: paymentDate.toISOString(),
        debit: 0,
        credit: transaction.amount,
        balance: runningBalance,
      });
    }

    items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let recomputed = 0;
    items.forEach((item) => {
      recomputed += item.debit - item.credit;
      item.balance = recomputed;
    });

    return items;
  };

  const currentStatementBalanceByStudent = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((student) => {
      const fees = studentSchoolFees.filter((fee) => fee.studentId === student.$id);
      const txns = transactions.filter((transaction) => transaction.studentId === student.$id);
      const statementItems = generateStatementItems(txns, fees, schoolFeesSetup);
      map[student.$id] =
        statementItems.length > 0
          ? Number(statementItems[statementItems.length - 1].balance.toFixed(2))
          : 0;
    });
    return map;
  }, [students, studentSchoolFees, transactions, schoolFeesSetup]);

  const getCurrentBalanceForFee = (fee: IStudentFeesSchema) =>
    currentStatementBalanceByStudent[fee.studentId] ?? 0;

  const getCurrentBalanceForStudent = (studentId: string) => {
    return currentStatementBalanceByStudent[studentId] ?? 0;
  };

  const getStudentLastPaid = (studentId: string) => {
    const studentTransactions = transactions.filter((t) => {
      const paymentDate = new Date(t.paymentDate);
      return t.studentId === studentId && !Number.isNaN(paymentDate.getTime()) && paymentDate <= today;
    });
    if (studentTransactions.length === 0) return null;
    return Math.max(...studentTransactions.map(t => new Date(t.paymentDate).getTime()));
  };

  const isOutstanding = (student: IStudent) => {
    return getCurrentBalanceForStudent(student.$id) > 0;
  };

  const totalFees = studentSchoolFees.reduce((sum, fee) => sum + fee.totalFees, 0);
  const totalPaid = studentSchoolFees.reduce(
    (sum, fee) => sum + getCurrentPaidAmount(fee.studentId, fee.totalFees || 0),
    0
  );
  const totalOutstanding = students.reduce(
    (sum, student) => sum + getCurrentBalanceForStudent(student.$id),
    0
  );

  const summaryCards = [
    { title: "Total Fees", amount: totalFees, icon: DollarSign, color: "bg-blue-500" },
    { title: "Total Paid", amount: totalPaid, icon: TrendingUp, color: "bg-green-500" },
    { title: "Outstanding", amount: totalOutstanding, icon: CreditCard, color: "bg-yellow-500" },
  ];

  const normalizeText = (value: string) => value.trim().toLowerCase();
  const normalizeName = (firstName: string, surname: string) => {
    const a = normalizeText(firstName);
    const b = normalizeText(surname);
    return `${a} ${b}`.trim();
  };

  const onSubmit = async (data: z.infer<typeof newPaymentFormSchema>) => {
    setIsLoadingForm(true);
    try {
      // Temporary matching strategy: resolve account by name+surname in either order.
      const inputForward = normalizeName(data.firstName, data.surname);
      const inputReverse = normalizeName(data.surname, data.firstName);

      const matchedStudent = students.find(
        (student) => {
          const studentForward = normalizeName(student.firstName, student.surname);
          return studentForward === inputForward || studentForward === inputReverse;
        }
      );

      if (!matchedStudent) {
        throw new Error("Student match not found by name and surname");
      }

      let studentFee = studentSchoolFees.find(
        (fee) => fee.studentId === matchedStudent.$id
      );
      if (!studentFee) {
        const createdFee = await createMissingStudentFeeRecord(matchedStudent);
        await dispatch(fetchStudentSchoolFees());
        studentFee = createdFee;
      }

      if (!studentFee) {
        throw new Error("Student fee information not found");
      }

      const currentBalance = getCurrentBalanceForStudent(studentFee.studentId);
      const currentPaid = Math.max(0, (studentFee.totalFees || 0) - currentBalance);
      const newBalance = Math.max(0, currentBalance - data.amount);
      const newPaidAmount = Math.min((studentFee.totalFees || 0), currentPaid + data.amount);
      const paymentPayload = {
        ...data,
        studentId: matchedStudent.$id,
      };

      await updateStudentAmountPaid(studentFee.$id, newPaidAmount);
      await updateStudentRegBalance(studentFee.$id, newBalance);
      await newPayment(paymentPayload);
      await dispatch(fetchStudentSchoolFees());
      await dispatch(fetchTransactions());

      toast({
        title: "Success",
        description: "Payment has been recorded successfully.",
      });
      form.reset({
        firstName: "",
        surname: "",
        amount: 0,
        paymentMethod: "",
        paymentDate: "",
        studentId: "",
        transactionType: "school-fees",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleUpdateBalances = async () => {
    if (studentSchoolFees.length === 0) {
      toast({
        title: "No Records",
        description: "There are no student fee records to update.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingBalances(true);
    try {
      const results = await Promise.allSettled(
        studentSchoolFees.map(async (fee) => {
          const recalculatedBalance = getCurrentBalanceForStudent(fee.studentId);
          const recalculatedPaid = Math.max(0, (fee.totalFees || 0) - recalculatedBalance);

          const updateFeeResponse = await fetch(`/api/student-fees/${fee.$id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paidAmount: recalculatedPaid,
              balance: recalculatedBalance,
            }),
          });
          if (!updateFeeResponse.ok) {
            throw new Error(`Failed to update student fee for ${fee.studentId}`);
          }

          const student = students.find((item) => item.$id === fee.studentId);
          if (student) {
            await fetch(`/api/students/${student.$id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ balance: recalculatedBalance }),
            });
          }
        })
      );

      const failed = results.filter((result) => result.status === "rejected");
      await dispatch(fetchStudentSchoolFees());
      await dispatch(fetchStudents());

      if (failed.length > 0) {
        toast({
          title: "Partial Update",
          description: `${studentSchoolFees.length - failed.length} updated, ${failed.length} failed.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Balances Updated",
          description: "Balances and paid amounts were recalculated to today's date.",
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not update balances.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingBalances(false);
    }
  };

  const getStudentInfo = (studentId: string) => {
    const student = students.find(s => s.$id === studentId);
    const studentFee = studentSchoolFees.find(fee => fee.studentId === studentId);
    if (!student || !studentFee) return null;

    const studentTransactions = transactions.filter(t => t.studentId === studentId);

    return (
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold border-b pb-2">Account Statement</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-semibold">Student Information</h4>
            <p><strong>Name:</strong> {student.firstName} {student.surname}</p>
            <p><strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Age:</strong> {student.age} years</p>
            <p><strong>Address:</strong> {student.address1}</p>
            <p><strong>Class:</strong> {getClassName(student.studentClass || '')}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Parent/Guardian Information</h4>
            <p><strong>Name:</strong> {student.p1_firstName} {student.p1_surname}</p>
            <p><strong>Email:</strong> {student.p1_email}</p>
            <p><strong>Phone:</strong> {student.p1_phoneNumber}</p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold">Financial Summary</h4>
          <p><strong>Total Fees:</strong> R {studentFee.totalFees.toFixed(2)}</p>
          <p><strong>Paid Amount:</strong> R {studentFee.paidAmount.toFixed(2)}</p>
          <p><strong>Current Balance:</strong> R {studentFee.balance.toFixed(2)}</p>
          <p><strong>Payment Frequency:</strong> {studentFee.paymentFrequency}</p>
          <p><strong>Payment Date:</strong> {studentFee.paymentDate}</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold">Transaction History</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(transaction.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>R {transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">School Fee Management</h1>
        <div className="flex items-center gap-4">
          <TransactionImport students={students} />
          <Button variant="outline" onClick={handleUpdateBalances} disabled={isUpdatingBalances}>
            {isUpdatingBalances ? "Updating Balances..." : "Update Balances"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Quick Register</Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-4xl">
              <DialogHeader>
                <DialogTitle>Quick Student Registration</DialogTitle>
                <DialogDescription>
                  Drag learners from unregistered to registered, or click register on each card.
                </DialogDescription>
              </DialogHeader>
              <QuickRegistrationBoard
                students={students}
                studentSchoolFees={studentSchoolFees}
                onRefresh={async () => {
                  await dispatch(fetchStudentSchoolFees());
                  await dispatch(fetchStudents());
                }}
              />
            </DialogContent>
          </Dialog>
          <Link href="/school-fees/view">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              View School Fees
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Create New School Fees
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Create New School Fees</DialogTitle>
                <DialogDescription>Set up new school fees for a class.</DialogDescription>
              </DialogHeader>
              <SchoolFeesSetup />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="hidden">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`${card.color} text-white`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                  <card.icon className="h-5 w-5 opacity-75" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R {card.amount.toFixed(2)}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle>Student Fee Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Student List</TabsTrigger>
              <TabsTrigger value="payment">Record Payment</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="flex items-center space-x-2 mb-4">
                <Search className="w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Select1
                  value={selectedClass || "all"}
                  onValueChange={(value) =>
                    setSelectedClass(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue1 placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.$id} value={cls.$id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select1>
                <Select1
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue1 placeholder="Filter by year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearRange.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select1>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showUnregistered"
                    checked={showUnregistered}
                    onCheckedChange={(checked) =>
                      setShowUnregistered(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="showUnregistered"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show Unregistered
                  </label>
                </div>
                <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Link Children</Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Link Siblings</DialogTitle>
                      <DialogDescription>
                        Select one child and link their siblings for discount calculations.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Primary Child</Label>
                        <Select1
                          value={linkPrimaryStudentId}
                          onValueChange={handlePrimaryStudentChange}
                        >
                          <SelectTrigger>
                            <SelectValue1 placeholder="Select primary child" />
                          </SelectTrigger>
                          <SelectContent>
                            {students.map((student) => (
                              <SelectItem key={student.$id} value={student.$id}>
                                {student.firstName} {student.surname} - {getClassName(student.studentClass || "")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select1>
                      </div>
                      {linkPrimaryStudentId && (
                        <div className="space-y-2">
                          <Input
                            placeholder="Search sibling by name..."
                            value={linkSiblingSearch}
                            onChange={(e) => setLinkSiblingSearch(e.target.value)}
                          />
                          <div className="border rounded-md p-3 max-h-64 overflow-y-auto space-y-2">
                          {students
                            .filter((student) => student.$id !== linkPrimaryStudentId)
                            .filter((student) =>
                              `${student.firstName} ${student.surname}`
                                .toLowerCase()
                                .includes(linkSiblingSearch.toLowerCase())
                            )
                            .map((student) => {
                              const checked = linkSiblingIds.includes(student.$id);
                              return (
                                <div key={student.$id} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(value) =>
                                      toggleSiblingSelection(student.$id, Boolean(value))
                                    }
                                  />
                                  <span className="text-sm">
                                    {student.firstName} {student.surname} - {getClassName(student.studentClass || "")}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveSiblingLinks} disabled={isSavingLinks}>
                          {isSavingLinks ? "Saving..." : "Save Links"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Last Paid</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const studentFee = studentSchoolFees.find(
                        (fee) => fee.studentId === student.$id
                      );
                      return (
                        <TableRow key={student.$id}>
                          <TableCell>
                            {student.firstName} {student.surname}
                          </TableCell>
                          <TableCell>
                            {getClassName(student.studentClass || "")}
                          </TableCell>
                          <TableCell>R {getCurrentBalanceForStudent(student.$id).toFixed(2)}</TableCell>
                          <TableCell>
                            {getStudentLastPaid(student.$id)
                              ? new Date(
                                  getStudentLastPaid(student.$id)!
                                ).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>{studentFee?.paymentDate || ""}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                isOutstanding(student)
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {isOutstanding(student) ? "Outstanding" : "Paid"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/school-fees/${student.$id}`}
                              className="w-full"
                            >
                              View Account
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="payment">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Record Payment
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose student, amount, method and date, then save.
                      </p>
                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student</FormLabel>
                            <Select1
                              onValueChange={(value) => {
                                field.onChange(value);
                                const student = students.find(
                                  (item) => item.$id === value
                                );
                                form.setValue("firstName", student?.firstName || "");
                                form.setValue("surname", student?.surname || "");
                                form.setValue("transactionType", "school-fees");
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue1 placeholder="Select a student" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {filteredStudents.map((student) => (
                                  <SelectItem key={student.$id} value={student.$id}>
                                    {student.firstName} {student.surname} -{" "}
                                    {getClassName(student.studentClass || "")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select1>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <CustomInputPayment
                        name="amount"
                        control={form.control}
                        placeholder="Amount"
                        label="Amount"
                        type="number"
                      />
                      <CustomInputPayment
                        name="paymentMethod"
                        placeholder="Select Method"
                        control={form.control}
                        label="Payment Method"
                        select={true}
                        options={[
                          { label: "Cash", value: "cash" },
                          { label: "EFT", value: "EFT" },
                          { label: "Card", value: "card" },
                        ]}
                      />
                      <CustomInputPayment
                        name="paymentDate"
                        label="Payment Date"
                        control={form.control}
                        placeholder="Payment Date"
                        type="date"
                      />
                      <Button type="submit" disabled={isLoadingForm} className="mt-2">
                        {isLoadingForm ? "Processing..." : "Record Payment"}
                      </Button>
                    </div>
                    <div className="border-l pl-4">
                      {form.watch("studentId") &&
                        getStudentInfo(form.watch("studentId"))}
                    </div>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedStudent && (
        <Dialog
          open={!!selectedStudent}
          onOpenChange={() => setSelectedStudent(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <div className="col-span-3">
                  {selectedStudent.firstName} {selectedStudent.surname}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Class</Label>
                <div className="col-span-3">
                  {getClassName(selectedStudent.studentClass || "")}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Balance</Label>
                <div className="col-span-3">
                  R {getStudentBalance(selectedStudent.$id).toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Last Paid</Label>
                <div className="col-span-3">
                  {getStudentLastPaid(selectedStudent.$id)
                    ? new Date(
                        getStudentLastPaid(selectedStudent.$id)!
                      ).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Next Payment</Label>
                <div className="col-span-3">
                  {studentSchoolFees.find(
                    (fee) => fee.studentId === selectedStudent.$id
                  )?.paymentDate || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      isOutstanding(selectedStudent)
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {isOutstanding(selectedStudent) ? "Outstanding" : "Paid"}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
