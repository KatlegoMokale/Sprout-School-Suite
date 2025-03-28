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
import { MapPin, Phone, MoreHorizontal, PlusCircle, Search, Filter, Trash2, Edit, LayoutGrid, Table as TableIcon } from "lucide-react"
import Link from "next/link"
import Classes from "@/components/ui/ClassForm"
import Event from "@/components/ui/event"
import { IClass, IEvent, IStuff, positionColors } from "@/lib/utils"
import { set } from "date-fns"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from '@/lib/store'
import { fetchClasses, selectClasses } from "@/lib/features/classes/classesSlice"
import { fetchEvents, selectEvents } from "@/lib/features/events/eventsSlice"
import { fetchStudents, selectStudents } from "@/lib/features/students/studentsSlice"
import { fetchStuff, selectStuff } from "@/lib/features/stuff/stuffSlice"
import { fetchTransactions, selectTransactions } from "@/lib/features/transactions/transactionsSlice"
import { fetchPettyCash, selectPettyCash } from "@/lib/features/pettyCash/pettyCashSlice"
import { fetchGroceries, selectGroceries } from "@/lib/features/grocery/grocerySlice"
import { toast } from "@/hooks/use-toast"
import StaffTable from "@/components/ui/StaffTable"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function CreativeStaffManagement() {
  const dispatch = useDispatch<AppDispatch>() 
  const { classes, classesStatus, classesError } = useSelector((state: RootState)=> state.classes);
  const { stuff, stuffStatus, stuffError } = useSelector((state: RootState) => state.stuff)
  const { events, eventsStatus, eventsError } = useSelector((state: RootState) => state.events)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'class' | 'event' | 'stuff' } | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  useEffect(() => {
    if (classesStatus === 'idle') {
      dispatch(fetchClasses())
    }
    if (stuffStatus === 'idle') {
      dispatch(fetchStuff())
    }
    if (eventsStatus === 'idle') {
      dispatch(fetchEvents())
    }
    setIsLoading(stuffStatus === 'loading' || classesStatus === 'loading' || eventsStatus === 'loading')
    if (classesStatus === 'failed' || stuffStatus === 'failed' || eventsStatus === 'failed') {
      setError("Failed to fetch data. Please try reloading the page.")
    }
  }, [dispatch, classesStatus, stuffStatus, eventsStatus])

  const filteredStaff = stuff
    .filter((member) => {
      const nameMatch = `${member.firstName} ${member.surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const positionMatch = !selectedPosition || member.position.toLowerCase() === selectedPosition.toLowerCase()
      return nameMatch && positionMatch
    })
    .sort((a, b) => {
      const nameA = `${a.firstName} ${a.surname}`.toLowerCase()
      const nameB = `${b.firstName} ${b.surname}`.toLowerCase()
      return nameA.localeCompare(nameB)
    })

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      const response = await fetch(`/api/${itemToDelete.type}/${itemToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete item')

      toast({
        title: "Success",
        description: `${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} deleted successfully`,
      })

      // Refresh the data
      if (itemToDelete.type === 'class') {
        dispatch(fetchClasses())
      } else if (itemToDelete.type === 'event') {
        dispatch(fetchEvents())
      } else if (itemToDelete.type === 'stuff') {
        dispatch(fetchStuff())
      }

      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    } catch (error) {
      console.error('Error deleting item:', error)
      toast({
        title: "Error",
        description: `Failed to delete ${itemToDelete.type}`,
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className="p-5">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-4xl font-bold text-gray-800">Staff Directory</h1>
            <div className="flex gap-2">
              <div className="flex rounded-md  p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-r-none transition-colors ${
                    viewMode === 'grid' 
                      ? '  shadow-sm hover:bg-white' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <LayoutGrid className={`h-4 w-4 ${viewMode === 'grid' ? 'text-emerald-500' : 'text-gray-500'}`} />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('table')}
                  className={`rounded-l-none transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-white shadow-sm hover:bg-white' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <TableIcon className={`h-4 w-4 ${viewMode === 'table' ? 'text-emerald-500' : 'text-gray-500'}`} />
                </Button>
              </div>
              <Link href="/manage-school/add-stuff">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add New Staff
                </Button>
              </Link>
            </div>
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
                <DropdownMenuItem onSelect={() => setSelectedPosition("assistant")}>Assistants</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedPosition("cook")}>Cook</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedPosition("administrator")}>Administrators</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {viewMode === 'grid' ? (
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
                              <DropdownMenuItem onClick={() => {
                                setItemToDelete({ id: member.$id, type: 'stuff' })
                                setIsDeleteDialogOpen(true)
                              }}>
                                Delete
                              </DropdownMenuItem>
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
          ) : (
            <StaffTable 
              staff={filteredStaff} 
              onDelete={(id) => {
                setItemToDelete({ id, type: 'stuff' })
                setIsDeleteDialogOpen(true)
              }}
            />
          )}
        </div>
        <div className="lg:w-1/4 flex flex-col">
          <Card className="bg-white shadow-xl rounded-lg overflow-hidden row-span-1">
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
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Add New Class</DialogTitle>
                    <DialogDescription>Add a new class to the system.</DialogDescription>
                  </DialogHeader>
                  <Classes />
                </DialogContent>
              </Dialog>
              <div className="space-y-4">
                {classes.map((classData, index) => (
                  <motion.div
                    key={classData.$id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">Class {classData.name}</h3>
                            <p className="text-sm text-gray-600">Teacher: {classData.teacherName}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/manage-school/class/${classData.$id}`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setItemToDelete({ id: classData.$id, type: 'class' })
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-xl rounded-lg overflow-hidden mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
              <h2 className="text-2xl font-bold text-white mb-2">Events</h2>
              <p className="text-blue-100">Overview of all Events</p>
            </div>
            <CardContent className="p-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mb-4 bg-purple-500 hover:bg-purple-600 text-white">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader className="hidden">
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>Add a new event to the system.</DialogDescription>
                  </DialogHeader>
                  <Event />
                </DialogContent>
              </Dialog>
              <div className="space-y-4">
                {events.map((event: IEvent, index) => (
                  <motion.div
                    key={event.$id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{event.eventName}</h3>
                            <p className="text-sm text-gray-600">Description: {event.description}</p>
                            <p className="text-sm text-gray-600">Price: R {event.amount}.00</p>
                            <p className="text-sm text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/manage-school/event/${event.$id}`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setItemToDelete({ id: event.$id, type: 'event' })
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}