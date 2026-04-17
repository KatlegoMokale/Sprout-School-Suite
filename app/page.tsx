'use client'

import React, { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select1, SelectContent, SelectItem, SelectTrigger, SelectValue1 } from "@/components/ui/select"
import { PiggyBank, ShoppingCart, DollarSign, TrendingUp, TrendingDown, CreditCard, GraduationCap, Users, BookOpen, CalendarIcon, CakeIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { RootState, AppDispatch } from '@/lib/store'
import { fetchClasses, selectClasses, selectClassesStatus } from "@/lib/features/classes/classesSlice"
import { fetchEvents, selectEvents, selectEventsStatus } from "@/lib/features/events/eventsSlice"
import { fetchStudents, selectStudents, selectStudentsStatus } from "@/lib/features/students/studentsSlice"
import { fetchStuff, selectStuff, selectStuffStatus } from "@/lib/features/stuff/stuffSlice"
import { fetchTransactions, selectTransactions, selectTransactionsStatus } from "@/lib/features/transactions/transactionsSlice"
import { fetchPettyCash, selectPettyCash, selectPettyCashStatus } from "@/lib/features/pettyCash/pettyCashSlice"
import { fetchGroceries, selectGroceries, selectGroceriesStatus } from "@/lib/features/grocery/grocerySlice"
import { fetchSchoolFeesSetup, selectSchoolFeesSetup, selectSchoolFeesSetupStatus } from '@/lib/features/schoolFeesSetup/schoolFeesSetupSlice'
import { fetchStudentSchoolFees, selectStudentSchoolFees, selectStudentSchoolFeesStatus } from '@/lib/features/studentSchoolFees/studentSchoolFeesSlice'
import { useDispatch, useSelector } from "react-redux"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useGetStudentsQuery } from '@/lib/features/api/apiSlice'
import { IStudentFeesSchema } from "@/lib/utils";

