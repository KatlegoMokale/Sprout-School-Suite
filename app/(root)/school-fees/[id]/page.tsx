// 'use client'

// import React, { useEffect, useState, useCallback, useMemo } from 'react'
// import { Button } from '@/components/ui/button'
// import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell, TableFooter } from '@/components/ui/table'
// import { Input } from '@/components/ui/input'
// import { IStudent, ITransactions, IStudentFeesSchema, ISchoolFees } from "@/lib/utils"
// import { jsPDF } from "jspdf"
// import "jspdf-autotable"



// export default function StudentInvoice({ params }: { params: { id: string } }) {
//   const [isLoading, setIsLoading] = useState(true)
//   const [student, setStudent] = useState<IStudent | null>(null)
//   const [transactions, setTransactions] = useState<ITransactions[]>([])
//   const [studentFees, setStudentFees] = useState<IStudentFeesSchema[]>([])
//   const [schoolFees, setSchoolFees] = useState<ISchoolFees[]>([])
//   const [statementItems, setStatementItems] = useState<any[]>([])
//   const [startDate, setStartDate] = useState<string>('')
//   const [endDate, setEndDate] = useState<string>('')

//   const isLeapYear = useCallback((year: number): boolean => {
//     return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
//   }, [])

//   const getLastDayOfMonth = useCallback((year: number, month: number): number => {
//     if (month === 1) { // February
//       return isLeapYear(year) ? 29 : 28
//     }
//     const thirtyDayMonths = [3, 5, 8, 10] // April, June, September, November
//     return thirtyDayMonths.includes(month) ? 30 : 31
//   }, [isLeapYear])

//   const adjustPaymentDate = useCallback((year: number, month: number, day: number): Date => {
//     const lastDay = getLastDayOfMonth(year, month)
//     return new Date(year, month, Math.min(day, lastDay))
//   }, [getLastDayOfMonth])

//   const generateStatementItems = useCallback((transactions: ITransactions[], fees: IStudentFeesSchema[], schoolFees: ISchoolFees[]) => {
//     const items = []
//     let balance = 0

//     // Sort fees by startDate
//     fees.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

//     // Process fees and transactions
//     for (const fee of fees) {
//       const startDate = new Date(fee.startDate)
//       const endDate = new Date(fee.endDate)

//       // Find the corresponding school fee
//       const schoolFee = schoolFees.find(sf => sf.$id === fee.schoolFeesRegId)
//       if (schoolFee) {
//         // Add registration fee
//         balance += schoolFee.registrationFee
//         items.push({
//           date: startDate.toISOString(),
//           description: `Registration Fee`,
//           debit: schoolFee.registrationFee,
//           credit: 0,
//           balance: balance
//         })
//       }

//       // Add first monthly fee on startDate
//       balance += fee.fees
//       items.push({
//         date: startDate.toISOString(),
//         description: `Monthly Fee - ${startDate.toLocaleString('default', { month: 'long' })}`,
//         debit: fee.fees,
//         credit: 0,
//         balance: balance
//       })

//       let currentDate = new Date(startDate)
//       currentDate.setMonth(currentDate.getMonth() + 1) // Move to next month for subsequent fees

//       while (currentDate <= endDate) {
//         // Adjust the date to be a month earlier
//         const feeDate = adjustPaymentDate(currentDate.getFullYear(), currentDate.getMonth() - 1, fee.paymentDate)
        
//         // Add monthly fee
//         balance += fee.fees
//         items.push({
//           date: feeDate.toISOString(),
//           description: `Monthly Fee - ${currentDate.toLocaleString('default', { month: 'long' })}`,
//           debit: fee.fees,
//           credit: 0,
//           balance: balance
//         })

//         currentDate.setMonth(currentDate.getMonth() + 1)
//       }
//     }

//     // Add transaction items
//     for (const transaction of transactions) {
//       const transactionDate = new Date(transaction.paymentDate)
//       balance -= transaction.amount
//       items.push({
//         date: transactionDate.toISOString(),
//         description: `Payment - ${transaction.paymentMethod}`,
//         debit: 0,
//         credit: transaction.amount,
//         balance: balance
//       })
//     }

//     // Sort items by date
//     items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

//     // Recalculate balance
//     balance = 0
//     for (const item of items) {
//       balance += item.debit - item.credit
//       item.balance = balance
//     }

//     return items
//   }, [adjustPaymentDate])

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true)
//       try {
//         const [studentResponse, transactionsResponse, studentFeesResponse, schoolFeesResponse] = await Promise.all([
//           fetch(`/api/students/${params.id}`),
//           fetch(`/api/transactions`),
//           fetch(`/api/student-school-fees`),
//           fetch(`/api/school-fees-setup`)
//         ])

//         if (!studentResponse.ok || !transactionsResponse.ok || !studentFeesResponse.ok || !schoolFeesResponse.ok) 
//           throw new Error("Failed to fetch data")

