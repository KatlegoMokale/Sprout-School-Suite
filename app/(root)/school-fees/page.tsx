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
  TrendingDown,
  CreditCard,
  Search,
  Plus,
} from "lucide-react";
import { IStudent, paymentFormSchema } from "@/lib/utils";
import { newPayment } from "@/lib/actions/user.actions";
import CustomInputPayment from "@/components/ui/CustomInputPayment";

interface Student {
  $id: string;
  firstName: string;
  surname: string;
  studentClass: string;
  balance: number;
  nextPaymentDate: string;
}

interface PaymentProps {
  student: IStudent | null;
}

interface Transaction {
  $id: string;
  studentId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
}

interface Class {
  $id: string;
  name: string;
}

const formSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  amount: z.number().min(0, "Amount must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

export default function SchoolFeeManagement() {
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsResponse, transactionsResponse, classesResponse] =
          await Promise.all([
            fetch("/api/students"),
            fetch("/api/transactions"),
            fetch("/api/class"),
          ]);
        if (
          !studentsResponse.ok ||
          !transactionsResponse.ok ||
          !classesResponse.ok
        )
          throw new Error("Failed to fetch data");
        const studentsData = await studentsResponse.json();
        const transactionsData = await transactionsResponse.json();
        const classesData = await classesResponse.json();
        setStudents(studentsData);
        setTransactions(transactionsData);
        setClasses(classesData);
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
  // selectedClass === "all" || student.studentClass === selectedClass
  const filteredStudents = students.filter(
    (student) =>
      (!selectedClass || student.studentClass === selectedClass) &&
      `${student.firstName} ${student.surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getClassName = (classId: string) => {
    return classes.find((c) => c.$id === classId)?.name || "Unknown";
  };

  const getStudentBalance = (studentId: string) => {
    const studentTransactions = transactions.filter(
      (t) => t.studentId === studentId
    );
    return studentTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const getStudentLastPaid = (studentId: string) => {
    const studentTransactions = transactions.filter(
      (t) => t.studentId === studentId
    );
    if (studentTransactions.length === 0) return null;
    return Math.max(
      ...studentTransactions.map((t) => new Date(t.paymentDate).getTime())
    );
  };

  const isOutstanding = (student: Student) => {
    const lastPaidDate = getStudentLastPaid(student.$id);
    if (!lastPaidDate) return true;
    return new Date(student.nextPaymentDate) <= new Date();
  };

  const totalFees = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalPaid = totalFees;
  const totalOutstanding = students.reduce(
    (sum, s) => sum + (isOutstanding(s) ? s.balance : 0),
    0
  );

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

  // const onSubmit = async (data: z.infer<typeof formSchema>) => {
  //   try {
  //     // Simulating API call to add a new transaction
  //     const newTransaction: Transaction = {
  //       $id: Date.now().toString(),
  //       studentId: data.studentId,
  //       amount: data.amount,
  //       paymentMethod: data.paymentMethod,
  //       paymentDate: new Date().toISOString(),
  //     }
  //     setTransactions([...transactions, newTransaction])

  //     // Update student balance and next payment date
  //     const updatedStudents = students.map(student => {
  //       if (student.$id === data.studentId) {
  //         const newBalance = student.balance - data.amount
  //         const nextPaymentDate = new Date()
  //         nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1) // Assuming monthly payments
  //         return {
  //           ...student,
  //           balance: newBalance,
  //           nextPaymentDate: nextPaymentDate.toISOString(),
  //         }
  //       }
  //       return student
  //     })
  //     setStudents(updatedStudents)

  //     toast({
  //       title: "Success",
  //       description: "Payment has been recorded successfully.",
  //     })
  //     form.reset()
  //   } catch (error) {
  //     console.error("Error submitting payment:", error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to record payment. Please try again.",
  //       variant: "destructive",
  //     })
  //   }
  // }

  const newPayemntFormSchema = paymentFormSchema();
  const form = useForm<z.infer<typeof newPayemntFormSchema>>({
    resolver: zodResolver(newPayemntFormSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      amount: 0,
      paymentMethod: "",
      paymentDate: "",
      studentId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof newPayemntFormSchema>) => {
    console.log("Form data:", data);
    console.log("Submit");
    setIsLoadingForm(true);
    try {
      const addNewPayment = await newPayment(data);
      console.log("Add new Payment " + addNewPayment);
      // router.push('/transactions');
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setIsLoadingForm(false);
    }
    setFormData(data);
    console.log("Form data ready for Appwrite:", data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className=" px-4 py-8">
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
                    {classes.map((cls) => (
                      <SelectItem key={cls.$id} value={cls.$id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select1>
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
                    {filteredStudents.map((student) => (
                      <TableRow key={student.$id}>
                        <TableCell>
                          {student.firstName} {student.surname}
                        </TableCell>
                        <TableCell>
                          {classes.find((c) => c.$id === student.studentClass)
                            ?.name || "N/A"}
                        </TableCell>
                        <TableCell>R {student.balance.toFixed(2)}</TableCell>
                        <TableCell>
                          {getStudentLastPaid(student.$id)
                            ? new Date(
                                getStudentLastPaid(student.$id)!
                              ).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            student.nextPaymentDate
                          ).toLocaleDateString()}
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedStudent(student)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student</FormLabel>
                        <Select1
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue1 placeholder="Select a student" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {students.map((student) => (
                              <SelectItem key={student.$id} value={student.$id}>
                                {student.firstName} {student.surname} -{" "}
                                {classes.find(
                                  (c) => c.$id === student.studentClass
                                )?.name || "N/A"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select1>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <CustomInputPayment
                      name="firstName"
                      control={form.control}
                      placeholder="Name"
                      label={"Name"}
                    />
                    <CustomInputPayment
                      name="surname"
                      control={form.control}
                      placeholder="Surname"
                      label={"Surname"}
                    />
                  </div>
                  <CustomInputPayment
                    name="amount"
                    control={form.control}
                    placeholder="Amount"
                    label={"Amount"}
                    type="number"
                  />
                  <CustomInputPayment
                    name="paymentMethod"
                    placeholder="Select Method"
                    control={form.control}
                    label={"Payment Method"}
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
                  <Button type="submit" className="w-full">
                    Record Payment
                  </Button>
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
                  {getClassName(selectedStudent.studentClass)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Balance</Label>
                <div className="col-span-3">
                  R {selectedStudent.balance.toFixed(2)}
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
                  {new Date(
                    selectedStudent.nextPaymentDate
                  ).toLocaleDateString()}
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
