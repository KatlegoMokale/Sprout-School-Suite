"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Phone, MoreHorizontal, PlusCircle, Search, Filter } from "lucide-react"
import Link from "next/link"
import Classes from "@/components/ui/classes"

interface IStaff {
  $id: string
  firstName: string
  surname: string
  position: string
  address1: string
  contact: string
}

interface IClass {
  $id: string
  name: string
  teacherName: string
}

const positionColors = {
  teacher: "bg-emerald-500",
  cleaner: "bg-amber-500",
  administrator: "bg-sky-500",
}

export default function CreativeStaffManagement() {
  const [staff, setStaff] = useState<IStaff[]>([])
  const [classes, setClasses] = useState<IClass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [staffResponse, classesResponse] = await Promise.all([
          fetch("/api/stuff"),
          fetch("/api/class"),
        ])
        if (!staffResponse.ok || !classesResponse.ok) {
          throw new Error("Failed to fetch data")
        }
        const staffData = await staffResponse.json()
        const classesData = await classesResponse.json()
        setStaff(staffData)
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

  const filteredStaff = staff.filter((member) => {
    const nameMatch = `${member.firstName} ${member.surname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const positionMatch = !selectedPosition || member.position.toLowerCase() === selectedPosition.toLowerCase()
    return nameMatch && positionMatch
  })

  if (isLoading) return <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className=" p-5 ">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-4xl font-bold text-gray-800">Staff Directory</h1>
            <Link href="/manage-school/add-stuff">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Staff
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by Position
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setSelectedPosition(null)}>All Positions</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedPosition("teacher")}>Teachers</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedPosition("cleaner")}>Cleaners</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedPosition("administrator")}>Administrators</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <motion.div 
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredStaff.map((member, index) => (
              <motion.div
                key={member.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <CardContent className="p-0">
                    <div className={`h-2 ${positionColors[member.position.toLowerCase() as keyof typeof positionColors] || 'bg-gray-500'}`} />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="/assets/placeholderprofile.svg" alt="Profile picture" />
                          <AvatarFallback className="text-lg">{member.firstName[0]}{member.surname[0]}</AvatarFallback>
                        </Avatar>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/manage-school/stuff/${member.$id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h2 className="text-xl font-semibold mb-1">{member.firstName} {member.surname}</h2>
                      <p className="text-sm font-medium text-gray-600 mb-3">{member.position}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-red-500" />
                        <span className="truncate">{member.address1}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                        <span>{member.contact}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="lg:w-1/4">
          <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
              <h2 className="text-2xl font-bold text-white mb-2">Classes</h2>
              <p className="text-blue-100">Overview of all classes</p>
            </div>
            <CardContent className="p-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mb-4 bg-purple-500 hover:bg-purple-600 text-white">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Class</DialogTitle>
                    <DialogDescription>Add a new class to the system.</DialogDescription>
                  </DialogHeader>
                  <Classes />
                </DialogContent>
              </Dialog>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {classes.map((classData, index) => (
                  <motion.div
                    key={classData.$id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">Class {classData.name}</h3>
                        <p className="text-sm text-gray-600">Teacher: {classData.teacherName}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}