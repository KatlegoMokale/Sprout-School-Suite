"use client";

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell, TableFooter } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { IStudent, ITransactions, IStudentFeesSchema, ISchoolFees } from "@/lib/utils";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Moved helper functions outside component
const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

const getLastDayOfMonth = (year: number, month: number): number => {
  if (month === 1) { // February
    return isLeapYear(year) ? 29 : 28;
  }
  const thirtyDayMonths = [3, 5, 8, 10]; // April, June, September, November
  return thirtyDayMonths.includes(month) ? 30 : 31;
};

const adjustPaymentDate = (year: number, month: number, day: number): Date => {
  const lastDay = getLastDayOfMonth(year, month);
  return new Date(year, month, Math.min(day, lastDay));
};

// Moved generateStatementItems outside component
const generateStatementItems = (transactions: ITransactions[], fees: IStudentFeesSchema[], schoolFees: ISchoolFees[]) => {
  const items = [];
  let balance = 0;
  const currentDate = new Date();

  // Sort fees by startDate
  fees.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Process fees and transactions
  for (const fee of fees) {
    const startDate = new Date(fee.startDate);
    const endDate = new Date(fee.endDate);

    // Only process if start date is before or equal to current date
    if (startDate <= currentDate) {
      // Find the corresponding school fee
      const schoolFee = schoolFees.find(sf => sf.$id === fee.schoolFeesRegId);
      if (schoolFee) {
        // Add registration fee
        balance += schoolFee.registrationFee;
        items.push({
          date: startDate.toISOString(),
          description: `Registration Fee`,
          debit: schoolFee.registrationFee,
          credit: 0,
          balance: balance
        });
      }

      // Add first monthly fee on startDate
      balance += fee.fees;
      items.push({
        date: startDate.toISOString(),
        description: `Monthly Fee - ${startDate.toLocaleString('default', { month: 'long' })}`,
        debit: fee.fees,
        credit: 0,
        balance: balance
      });

      let currentDate = new Date(startDate);
      currentDate.setMonth(currentDate.getMonth() + 1); // Move to next month for subsequent fees

      while (currentDate <= endDate && currentDate <= new Date()) {
        // Adjust the date to be a month earlier
        const feeDate = adjustPaymentDate(currentDate.getFullYear(), currentDate.getMonth() - 1, fee.paymentDate);
        
        // Add monthly fee
        balance += fee.fees;
        items.push({
          date: feeDate.toISOString(),
          description: `Monthly Fee - ${currentDate.toLocaleString('default', { month: 'long' })}`,
          debit: fee.fees,
          credit: 0,
          balance: balance
        });

        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
  }

  // Add transaction items
  for (const transaction of transactions) {
    const transactionDate = new Date(transaction.paymentDate);
    if (transactionDate <= currentDate) {
      balance -= transaction.amount;
      items.push({
        date: transactionDate.toISOString(),
        description: `Payment - ${transaction.paymentMethod}`,
        debit: 0,
        credit: transaction.amount,
        balance: balance
      });
    }
  }

  // Sort items by date
  items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Recalculate balance
  balance = 0;
  for (const item of items) {
    balance += item.debit - item.credit;
    item.balance = balance;
  }

  return items;
};

const StudentInvoice = ({ params }: { params: Promise<{ id: string }> }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<IStudent | null>(null);
  const [transactions, setTransactions] = useState<ITransactions[]>([]);
  const [studentFees, setStudentFees] = useState<IStudentFeesSchema[]>([]);
  const [schoolFees, setSchoolFees] = useState<ISchoolFees[]>([]);
  const [statementItems, setStatementItems] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const router = useRouter()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const unwrappedParams = await params;
        const [studentResponse, transactionsResponse, studentFeesResponse, schoolFeesResponse] = await Promise.all([
          fetch(`/api/students/${unwrappedParams.id}`),
          fetch(`/api/transactions`),
          fetch(`/api/student-school-fees`),
          fetch(`/api/school-fees-setup`)
        ]);

        if (!studentResponse.ok || !transactionsResponse.ok || !studentFeesResponse.ok || !schoolFeesResponse.ok) 
          throw new Error("Failed to fetch data");

        const studentData: {student: IStudent} = await studentResponse.json();
        const transactionsData: ITransactions[] = await transactionsResponse.json();
        const studentFeesData: IStudentFeesSchema[] = await studentFeesResponse.json();
        const schoolFeesData: ISchoolFees[] = await schoolFeesResponse.json();

        setStudent(studentData.student);
        
        const filteredTransactions = transactionsData.filter(t => t.studentId === unwrappedParams.id);
        const filteredStudentFees = studentFeesData.filter(f => f.studentId === unwrappedParams.id);
        
        setTransactions(filteredTransactions);
        setStudentFees(filteredStudentFees);
        setSchoolFees(schoolFeesData);

        const items = generateStatementItems(
          filteredTransactions,
          filteredStudentFees,
          schoolFeesData
        );
        setStatementItems(items);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params]); // No need to include generateStatementItems anymore

  const filterStatementItems = () => {
    if (!startDate && !endDate) return statementItems;

    return statementItems.filter(item => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      return itemDate >= start && itemDate <= end;
    });
  };

  const generatePDF = () => {
    if (!student) return null;
  
    const filteredItems = filterStatementItems();
    const totalBalance = filteredItems.length > 0 ? filteredItems[filteredItems.length - 1].balance : 0;
  
    const doc = new jsPDF();
    
    // Set up the document
    doc.setFillColor(102, 51, 153); // A purple color for the header
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add the header content
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Angels World Day Care Centre', 14, 25);
    
    doc.setFontSize(10);
    doc.text('Statement Period', 140, 20);
    doc.setFontSize(12);
    doc.text(`${startDate} - ${endDate}`, 140, 28);
  
    // Reset text color for the rest of the document
    doc.setTextColor(0, 0, 0);
  
    // Add student information
    doc.setFontSize(18);
    doc.text(`${student.firstName} ${student.surname}`, 14, 55);
    doc.setFontSize(10);
    doc.text(`ID: ${student.$id}`, 14, 62);
  
    doc.setFontSize(10);
    doc.text('Address', 140, 55);
    // Split the address into two lines
    const addressParts = student.address1.split(',');
    let address1, address2;
    if (addressParts.length > 1) {
      address1 = addressParts[0].trim();
      address2 = addressParts.slice(1).join(',').trim();
    } else {
      const words = student.address1.split(' ');
      const midpoint = Math.ceil(words.length / 2);
      address1 = words.slice(0, midpoint).join(' ');
      address2 = words.slice(midpoint).join(' ');
    }
    console.log("address1",address1);
    console.log("address2",address2);
    doc.text(address1.trim(), 140, 62);
    doc.text(address2.trim(), 140, 69);
  
    // Add Statement Summary title
    doc.setFontSize(14);
    doc.text('Statement Summary', 14, 80);
  
    // Create the table
    const tableData = filteredItems.map(item => [
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      item.description,
      item.debit > 0 ? `R ${item.debit.toFixed(2)}` : '',
      item.credit > 0 ? `R ${item.credit.toFixed(2)}` : '',
      `R ${item.balance.toFixed(2)}`,
    ]);
  
    (doc as any).autoTable({
      startY: 90,
      head: [['DATE', 'DESCRIPTION', 'DEBIT', 'CREDIT', 'BALANCE']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
        4: { cellWidth: 35, halign: 'right' },
      },
      styles: { fontSize: 9, cellPadding: 1.5 },
    });
  
    return doc;
  };

  const downloadPDF = () => {
    const doc = generatePDF();
    if (doc) {
      doc.save(`student_statement_${student?.firstName}_${student?.surname}.pdf`);
    }
  };

  const viewPDF = () => {
    const doc = generatePDF();
    if (doc) {
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
      window.open(pdfUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredItems = filterStatementItems();



  return (
    <div className='container'>
          <Link href="/school-fees" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft className="mr-2 h-4 w-4" />
        School Fees
      </Link>
      <div className='w-full'>
        <h1 className="text-2xl font-bold mb-4">Account Statement</h1>
        {student && (
          <div className="mb-4">
            <p><strong>Name:</strong> {student.firstName} {student.surname}</p>
            <p><strong>Address:</strong> {student.address1}</p>
            <p><strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Contact:</strong> {student.p1_phoneNumber}</p>
          </div>
        )}
        <div className="flex space-x-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <Input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <Input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex space-x-4 mt-4 mb-6">
          <Button onClick={downloadPDF}>
            Download PDF
          </Button>
          <Button onClick={viewPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View PDF
          </Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.debit > 0 ? `R ${item.debit.toFixed(2)}` : ""}</TableCell>
                <TableCell>{item.credit > 0 ? `R ${item.credit.toFixed(2)}` : ""}</TableCell>
                <TableCell>R {item.balance.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Current Balance</TableCell>
              <TableCell>
                R {filteredItems.length > 0 
                    ? filteredItems[filteredItems.length - 1].balance.toFixed(2) 
                    : "0.00"}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default StudentInvoice;