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
import { fetchClasses, selectClasses } from "@/lib/features/classes/classesSlice"
import { fetchEvents, selectEvents } from "@/lib/features/events/eventsSlice"
import { fetchStudents, selectStudents } from "@/lib/features/students/studentsSlice"
import { fetchStuff, selectStuff } from "@/lib/features/stuff/stuffSlice"
import { fetchTransactions, selectTransactions } from "@/lib/features/transactions/transactionsSlice"
import { fetchPettyCash, selectPettyCash } from "@/lib/features/pettyCash/pettyCashSlice"
import { fetchGroceries, selectGroceries } from "@/lib/features/grocery/grocerySlice"
import { fetchSchoolFeesSetup, selectSchoolFeesSetup } from '@/lib/features/schoolFeesSetup/schoolFeesSetupSlice'
import { useDispatch, useSelector } from "react-redux"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { students, studentStatus } = useSelector((state: RootState) => state.students)
  const { classes, classesStatus } = useSelector((state: RootState) => state.classes)
  const { stuff, stuffStatus } = useSelector((state: RootState) => state.stuff)
  const { transactions, transactionsStatus } = useSelector((state: RootState) => state.transactions)
  const { events, eventsStatus } = useSelector((state: RootState) => state.events)
  const { pettyCash, pettyCashStatus } = useSelector((state: RootState) => state.pettyCash)
  const { grocery, groceryStatus } = useSelector((state: RootState) => state.groceries)
  const { schoolFeesSetup, schoolFeesSetupStatus } = useSelector((state: RootState) => state.schoolFeesSetup)

  const [sortPeriod, setSortPeriod] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          dispatch(fetchStudents()),
          dispatch(fetchClasses()),
          dispatch(fetchStuff()),
          dispatch(fetchTransactions()),
          dispatch(fetchEvents()),
          dispatch(fetchPettyCash()),
          dispatch(fetchGroceries()),
          dispatch(fetchSchoolFeesSetup())
        ])
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [dispatch])

  const calculateTotal = (data: any[], key: string) => {
    return data.reduce((total, item) => total + item[key], 0)
  }

  const totalRevenue = useMemo(() => calculateTotal(transactions, 'amount'), [transactions])
  const totalIncome = totalRevenue
  const totalExpenses = useMemo(() => calculateTotal(pettyCash, 'price') + calculateTotal(grocery, 'totalPaid'), [pettyCash, grocery])
  const totalOutstanding = useMemo(() => {
    const totalFees = schoolFeesSetup.reduce((sum, fee) => sum + fee.yearlyFee, 0)
    return totalFees - totalIncome
  }, [schoolFeesSetup, totalIncome])

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

  const outstandingFeesPercentage = (totalOutstanding / (totalRevenue + totalOutstanding)) * 100

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
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
                  <span>{person.firstName} {person.surname} - {new Date(person.dateOfBirth).toLocaleDateString()}</span>
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
                        <TableCell className="text-right">R {calculateTotal(filteredGrocery, 'totalPaid').toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-green-50">
                        <TableCell>Petty Cash</TableCell>
                        <TableCell className="text-right">R {calculateTotal(filteredPettyCash, 'price').toFixed(2)}</TableCell>
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