// Add this function before the Dashboard component
export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const students = useSelector(selectStudents)
  const studentStatus = useSelector(selectStudentsStatus)
  const classes = useSelector(selectClasses)
  const classesStatus = useSelector(selectClassesStatus)
  const stuff = useSelector(selectStuff)
  const stuffStatus = useSelector(selectStuffStatus)
  const transactions = useSelector(selectTransactions)
  const transactionsStatus = useSelector(selectTransactionsStatus)
  const events = useSelector(selectEvents)
  const eventsStatus = useSelector(selectEventsStatus)
  const pettyCash = useSelector(selectPettyCash)
  const pettyCashStatus = useSelector(selectPettyCashStatus)
  const grocery = useSelector(selectGroceries)
  const groceryStatus = useSelector(selectGroceriesStatus)
  const schoolFeesSetup = useSelector(selectSchoolFeesSetup)
  const schoolFeesSetupStatus = useSelector(selectSchoolFeesSetupStatus)
  const studentSchoolFees = useSelector(selectStudentSchoolFees)
  const studentSchoolFeesStatus = useSelector(selectStudentSchoolFeesStatus)

  const [sortPeriod, setSortPeriod] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError
  } = useGetStudentsQuery({});

  // Add useEffect hooks to fetch available data only
  useEffect(() => {
    if (studentStatus === "idle") dispatch(fetchStudents());
    if (classesStatus === "idle") dispatch(fetchClasses());
    if (eventsStatus === "idle") dispatch(fetchEvents());
    if (stuffStatus === "idle") dispatch(fetchStuff());
    if (transactionsStatus === "idle") dispatch(fetchTransactions());
    if (pettyCashStatus === "idle") dispatch(fetchPettyCash());
    if (groceryStatus === "idle") dispatch(fetchGroceries());
    if (schoolFeesSetupStatus === "idle") dispatch(fetchSchoolFeesSetup());
    if (studentSchoolFeesStatus === "idle") dispatch(fetchStudentSchoolFees());
  }, [
    dispatch,
    studentStatus,
    classesStatus,
    eventsStatus,
    stuffStatus,
    transactionsStatus,
    pettyCashStatus,
    groceryStatus,
    schoolFeesSetupStatus,
    studentSchoolFeesStatus,
  ]);

  useEffect(() => {
    setIsLoading(
      studentStatus === "loading" ||
        classesStatus === "loading" ||
        eventsStatus === "loading" ||
        stuffStatus === "loading" ||
        transactionsStatus === "loading" ||
        pettyCashStatus === "loading" ||
        groceryStatus === "loading" ||
        schoolFeesSetupStatus === "loading" ||
        studentSchoolFeesStatus === "loading"
    );
  }, [
    studentStatus,
    classesStatus,
    eventsStatus,
    stuffStatus,
    transactionsStatus,
    pettyCashStatus,
    groceryStatus,
    schoolFeesSetupStatus,
    studentSchoolFeesStatus,
  ]);

  // Calculate financial data from existing data
  const totalRevenue = useMemo(
    () =>
      transactions.reduce((sum, t) => {
        const method = String(t.paymentMethod || "").toLowerCase();
        if (method.startsWith("competition credit")) return sum;
        return sum + (t.amount || 0);
      }, 0),
    [transactions]
  );
  
  const totalIncome = totalRevenue;
  
  const totalExpenses = useMemo(() => 
    pettyCash.reduce((sum, p) => sum + p.price, 0) + 
    grocery.reduce((sum, g) => sum + g.totalPaid, 0), 
    [pettyCash, grocery]
  );
  
  const totalOutstanding = useMemo(() => {
    const now = new Date();
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const generateAccruedBalance = (studentId: string) => {
      const fees = studentSchoolFees
        .filter((fee) => fee.studentId === studentId)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      const studentTransactions = transactions.filter((t) => {
        const paymentDate = new Date(t.paymentDate);
        return t.studentId === studentId && !Number.isNaN(paymentDate.getTime()) && paymentDate <= endOfToday;
      });

      const items: { date: string; debit: number; credit: number }[] = [];

      fees.forEach((fee) => {
        const startDate = new Date(fee.startDate);
        const endDate = new Date(fee.endDate);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate > endOfToday) return;

        const plan = schoolFeesSetup.find((setup) => setup.$id === fee.schoolFeesRegId);
        if (plan?.registrationFee) {
          items.push({ date: startDate.toISOString(), debit: plan.registrationFee, credit: 0 });
        }

        if (fee.competitionWinner) {
          const compCredit = Math.max(0, (fee.totalFees || 0) - Number(plan?.registrationFee || 0));
          if (compCredit > 0) {
            items.push({ date: startDate.toISOString(), debit: 0, credit: compCredit });
          }
          return;
        }

        items.push({ date: startDate.toISOString(), debit: fee.fees, credit: 0 });
        const cursor = new Date(startDate);
        cursor.setMonth(cursor.getMonth() + 1);
        while (cursor <= endDate && cursor <= endOfToday) {
          items.push({ date: cursor.toISOString(), debit: fee.fees, credit: 0 });
          cursor.setMonth(cursor.getMonth() + 1);
        }
      });

      studentTransactions.forEach((t) => {
        items.push({ date: new Date(t.paymentDate).toISOString(), debit: 0, credit: t.amount || 0 });
      });

      items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return items.reduce((sum, item) => sum + item.debit - item.credit, 0);
    };

    return students.reduce((sum, student) => sum + generateAccruedBalance(student.$id), 0);
  }, [students, studentSchoolFees, transactions, schoolFeesSetup]);

  const summaryCards = [
    { title: "Total Revenue", amount: totalRevenue, icon: DollarSign, color: "bg-green-500" },
    { title: "Total Income", amount: totalIncome, icon: TrendingUp, color: "bg-green-400" },
    { title: "Total Expenses", amount: totalExpenses, icon: TrendingDown, color: "bg-red-500" },
    { title: "Total Outstanding", amount: totalOutstanding, icon: CreditCard, color: "bg-yellow-500" },
  ]

  const filterDataByPeriod = (data: any[], period: string) => {
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return data
    }

    return data.filter(item => new Date(item.paymentDate || item.date) >= startDate)
  }

  const filteredTransactions = filterDataByPeriod(transactions, sortPeriod)
  const filteredPettyCash = filterDataByPeriod(pettyCash, sortPeriod)
  const filteredGrocery = filterDataByPeriod(grocery, sortPeriod)

  const currentYear = new Date().getFullYear()
  const registeredStudents = students.filter(student => 
    transactions.some(transaction => 
      transaction.studentId === student.$id && 
      new Date(transaction.paymentDate).getFullYear() === currentYear
    )
  )
  const unregisteredStudents = students.filter(student => 
    !transactions.some(transaction => 
      transaction.studentId === student.$id && 
      new Date(transaction.paymentDate).getFullYear() === currentYear
    )
  )

  const classData = classes.map(cls => ({
    name: cls.name,
    students: students.filter(student => student.studentClass === cls.$id).length
  }))

  const upcomingBirthdays = [...students, ...stuff]
    .filter(person => {
      const birthday = new Date(person.dateOfBirth)
      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      birthday.setFullYear(today.getFullYear())
      return birthday >= today && birthday <= nextWeek
    })
    .sort((a, b) => new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime())
    .map(person => {
      const birthday = new Date(person.dateOfBirth)
      const today = new Date()
      const currentYear = today.getFullYear()
      const birthYear = birthday.getFullYear()
      const age = currentYear - birthYear
      const day = birthday.getDate()
      const month = birthday.toLocaleString('default', { month: 'short' })
      return {
        ...person,
        turningAge: age + 1,
        day,
        month
      }
    })

  const outstandingFeesPercentage = totalOutstanding 
    ? (totalOutstanding / (totalRevenue + totalOutstanding)) * 100 
    : 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  // Comment out the useEffect that tries to fetch student school fees
  // useEffect(() => {
  //   if (studentSchoolFeesStatus === 'idle') dispatch(fetchStudentSchoolFees());
  // }, [dispatch, studentSchoolFeesStatus]);

  if (studentsLoading || isLoading) {
    return <div>Loading...</div>;
  }

  if (studentsError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="px-4 pb-8">
      <h1 className="text-3xl font-bold mb-8 text-green-800">AWDCC Dashboard</h1>
      
      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <QuickStatCard
          icon={<GraduationCap className="h-6 w-6" />}
          title="Total Students"
          value={students.length}
          color="bg-blue-500"
        />
        <QuickStatCard
          icon={<Users className="h-6 w-6" />}
          title="Total Teachers"
          value={stuff.length}
          color="bg-purple-500"
        />
        <QuickStatCard
          icon={<BookOpen className="h-6 w-6" />}
          title="Total Classes"
          value={classes.length}
          color="bg-orange-500"
        />
        <QuickStatCard
          icon={<CalendarIcon className="h-6 w-6" />}
          title="Upcoming Events"
          value={events.length}
          color="bg-pink-500"
        />
      </div>

      {/* Financial Summary */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
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

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Registration Status */}
        <Card>
          <CardHeader>
            <CardTitle>Student Registration Status ({currentYear})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Registered', value: registeredStudents.length },
                    { name: 'Unregistered', value: unregisteredStudents.length }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {
                    [0, 1].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Class Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Class Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Upcoming Birthdays */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Birthdays (Next 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {upcomingBirthdays.map((person, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CakeIcon className="h-5 w-5 text-pink-500" />
                  <span>{person.firstName} {person.surname} - {person.day} {person.month} (Turning {person.turningAge})</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Outstanding Fees */}
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">{outstandingFeesPercentage.toFixed(2)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${outstandingFeesPercentage}%` }}></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Total Outstanding: R {totalOutstanding.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-green-50 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold text-green-800">Recent Transactions</CardTitle>
              <Select1 value={sortPeriod} onValueChange={setSortPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue1 placeholder="Sort by period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select1>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader className="bg-green-50 sticky top-0">
                  <TableRow>
                    <TableHead className="w-[180px]">Student</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction, index) => (
                    <TableRow key={transaction.$id} className="hover:bg-green-50">
                      <TableCell className="font-medium">{transaction.firstName} {transaction.surname}</TableCell>
                      <TableCell>
                        {students.find(student => student.$id === transaction.studentId)?.age || 'N/A'}
                      </TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>{new Date(transaction.paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">R {transaction.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-green-50 border-b">
            <CardTitle className="text-xl font-semibold text-green-800">Expenses</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pettyCash">Petty Cash</TabsTrigger>
                <TabsTrigger value="grocery">Grocery</TabsTrigger>
              </TabsList>
              <div className="mb-4 flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <PiggyBank className="h-4 w-4 mr-2" />
                      Petty Cash
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Petty Cash form would go here */}
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Grocery
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Grocery form would go here */}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="max-h-[300px] overflow-auto">
                <TabsContent value="all">
                  <Table>
                    <TableHeader className="bg-green-50 sticky top-0">
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-green-50">
                        <TableCell>Grocery</TableCell>
                        <TableCell className="text-right">R {filteredGrocery.reduce((acc, item) => acc + item.totalPaid, 0).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-green-50">
                        <TableCell>Petty Cash</TableCell>
                        <TableCell className="text-right">R {filteredPettyCash.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="pettyCash">
                  <Table>
                    <TableHeader className="bg-green-50 sticky top-0">
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPettyCash.map((item) => (
                        <TableRow key={item.$id} className="hover:bg-green-50">
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell className="text-right">R {item.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="grocery">
                  <Table>
                    <TableHeader className="bg-green-50 sticky top-0">
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Summary</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGrocery.map((item) => (
                        <TableRow key={item.$id} className="hover:bg-green-50">
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>{item.summery}</TableCell>
                          <TableCell className="text-right">R {item.totalPaid.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function QuickStatCard({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: React.ReactNode, color: string }) {
  return (
    <Card className={`${color} text-white`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
