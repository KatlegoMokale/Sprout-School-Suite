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

      if (fee.competitionWinner) {
        const competitionCredit = Math.max(
          0,
          (fee.totalFees || 0) - Number(schoolFee?.registrationFee || 0)
        );

        if (competitionCredit > 0) {
          balance -= competitionCredit;
          items.push({
            date: startDate.toISOString(),
            description: `Competition Credit - Full Year`,
            debit: 0,
            credit: competitionCredit,
            balance: balance,
          });
        }

        continue;
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

const toDDMMYY = (date: Date) => {
  const dd = `${date.getDate()}`.padStart(2, "0");
  const mm = `${date.getMonth() + 1}`.padStart(2, "0");
  const yy = `${date.getFullYear()}`.slice(-2);
  return `${dd}/${mm}/${yy}`;
};

const formatCurrency = (value: number) => `R${value.toFixed(2)}`;

const loadImageAsDataUrl = async (src: string) => {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to load logo image"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const unwrappedParams = await params;
        const [studentResponse, transactionsResponse, studentFeesResponse, schoolFeesResponse] = await Promise.all([
          fetch(`/api/students/${unwrappedParams.id}`),
          fetch(`/api/fee-transactions`),
          fetch(`/api/student-fees`),
          fetch(`/api/school-fees`)
        ]);

        if (!studentResponse.ok || !transactionsResponse.ok || !studentFeesResponse.ok || !schoolFeesResponse.ok) 
          throw new Error("Failed to fetch data");

        const studentData: IStudent = await studentResponse.json();
        const transactionsData: ITransactions[] = await transactionsResponse.json();
        const studentFeesData: IStudentFeesSchema[] = await studentFeesResponse.json();
        const schoolFeesData: ISchoolFees[] = await schoolFeesResponse.json();

        setStudent(studentData);
        
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

  const generatePDF = async () => {
    if (!student) return null;

    const filteredItems = filterStatementItems();
    const totalBalance = filteredItems.length > 0 ? filteredItems[filteredItems.length - 1].balance : 0;
    const now = new Date();
    const logoDataUrl = await loadImageAsDataUrl("/assets/sssLogo.png");

    const totalPaid = filteredItems.reduce((sum, item) => sum + item.credit, 0);
    const currentMonthBilled = filteredItems
      .filter((item) => {
        const d = new Date(item.date);
        return item.debit > 0 && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, item) => sum + item.debit, 0);
    const billedThisYear = filteredItems
      .filter((item) => new Date(item.date).getFullYear() === now.getFullYear())
      .reduce((sum, item) => sum + item.debit, 0);
    const paidThisYear = filteredItems
      .filter((item) => new Date(item.date).getFullYear() === now.getFullYear())
      .reduce((sum, item) => sum + item.credit, 0);
    const outstandingYear = billedThisYear - paidThisYear;

    const doc = new jsPDF();

    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 297, "F");

    doc.setDrawColor(122, 145, 0);
    doc.setLineWidth(1.5);
    doc.line(0, 36, 136, 36);
    doc.setDrawColor(0, 138, 145);
    doc.line(0, 39, 210, 39);

    doc.setTextColor(20, 102, 110);
    doc.setFontSize(20);
    doc.setFont("times", "bold");
    doc.text("ANGELS WORLD DAY CARE CENTRE", 4, 49);
    doc.setTextColor(95, 113, 0);
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("19 Boniface Street, CE3, Vanderbijlpark, 1911", 4, 56);
    doc.text("016 100 6298 / 083 683 1036", 4, 61);

    if (logoDataUrl) {
      doc.addImage(logoDataUrl, "PNG", 148, 12, 50, 52);
    }

    doc.setFillColor(0, 129, 135);
    doc.rect(0, 78, 210, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SCHOOL FEES STATEMENT", 105, 84.5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${toDDMMYY(now)}`, 206, 84.5, { align: "right" });

    doc.setFillColor(122, 145, 0);
    doc.rect(15, 95, 85, 7, "F");
    doc.rect(110, 95, 85, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Student Information:", 17, 100);
    doc.text("Financial Summary:", 112, 100);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${student.firstName} ${student.surname}`, 15, 108);
    doc.text(`Age: ${student.age || "N/A"}`, 15, 114);
    const monthlyFees = studentFees.length > 0 ? studentFees[0].fees : 0;
    doc.text(`Monthly Fees: ${formatCurrency(monthlyFees)}`, 15, 120);

    doc.text(`Total Paid: ${formatCurrency(totalPaid)}`, 110, 108);
    doc.text(`Fees Billed (Current): ${formatCurrency(currentMonthBilled)}`, 110, 114);
    doc.text(`Fees Billed (Year): ${formatCurrency(billedThisYear)}`, 110, 120);
    doc.setTextColor(0, 109, 118);
    doc.setFont("helvetica", "bold");
    doc.text(`Outstanding (Year): ${formatCurrency(outstandingYear)}`, 110, 126);
    doc.text(`Outstanding (Current): ${formatCurrency(totalBalance)}`, 110, 132);

    doc.setFillColor(122, 145, 0);
    doc.rect(15, 140, 180, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Transaction History:", 17, 145);

    const tableData = filteredItems.map((item) => {
      const date = new Date(item.date);
      return [
        toDDMMYY(date),
        item.description,
        item.debit > 0 ? `R${item.debit.toFixed(2)}` : "",
        item.credit > 0 ? `R${item.credit.toFixed(2)}` : "",
        `R${item.balance.toFixed(2)}`,
      ];
    });

    (doc as any).autoTable({
      startY: 151,
      head: [["Date", "Description", "Debit", "Credit", "Balance"]],
      body: tableData,
      foot: [["Current Balance", "", "", "", `R${totalBalance.toFixed(2)}`]],
      theme: "striped",
      headStyles: { fillColor: [0, 129, 135], textColor: [255, 255, 255], fontStyle: "bold" },
      footStyles: { fillColor: [0, 129, 135], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [235, 235, 235] },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 70 },
        2: { cellWidth: 26, halign: "right" },
        3: { cellWidth: 26, halign: "right" },
        4: { cellWidth: 28, halign: "right" },
      },
      styles: { fontSize: 10, cellPadding: 1.8 },
      margin: { left: 15, right: 15 },
    });

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "This is an official school fees statement. Please retain for your records.",
      105,
      232,
      { align: "center" }
    );

    return doc;
  };

  const downloadPDF = async () => {
    const doc = await generatePDF();
    if (doc) {
      doc.save(`student_statement_${student?.firstName}_${student?.surname}.pdf`);
    }
  };

  const viewPDF = async () => {
    const doc = await generatePDF();
    if (doc) {
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 30000);
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
  const currentBalance =
    filteredItems.length > 0 ? filteredItems[filteredItems.length - 1].balance : 0;



  return (
    <div className='container mx-auto px-4 py-6 space-y-6'>
      <Link href="/school-fees" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft className="mr-2 h-4 w-4" />
        School Fees
      </Link>
      <div className="overflow-hidden rounded-xl border shadow-sm">
        <div className="bg-purple-700 px-6 py-5 text-white">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm opacity-90">Angels World Day Care Centre</p>
              <h1 className="text-2xl font-bold">Account Statement</h1>
            </div>
            <div className="text-sm">
              <p className="font-medium">Statement Period</p>
              <p>{startDate || "Start"} - {endDate || "Today"}</p>
            </div>
          </div>
        </div>
        <div className="bg-white px-6 py-5">
          {student && (
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <p><strong>Name:</strong> {student.firstName} {student.surname}</p>
              <p><strong>ID:</strong> {student.$id}</p>
              <p><strong>Address:</strong> {student.address1}</p>
              <p><strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}</p>
              <p><strong>Contact:</strong> {student.p1_phoneNumber}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Statement Summary</h2>
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
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
        <div className="mb-6 flex flex-wrap gap-3">
          <Button onClick={downloadPDF}>
            Download PDF
          </Button>
          <Button onClick={viewPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View PDF
          </Button>
        </div>
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
                R {currentBalance.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default StudentInvoice;
