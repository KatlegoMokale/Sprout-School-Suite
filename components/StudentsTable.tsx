"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  Select1,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue1,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, PlusCircle, Search } from "lucide-react"
import { useGetStudentsQuery, useGetClassesQuery } from '@/lib/features/api/apiSlice'

interface IStudent {
  $id: string
  firstName: string
  secondName: string
  surname: string
  dateOfBirth: string
  age: number
  studentClass: string
  p1_firstName: string
  p1_surname: string
  p1_phoneNumber: string
}

interface IClass {
  $id: string
  name: string
}

export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortKey, setSortKey] = useState<keyof IStudent | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const { data: students = [], isLoading: studentsLoading, error: studentsError } = useGetStudentsQuery(undefined, {
    pollingInterval: 30000, // Refetch every 30 seconds
  })
  const { data: classes = [], isLoading: classesLoading } = useGetClassesQuery(undefined, {
    pollingInterval: 30000,
  })

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      // RTK Query will automatically refetch the data due to cache invalidation
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  }

  const handleSort = (key: keyof IStudent) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }

  const filteredStudents = students.filter((student: IStudent) =>
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentClass.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  if (studentsLoading || classesLoading) {
    return <div>Loading...</div>;
  }

  if (studentsError) {
    return <div>Error loading students</div>;
  }

  return (
    <div className="  px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="text-2xl font-bold">Student Management</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Link href="/students/add-student">
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('firstName')} className="cursor-pointer">
                    Name {sortKey === 'firstName' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('surname')} className="cursor-pointer">
                    Surname {sortKey === 'surname' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('dateOfBirth')} className="cursor-pointer">
                    Date of Birth {sortKey === 'dateOfBirth' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {sortedStudents.map((student) => (
                    <motion.tr
                      key={student.$id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${student.firstName} ${student.surname}`} />
                            <AvatarFallback>{student.firstName[0]}{student.surname[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.firstName} {student.secondName}</p>
                            <p className="text-sm text-muted-foreground">ID: {student.$id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.surname}</TableCell>
                      <TableCell>{student.dateOfBirth}</TableCell>
                      <TableCell>{classes.find((c: { $id: string }) => c.$id === student.studentClass)?.name || 'N/A'}</TableCell>
                      <TableCell>{student.p1_firstName} {student.p1_surname}</TableCell>
                      <TableCell>{student.p1_phoneNumber}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/students/edit-student/${student.$id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteStudent(student.$id)}>
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem>Add Payment</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}