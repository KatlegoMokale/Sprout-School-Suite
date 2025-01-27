'use client'

import { useState, useEffect, useCallback, use } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select1, SelectContent, SelectItem, SelectTrigger, SelectValue1 } from "@/components/ui/select"
import { PiggyBank, ShoppingCart, DollarSign, TrendingUp, TrendingDown, CreditCard, GraduationCap, Users, BookOpen, CalendarIcon } from "lucide-react"
import Grocery from "@/components/ui/grocery"
import { Skeleton } from '@/components/ui/skeleton'
import PettyCash from "@/components/ui/pettyCash"
import { IEvent, IGrocery, IPettyCash, IStudent, IStuff, ITransactions } from "@/lib/utils"
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


export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>() 
  const { students, studentStatus, studentError } = useSelector((state: RootState) => state.students);
  const { classes, classesStatus, classesError } = useSelector((state: RootState)=> state.classes);
  const { stuff, stuffStatus, stuffError } = useSelector((state: RootState) => state.stuff)
  const { transactions, transactionsStatus, transactionsError } = useSelector((state: RootState) => state.transactions)
  const { events, eventsStatus, eventsError } = useSelector((state: RootState) => state.events)
  const { pettyCash, pettyCashStatus, pettyCashError } = useSelector((state: RootState) => state.pettyCash)
  const { grocery, groceryStatus, groceryError } = useSelector((state: RootState) => state.groceries)
  const { schoolFeesSetup, schoolFeesSetupStatus, schoolFeesSetupError } = useSelector((state: RootState) => state.schoolFeesSetup)

  // const [transactions, setTransactions] = useState<ITransactions[]>([])
  // const [students, setStudents] = useState<IStudent[]>([])
  // const [teachers, setTeachers] = useState<IStuff[]>([])
  // const [classes, setClasses] = useState<any[]>([])
  // const [events, setEvents] = useState<IEvent[]>([])
  // const [pettyCash, setPettyCash] = useState<IPettyCash[]>([])
  // const [grocery, setGrocery] = useState<IGrocery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortPeriod, setSortPeriod] = useState("all")

  useEffect(() => {
    // Fetch students and classes if they haven't been fetched yet
    if (studentStatus === 'idle') {
      dispatch(fetchStudents())
    }
    if (classesStatus === 'idle') {
      dispatch(fetchClasses())
    }
    if (stuffStatus === 'idle') {
      dispatch(fetchStuff())
    }
    if (transactionsStatus === 'idle') {
      dispatch(fetchTransactions())
    }
    if (eventsStatus === 'idle') {
      dispatch(fetchEvents())
    }
    if (pettyCashStatus === 'idle') {
      dispatch(fetchPettyCash())
    }
    if (groceryStatus === 'idle') {
      dispatch(fetchGroceries())
    }
    if (schoolFeesSetupStatus === 'idle') {
      dispatch(fetchSchoolFeesSetup())
    }
    // Set loading state based on the status of both students and classes
    setIsLoading(studentStatus === 'loading' || classesStatus === 'loading' || stuffStatus === 'loading' || transactionsStatus === 'loading' || eventsStatus === 'loading' || pettyCashStatus === 'loading' || groceryStatus === 'loading' || schoolFeesSetupStatus === 'loading')
    // Set error if either fetch fails
    if (studentStatus === 'failed' || classesStatus === 'failed' || stuffStatus === 'failed' || transactionsStatus === 'failed' || eventsStatus === 'failed' || pettyCashStatus === 'failed' || groceryStatus === 'failed' || schoolFeesSetupStatus === 'failed') {
      setError("Failed to fetch data. Please try reloading the page.")
    }
  }, [dispatch, studentStatus, classesStatus, stuffStatus, transactionsStatus, eventsStatus, pettyCashStatus, groceryStatus, schoolFeesSetupStatus])
  

  // const fetchData = useCallback(async () => {

  //   try {
  //     setIsLoading(true)
  //     const [transactionsRes, studentsRes, teachersRes, classesRes, pettyCashRes, groceryRes, eventsRes] = await Promise.all([
  //       fetch('/api/transactions'),
  //       fetch('/api/students'),
  //       fetch('/api/stuff'),
  //       fetch('/api/class'),
  //       fetch('/api/pettycash'),
  //       fetch('/api/grocery'),
  //       fetch('/api/event')
  //     ])

  //     if (!transactionsRes.ok || !studentsRes.ok || !teachersRes.ok || !classesRes.ok || !pettyCashRes.ok || !groceryRes.ok || !eventsRes.ok) {
  //       throw new Error("Failed to fetch data")
  //     }

  //     const [transactionsData, studentsData, teachersData, classesData, pettyCashData, groceryData, eventsData] = await Promise.all([
  //       transactionsRes.json(),
  //       studentsRes.json(),
  //       teachersRes.json(),
  //       classesRes.json(),
  //       pettyCashRes.json(),
  //       groceryRes.json(),
  //       eventsRes.json()
  //     ])

  //     setTransactions(transactionsData)
  //     setStudents(studentsData)
  //     setTeachers(teachersData)
  //     setClasses(classesData)
  //     setPettyCash(pettyCashData)
  //     setGrocery(groceryData)
  //     setEvents(eventsData)
  //   } catch (error) {
  //     console.error("Error fetching data:", error)
  //     setError("Failed to fetch data. Please try again later.")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [])

  // useEffect(() => {
  //   fetchData()
  // }, [fetchData])

  const calculateTotal = (data: any[], key: string) => {
    return data.reduce((total, item) => total + item[key], 0)
  }

  const totalRevenue = 45231.89 // Placeholder value
  const totalIncome = calculateTotal(transactions, 'amount')
  const totalExpenses = calculateTotal(pettyCash, 'price') + calculateTotal(grocery, 'totalPaid')
  const totalOutstanding = totalRevenue - totalIncome // Placeholder calculation

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
          value={isLoading ? <Skeleton className="h-8 w-16" /> : students.length}
          color="bg-blue-500"
        />
        <QuickStatCard
          icon={<Users className="h-6 w-6" />}
          title="Total Teachers"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : stuff.length}
          color="bg-purple-500"
        />
        <QuickStatCard
          icon={<BookOpen className="h-6 w-6" />}
          title="Total Classes"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : classes.length}
          color="bg-orange-500"
        />
        <QuickStatCard
          icon={<CalendarIcon className="h-6 w-6" />}
          title="Upcoming Events"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : events.length}
          color="bg-pink-500"
        />
      </div>

      {/* Financial Summary */}
      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">       */}
        <div className="hidden gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
                    {/* <PettyCash onSuccess={fetchData} /> */}
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
                    {/* <Grocery onSuccess={fetchData} /> */}
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