//         const studentData: {student: IStudent} = await studentResponse.json()
//         const transactionsData: ITransactions[] = await transactionsResponse.json()
//         const studentFeesData: IStudentFeesSchema[] = await studentFeesResponse.json()
//         const schoolFeesData: ISchoolFees[] = await schoolFeesResponse.json()

//         setStudent(studentData.student)
//         setTransactions(transactionsData.filter(t => t.studentId === params.id))
//         setStudentFees(studentFeesData.filter(f => f.studentId === params.id))
//         setSchoolFees(schoolFeesData)

//         const items = generateStatementItems(
//           transactionsData.filter(t => t.studentId === params.id),
//           studentFeesData.filter(f => f.studentId === params.id),
//           schoolFeesData
//         )
//         setStatementItems(items)

//       } catch (error) {
//         console.error("Error fetching data:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [params.id, generateStatementItems])

//   const filterStatementItems = useMemo(() => {
//     return () => {
//       if (!startDate && !endDate) return statementItems

//       return statementItems.filter(item => {
//         const itemDate = new Date(item.date)
//         const start = startDate ? new Date(startDate) : new Date(0)
//         const end = endDate ? new Date(endDate) : new Date()
//         return itemDate >= start && itemDate <= end
//       })
//     }
//   }, [statementItems, startDate, endDate])

//   const downloadPDF = useCallback(() => {
//     if (!student) return

//     const filteredItems = filterStatementItems()
//     const totalBalance = filteredItems.length > 0 ? filteredItems[filteredItems.length - 1].balance : 0

//     const doc = new jsPDF()
//     doc.setFontSize(18)
//     doc.text(`Student Statement`, 14, 22)
//     doc.setFontSize(12)
//     doc.text(`Name: ${student.firstName} ${student.surname}`, 14, 30)
//     doc.text(`Address: ${student.address1}`, 14, 38)
//     doc.text(`Date of Birth: ${new Date(student.dateOfBirth).toLocaleDateString()}`, 14, 46)
//     doc.text(`Contact: ${student.p1_phoneNumber}`, 14, 54)
//     doc.text(`Email: ${student.p1_email}`, 14, 62)
//     doc.text(`Statement for ${endDate}`, 14, 70)
//     doc.text(`Total Balance: R ${totalBalance.toFixed(2)}`, 14, 78)

//     const tableData = filteredItems.map(item => [
//       new Date(item.date).toLocaleDateString(),
//       item.description,
//       item.debit > 0 ? `R ${item.debit.toFixed(2)}` : '',
//       item.credit > 0 ? `R ${item.credit.toFixed(2)}` : '',
//       `R ${item.balance.toFixed(2)}`,
//     ])

//     ;(doc as any).autoTable({
//       startY: 90,
//       head: [['Date', 'Description', 'Debit', 'Credit', 'Balance']],
//       body: tableData,
//     })

//     doc.save(`student_statement_${student.firstName}_${student.surname}.pdf`)
//   }, [student, filterStatementItems, endDate])

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   const filteredItems = filterStatementItems()

//   return (
//     <div className='container'>
//       <div className='w-full'>
//         <h1 className="text-2xl font-bold mb-4">Account Statement</h1>
//         {student && (
//           <div className="mb-4">
//             <p><strong>Name:</strong> {student.firstName} {student.surname}</p>
//             <p><strong>Address:</strong> {student.address1}</p>
//             <p><strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}</p>
//             <p><strong>Contact:</strong> {student.p1_phoneNumber}</p>
//           </div>
//         )}
//         <div className="flex space-x-4 mb-4">
//           <div>
//             <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
//             <Input
//               type="date"
//               id="startDate"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="mt-1"
//             />
//           </div>
//           <div>
//             <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
//             <Input
//               type="date"
//               id="endDate"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="mt-1"
//             />
//           </div>
//         </div>
//         <Button onClick={downloadPDF} className="mt-4 mb-6">
//           Download PDF
//         </Button>
//       </div>
//       <div>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Date</TableHead>
//               <TableHead>Description</TableHead>
//               <TableHead>Debit</TableHead>
//               <TableHead>Credit</TableHead>
//               <TableHead>Balance</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredItems.map((item, index) => (
//               <TableRow key={index}>
//                 <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
//                 <TableCell>{item.description}</TableCell>
//                 <TableCell>{item.debit > 0 ? `R ${item.debit.toFixed(2)}` : ""}</TableCell>
//                 <TableCell>{item.credit > 0 ? `R ${item.credit.toFixed(2)}` : ""}</TableCell>
//                 <TableCell>R {item.balance.toFixed(2)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//           <TableFooter>
//             <TableRow>
//               <TableCell colSpan={4}>Current Balance</TableCell>
//               <TableCell>
//                 R {filteredItems.length > 0 
//                     ? filteredItems[filteredItems.length - 1].balance.toFixed(2) 
//                     : "0.00"}
//               </TableCell>
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </div>
//     </div>
//   )
// }