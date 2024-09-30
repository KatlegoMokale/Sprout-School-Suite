"use client";
import React, { useEffect, useState } from 'react'
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Dialog } from './ui/dialog'
import { DialogContent, DialogTrigger } from "@/components/ui/dialog"
import NewStudentForm from './NewStudentFrom'
import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface IStudent {
  $id: string;
  firstName: string;
  secondName: string;
  surname: string;
  address1:string;
  city: string;
  province: string;
  postalCode: string;
  dateOfBirth: string;
  gender: string;
  age: string;
  homeLanguage: string;
  allergies: string;
  medicalAidNumber: string;
  medicalAidScheme:string;
  studentClass: string;


  p1_relationship: string;
  p1_firstName: string;
  p1_surname: string;
  p1_address1: string;
  p1_city: string;
  p1_province: string;
  p1_postalCode: string;
  p1_dateOfBirth: string;
  p1_gender: string;
  p1_idNumber : string;
  p1_occupation: string;
  p1_phoneNumber:string;
  p1_email: string;
  p1_workNumber: string;
 
  p2_relationship: string;
  p2_firstName: string;
  p2_surname: string;
  p2_address1: string;
  p2_city: string;
  p2_province: string;
  p2_postalCode: string;
  p2_dateOfBirth: string;
  p2_gender: string;
  p2_idNumber: string;
  p2_occupation: string;
  p2_phoneNumber: string;
  p2_email: string;
  p2_workNumber: string;

}

const StudentsTable = () => {
  const [students, setStudents] = useState<IStudent[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string| null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;



  useEffect(()=>{
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const  response = await fetch("/api/students");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.log("Error fetching students:", error);
        setError("Failed to fetch students, Please try reloading the page.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudents();
  }, [])

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }  
      setStudents((prevStudents) =>
        prevStudents?.filter((student) => student.$id !== studentId)
      );
      } catch (error) {
      console.log("Error deleting student:", error);
      };
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = students?.slice(indexOfFirstRecord, indexOfLastRecord);
  
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
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Name
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Date</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Class</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Link href="/students/add-student">
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Student
                </span>
              </Button>
            </Link>
            {/* <Dialog>
                    <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Student
                  </span>
                </Button>
                </DialogTrigger>
                <DialogContent>
                    <NewStudentForm/>
                </DialogContent>
                </Dialog> */}
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Manage your students</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Surname</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Date of Birth
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Age</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Class
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Parent
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Contact
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {error && <p className="py-4 text-red-500">{error}</p>}
                  {isLoading ? (
                    <p className="p-3 text-slate-400">Loading...</p>
                  ) : (
                    currentRecords?.map((student) => (
                      <TableRow key={student.$id}>
                        <TableCell className="hidden sm:table-cell"></TableCell>
                        <TableCell className="font-medium">
                          {student.firstName} {student.secondName}
                        </TableCell>
                        <TableCell className="font-medium">
                          {student.surname}
                        </TableCell>
                        <TableCell>
                          {/* <Badge variant="outline">Draft</Badge> */}
                          {student.dateOfBirth}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {student.age}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {student.studentClass}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {student.p1_firstName} {student.p1_surname}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {student.p1_phoneNumber}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <Link
                                href={`/students/edit-student/${student.$id}`}
                              >
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() => handleDeleteStudent(student.$id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="">
              <div className="text-xs text-muted-foreground flex gap-1">
                Showing{" "}
                <strong>
                  {indexOfFirstRecord + 1}-
                  {Math.min(indexOfLastRecord, students?.length || 0)}
                  &nbsp;
                </strong>{" "}
                of <strong>{students?.length || 0}</strong> students
              </div>
              <PaginationComponent
                nPages={Math.ceil((students?.length || 0) / recordsPerPage)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );}

export default StudentsTable