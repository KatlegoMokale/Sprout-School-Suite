"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select1,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue1,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Search,
} from "lucide-react";
import { IClass, IStudent, ITransactions, paymentFormSchema, IStudentFeesSchema } from "@/lib/utils";
import { newPayment } from "@/lib/actions/user.actions";
import CustomInputPayment from "@/components/ui/CustomInputPayment";
import { Checkbox } from "@/components/ui/checkbox";
import { updateStudentAmountPaid, updateStudentRegBalance } from "@/lib/actions/user.actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dropdown } from "react-day-picker";

const newPaymentFormSchema = paymentFormSchema();

const handleInvoiceClick = (e: React.MouseEvent, studentId: string) => {
  e.preventDefault();
  try {
    window.open(`/school-fees/${studentId}`, '_blank');
  } catch (error) {
    console.error("Error opening invoice:", error);
    toast({
      title: "Error",
      description: "Failed to open invoice. Please try again.",
      variant: "destructive",
    });
  }
};

export default function SchoolFeeManagement() {
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const [transactions, setTransactions] = useState<ITransactions[]>([]);
  const [classes, setClasses] = useState<IClass[]>([]);
  const [studentFees, setStudentFees] = useState<IStudentFeesSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [registeredYears, setRegisteredYears] = useState<Record<string, number[]>>({});
  const [paymentStep, setPaymentStep] = useState(1);
  const [showUnregistered, setShowUnregistered] = useState(false);

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
    const fetchData = async () => {
      try {
        const [studentsResponse, transactionsResponse, classesResponse, studentFeesResponse] =
          await Promise.all([
            fetch("/api/students"),
            fetch("/api/transactions"),
            fetch("/api/class"),
            fetch("/api/student-school-fees")
          ]);

        if (
          !studentsResponse.ok ||
          !transactionsResponse.ok ||
          !classesResponse.ok ||
          !studentFeesResponse.ok
        )
          throw new Error("Failed to fetch data");
        const studentsData: IStudent[] = await studentsResponse.json();
        const transactionsData: ITransactions[] = await transactionsResponse.json();
        const classesData: IClass[] = await classesResponse.json();
        const studentFeesData: IStudentFeesSchema[] = await studentFeesResponse.json();
        
        setStudents(studentsData);
        setFilteredStudents(studentsData);
        setTransactions(transactionsData);
        setClasses(classesData);
        setStudentFees(studentFeesData);

        const regYears: Record<string, number[]> = {};
        studentFeesData.forEach((fee) => {
          if (!regYears[fee.studentId]) {
            regYears[fee.studentId] = [];
          }
          regYears[fee.studentId].push(new Date(fee.startDate).getFullYear());
        });
        setRegisteredYears(regYears);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student => 
      (!selectedClass || student.studentClass === selectedClass) &&
      `${student.firstName} ${student.surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (showUnregistered ? !registeredYears[student.$id]?.includes(selectedYear) : registeredYears[student.$id]?.includes(selectedYear))
    );
    setFilteredStudents(filtered);
    if (filtered.length === 0) {
      toast({
        title: "No Students Found",
        description: `There are no ${showUnregistered ? 'unregistered' : 'registered'} students for the year ${selectedYear}.`,
        variant: "warning",
      });
    }
  }, [selectedYear, students, registeredYears, selectedClass, searchTerm, showUnregistered]);

  const getClassName = (classId: string) => {
    return classes.find((c) => c.$id === classId)?.name || "Unknown";
  };

  const getStudentBalance = (studentId: string) => {
    const studentFee = studentFees.find(fee => fee.studentId === studentId);
    return studentFee ? studentFee.balance : 0;
  };

  const getStudentLastPaid = (studentId: string) => {
    const studentTransactions = transactions.filter(t => t.studentId === studentId);
    if (studentTransactions.length === 0) return null;
    return Math.max(...studentTransactions.map(t => new Date(t.paymentDate).getTime()));
  };

  const isOutstanding = (student: IStudent) => {
    const studentFee = studentFees.find(fee => fee.studentId === student.$id);
    if (!studentFee) return false;
    return new Date(studentFee.paymentDate).getTime() <= Date.now();
  };

  const totalFees = studentFees.reduce((sum, fee) => sum + fee.totalFees, 0);
  const totalPaid = studentFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalOutstanding = studentFees.reduce((sum, fee) => sum + fee.balance, 0);

  const summaryCards = [
    {
      title: "Total Fees",
      amount: totalFees,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Total Paid",
      amount: totalPaid,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Outstanding",
      amount: totalOutstanding,
      icon: CreditCard,
      color: "bg-yellow-500",
    },
  ];

  const onSubmit = async (data: z.infer<typeof newPaymentFormSchema>) => {
    setIsLoadingForm(true);
    setError(null);

    try {
      const studentFee = studentFees.find((fee) => fee.studentId === data.studentId);
      if (!studentFee) {
        throw new Error("Student fee information not found");
      }

      const newBalance = studentFee.balance - data.amount;
      const newPaidAmount = studentFee.paidAmount + data.amount;

      // First, update the paid amount and balance
      await updateStudentAmountPaid(studentFee.$id, newPaidAmount);
      await updateStudentRegBalance(studentFee.$id, newBalance);

      // If updates are successful, add the new payment
      const addNewPayment = await newPayment(data);

      // Update local state
      setStudentFees(prevFees => 
        prevFees.map(fee => 
          fee.$id === studentFee.$id 
            ? { ...fee, paidAmount: newPaidAmount, balance: newBalance } 
            : fee
        )
      );

      toast({
        title: "Success",
        description: "Payment has been recorded successfully.",
      });
      form.reset();
      setPaymentStep(1);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form. Please try again.");
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
    const studentFee = studentFees.find(fee => fee.studentId === studentId);
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
          <p><strong>Next Payment Date:</strong> {new Date(studentFee.paymentDate).toLocaleDateString()}</p>
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

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="px-4 py-8">
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
                <CardTitle className="text-lg font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-5 w-5 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R {card.amount.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Student Fee Management</CardTitle>
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
                    {classes.map((cls) => 
                      <SelectItem key={cls.$id} value={cls.$id}>
                        {cls.name}
                      </SelectItem>
                    )}
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
                    onCheckedChange={(checked) => setShowUnregistered(checked as boolean)}
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
                      <TableHead>Next Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const studentFee = studentFees.find(fee => fee.studentId === student.$id);
                      return (
                        <TableRow key={student.$id}>
                          <TableCell>
                            {student.firstName} {student.surname}
                          </TableCell>
                          <TableCell>
                            {getClassName(student.studentClass || '')}
                          </TableCell>
                          <TableCell>R {(studentFee?.balance || 0).toFixed(2)}</TableCell>
                          <TableCell>
                            {getStudentLastPaid(student.$id)
                              ? new Date(getStudentLastPaid(student.$id)!).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {studentFee
                              ? new Date(studentFee.paymentDate).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
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
                              <a href="#" onClick={(e) => handleInvoiceClick(e, student.$id)} className="w-full">
                                View Account
                              </a>
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {paymentStep === 1 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-4">Step 1: Select Year</h2>
                          <Select1
                            value={selectedYear.toString()}
                            onValueChange={(value) => setSelectedYear(parseInt(value))}
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
                          <Button className="mt-4" onClick={() => setPaymentStep(2)}>Next</Button>
                        </div>
                      )}
                      {paymentStep === 2 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-4">Step 2: Select Student and Transaction Type</h2>
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
                                    form.setValue("surname", student?.surname || "");
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
                                        {getClassName(student.studentClass || '')}
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
                              { label: "Registration Fee", value: "registration" },
                            ]}
                          />
                          <div className="flex justify-between mt-4">
                            <Button onClick={() => setPaymentStep(1)}>Previous</Button>
                            <Button onClick={() => setPaymentStep(3)}>Next</Button>
                          </div>
                        </div>
                      )}
                      {paymentStep === 3 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-4">Step 3: Payment Details</h2>
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
                            <Button onClick={() => setPaymentStep(2)}>Previous</Button>
                            <Button type="submit" disabled={isLoadingForm}>
                              {isLoadingForm ? "Processing..." : "Record Payment"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border-l pl-4">
                      {form.watch("studentId") && getStudentInfo(form.watch("studentId"))}
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
                  {getClassName(selectedStudent.studentClass || '')}
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
                    ? new Date(getStudentLastPaid(selectedStudent.$id)!).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Next Payment</Label>
                <div className="col-span-3">
                  {studentFees.find(fee => fee.studentId === selectedStudent.$id)?.paymentDate
                    ? new Date(studentFees.find(fee => fee.studentId === selectedStudent.$id)!.paymentDate).toLocaleDateString()
                    : "N/A"}
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