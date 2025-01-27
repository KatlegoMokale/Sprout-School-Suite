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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select1, SelectContent, SelectItem, SelectTrigger, SelectValue1 } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, TrendingUp, CreditCard, Search, Landmark } from 'lucide-react';
import Link from "next/link";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchStudents, selectStudents, selectStudentsStatus } from '@/lib/features/students/studentsSlice';
import { fetchClasses, selectClasses, selectClassesStatus } from '@/lib/features/classes/classesSlice';
import { fetchTransactions, selectTransactions, selectTransactionsStatus } from '@/lib/features/transactions/transactionsSlice';
import { fetchStudentSchoolFees, selectStudentSchoolFees, selectStudentSchoolFeesStatus } from '@/lib/features/studentSchoolFees/studentSchoolFeesSlice';
import { IStudent, IStudentFeesSchema, paymentFormSchema } from "@/lib/utils";
import { newPayment, updateStudentAmountPaid, updateStudentRegBalance } from "@/lib/actions/user.actions";
import CustomInputPayment from "@/components/ui/CustomInputPayment";
import SchoolFeesSetup from "@/components/ui/SchoolFeesSetup";

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

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showUnregistered, setShowUnregistered] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);

  const form = useForm<z.infer<typeof newPaymentFormSchema>>({
    resolver: zodResolver(newPaymentFormSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      amount: 0,
      paymentMethod: "",
      paymentDate: "",
      studentId: "",
      transactionType: "fees",
    },
  });

  useEffect(() => {
    if (studentsStatus === 'idle') dispatch(fetchStudents());
    if (classesStatus === 'idle') dispatch(fetchClasses());
    if (transactionsStatus === 'idle') dispatch(fetchTransactions());
    if (studentSchoolFeesStatus === 'idle') dispatch(fetchStudentSchoolFees());
  }, [dispatch, studentsStatus, classesStatus, transactionsStatus, studentSchoolFeesStatus]);

  const isLoading = studentsStatus === 'loading' || classesStatus === 'loading' || 
                    transactionsStatus === 'loading' || studentSchoolFeesStatus === 'loading';

  const error = studentsStatus === 'failed' || classesStatus === 'failed' || 
                transactionsStatus === 'failed' || studentSchoolFeesStatus === 'failed' 
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
    return classes.find((c) => c.$id === classId)?.name || "Unknown";
  };

  const getStudentBalance = (studentId: string) => {
    const studentFee = studentSchoolFees.find(fee => fee.studentId === studentId);
    return studentFee ? studentFee.balance : 0;
  };

  const getStudentLastPaid = (studentId: string) => {
    const studentTransactions = transactions.filter(t => t.studentId === studentId);
    if (studentTransactions.length === 0) return null;
    return Math.max(...studentTransactions.map(t => new Date(t.paymentDate).getTime()));
  };

  const isOutstanding = (student: IStudent) => {
    const studentFee = studentSchoolFees.find(fee => fee.studentId === student.$id);
    if (!studentFee) return false;
    return new Date(studentFee.paymentDate).getTime() <= Date.now();
  };

  const totalFees = studentSchoolFees.reduce((sum, fee) => sum + fee.totalFees, 0);
  const totalPaid = studentSchoolFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalOutstanding = studentSchoolFees.reduce((sum, fee) => sum + fee.balance, 0);

  const summaryCards = [
    { title: "Total Fees", amount: totalFees, icon: DollarSign, color: "bg-blue-500" },
    { title: "Total Paid", amount: totalPaid, icon: TrendingUp, color: "bg-green-500" },
    { title: "Outstanding", amount: totalOutstanding, icon: CreditCard, color: "bg-yellow-500" },
  ];

  const onSubmit = async (data: z.infer<typeof newPaymentFormSchema>) => {
    setIsLoadingForm(true);
    try {
      const studentFee = studentSchoolFees.find((fee) => fee.studentId === data.studentId);
      if (!studentFee) {
        throw new Error("Student fee information not found");
      }

      const newBalance = studentFee.balance - data.amount;
      const newPaidAmount = studentFee.paidAmount + data.amount;

      await updateStudentAmountPaid(studentFee.$id, newPaidAmount);
      await updateStudentRegBalance(studentFee.$id, newBalance);
      await newPayment(data);

      toast({
        title: "Success",
        description: "Payment has been recorded successfully.",
      });
      form.reset();
      setPaymentStep(1);
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
      <div className="hidden">
        <h1 className="text-3xl font-bold mb-8">School Fee Management</h1>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Landmark className="h-4 w-4 mr-2" />
                  Create New School Fees
                </Button>
              </DialogTrigger>
              <DialogContent className="container">
                <DialogTitle hidden>New School Fees</DialogTitle>
                <SchoolFeesSetup />
              </DialogContent>
            </Dialog>
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
                          <TableCell>
                            R {(studentFee?.balance || 0).toFixed(2)}
                          </TableCell>
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
                      {paymentStep === 1 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-4">
                            Step 1: Select Year
                          </h2>
                          <Select1
                            value={selectedYear.toString()}
                            onValueChange={(value) =>
                              setSelectedYear(parseInt(value))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue1 placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {yearRange.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select1>
                          <Button
                            className="mt-4"
                            onClick={() => setPaymentStep(2)}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                      {paymentStep === 2 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-4">
                            Step 2: Select Student and Transaction Type
                          </h2>
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
                                      (student) => student.$id === value
                                    );
                                    form.setValue(
                                      "firstName",
                                      student?.firstName || ""
                                    );
                                    form.setValue(
                                      "surname",
                                      student?.surname || ""
                                    );
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
                                      <SelectItem
                                        key={student.$id}
                                        value={student.$id}
                                      >
                                        {student.firstName} {student.surname} -{" "}
                                        {getClassName(
                                          student.studentClass || ""
                                        )}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select1>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <CustomInputPayment
                            name="transactionType"
                            control={form.control}
                            placeholder="Transaction Type"
                            label="Transaction Type"
                            select={true}
                            options={[
                              { label: "School Fees", value: "fees" },
                              {
                                label: "Registration Fee",
                                value: "registration",
                              },
                            ]}
                          />
                          <div className="flex justify-between mt-4">
                            <Button onClick={() => setPaymentStep(1)}>
                              Previous
                            </Button>
                            <Button onClick={() => setPaymentStep(3)}>
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                      {paymentStep === 3 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-4">
                            Step 3: Payment Details
                          </h2>
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
                          <div className="flex justify-between mt-4">
                            <Button onClick={() => setPaymentStep(2)}>
                              Previous
                            </Button>
                            <Button type="submit" disabled={isLoadingForm}>
                              {isLoadingForm
                                ? "Processing..."
                                : "Record Payment"}
                            </Button>
                          </div>
                        </div>
                      )}
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