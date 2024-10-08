"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableBody, TableCell, TableHead, TableHeader, TableRow,Table } from '@/components/ui/table'
import { IStudent, ITransactions } from '@/lib/utils'
import { Badge, Car } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const Finances = () => {
    const [transactions, setTransactions] = useState<ITransactions[]>([]);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/transactions`);
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                const data = await response.json();
                console.log(data)
                setTransactions(data)
            } catch (error) {
                console.log('Error fetching transactions:', error);
                setError("Failed to fetch transactions. Please try again later.");
            } finally{
              setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`/api/students`);
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.log('Error fetching students:', error);
                setError("Failed to fetch students. Please try again later.");
            }
        };
        fetchStudents();
    }, []);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = transactions.slice(indexOfFirstRecord, indexOfLastRecord);

    const PaginationComponent = ({ nPages, currentPage, setCurrentPage }) => {
      const pageNumbers = [...Array(nPages + 1).keys()].slice(1);


      return (
      <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
              />
            </PaginationItem>
            {pageNumbers.map(pgNumber => (
              <PaginationItem key={pgNumber}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === pgNumber}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(pgNumber);
                  }}
                >
                  {pgNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            {nPages > 5 && <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < nPages) setCurrentPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
    };


  return (
    <div className="flex min-h-screen w-full flex-col">
      Finances Page
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                R45,231.89
              </div>
              <p>
                  +20.1% from last month  
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                R45,231.89
              </div>
              <p>
                  +20.1% from last month  
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                R45,231.89
              </div>
              <p>
                  +20.1% from last month  
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Outstanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                R45,231.89
              </div>
              <p>
                  +20.1% from last month  
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader>
            <div className="grid gap-2">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Recent transactions from your</CardDescription>
            </div>
            </CardHeader> 
            <CardContent>
            <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">
                            Student
                            </TableHead>
                            <TableHead className="">
                              Age
                            </TableHead>
                          <TableHead className="">
                            Type
                          </TableHead>
                          <TableHead className="">
                            Date
                          </TableHead>
                          <TableHead className="">
                            Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {error && <p className='py-4 text-red-500'>{error}</p>}
                        {
                          isLoading ? (<p className='p-3 text-slate-400'>Loading...</p>) : (
                              currentRecords.map((transaction) => (
                              <TableRow key={transaction.$id}>
                                <TableCell>
                                  <div className="">{transaction.firstName} {transaction.surname}</div>
                                </TableCell>
                                <TableCell>
                                  {
                                    students.map((student) => (
                                      student.$id === transaction.studentId ? (
                                        <div key={student.$id}>
                                          {student.age}
                                        </div>
                                      ) : null
                                    ))  
                                  }
                                </TableCell>
                                <TableCell>
                                  {transaction.paymentMethod}
                                </TableCell>
                                <TableCell>
                                  {transaction.paymentDate}
                                </TableCell>
                                <TableCell>
                                  R {transaction.amount}
                                </TableCell>
                              </TableRow>
                            ))
                          )
                        }
                      
                      </TableBody>
            </Table>
            </CardContent>
            
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Finances;
