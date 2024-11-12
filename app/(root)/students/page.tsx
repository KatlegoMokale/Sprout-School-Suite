"use client"

import { useState, useEffect } from "react"
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
import { MoreHorizontal, PlusCircle, Search, UserPlus, UserRoundPen } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import StudentRegistration from "@/components/ui/StudentRegistration"

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
  const [students, setStudents] = useState<IStudent[]>([])
  const [classes, setClasses] = useState<IClass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [sortConfig, setSortConfig] = useState<{ key: keyof IStudent; direction: 'asc' | 'desc' } | null>(null)

  const recordsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [studentsResponse, classesResponse] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/class"),
        ])
        if (!studentsResponse.ok || !classesResponse.ok) {
          throw new Error("Failed to fetch data")
        }
        const studentsData = await studentsResponse.json()
        const classesData = await classesResponse.json()
        setStudents(studentsData)
        setClasses(classesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch data. Please try reloading the page.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete student")
      }
      setStudents((prevStudents) => prevStudents.filter((student) => student.$id !== studentId))
    } catch (error) {
      console.error("Error deleting student:", error)
    }
  }

  const filteredStudents = students.filter((student) => {
    const searchMatch = `${student.firstName} ${student.secondName} ${student.surname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const classMatch = selectedClass === "all" || student.studentClass === selectedClass
    return searchMatch && classMatch
  })

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
    return 0
  })

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = sortedStudents.slice(indexOfFirstRecord, indexOfLastRecord)

  const totalPages = Math.ceil(sortedStudents.length / recordsPerPage)

  const handleSort = (key: keyof IStudent) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key) {
        return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select1 value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue1 placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((classItem) => (
                    <SelectItem className=" hover:bg-green-200" key={classItem.$id} value={classItem.$id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select1>
              <Link href="/students/add-student">
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Student
                </Button>
              </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserRoundPen className="h-4 w-4 mr-2" />
                        Register Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className=" container">
                    <DialogTitle hidden>
                      Register Student
                    </DialogTitle>
                    <StudentRegistration/>
                  </DialogContent>
                  
                </Dialog>
                

            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('firstName')} className="cursor-pointer">
                    Name {sortConfig?.key === 'firstName' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('surname')} className="cursor-pointer">
                    Surname {sortConfig?.key === 'surname' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('dateOfBirth')} className="cursor-pointer">
                    Date of Birth {sortConfig?.key === 'dateOfBirth' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {currentRecords.map((student) => (
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
                      <TableCell>{classes.find((c) => c.$id === student.studentClass)?.name || 'N/A'}</TableCell>
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
        <CardFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, sortedStudents.length)} of {sortedStudents.length} students
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}