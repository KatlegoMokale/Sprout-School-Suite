"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select1,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue1,
} from "@/components/ui/select"
import { IStudent, IStudentFeesSchema, ISchoolFees } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface QuickRegistrationBoardProps {
  students: IStudent[]
  studentSchoolFees: IStudentFeesSchema[]
  onRefresh: () => Promise<void> | void
}

interface IClassOption {
  $id: string
  name: string
}

export default function QuickRegistrationBoard({
  students,
  studentSchoolFees,
  onRefresh,
}: QuickRegistrationBoardProps) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [plans, setPlans] = useState<ISchoolFees[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [classes, setClasses] = useState<IClassOption[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>("all")
  const [selectedAge, setSelectedAge] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [draggingStudentId, setDraggingStudentId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await fetch("/api/school-fees")
        if (!response.ok) throw new Error("Failed to fetch school fees plans")
        const data = await response.json()
        setPlans(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load school fee plans.",
          variant: "destructive",
        })
      }
    }

    loadPlans()
  }, [])

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetch("/api/class")
        if (!response.ok) throw new Error("Failed to fetch classes")
        const data = await response.json()
        setClasses(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load classes.",
          variant: "destructive",
        })
      }
    }

    loadClasses()
  }, [])

  const yearPlans = useMemo(
    () => plans.filter((plan) => plan.year === selectedYear),
    [plans, selectedYear]
  )

  const registeredStudentIdsForYear = useMemo(
    () =>
      new Set(
        studentSchoolFees
          .filter((fee) => new Date(fee.startDate).getFullYear() === selectedYear)
          .map((fee) => fee.studentId)
      ),
    [studentSchoolFees, selectedYear]
  )

  useEffect(() => {
    if (yearPlans.length > 0 && !yearPlans.some((plan) => plan.$id === selectedPlanId)) {
      setSelectedPlanId(yearPlans[0].$id)
    }
  }, [yearPlans, selectedPlanId])

  const isRegisteredForYear = (studentId: string, year: number) =>
    year === selectedYear
      ? registeredStudentIdsForYear.has(studentId)
      : studentSchoolFees.some(
          (fee) => fee.studentId === studentId && new Date(fee.startDate).getFullYear() === year
        )

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase()
    return students.filter((student) => {
      const matchesSearch = term
        ? `${student.firstName} ${student.surname}`.toLowerCase().includes(term)
        : true
      const matchesClass = selectedClassId === "all" ? true : student.studentClass === selectedClassId
      const matchesAge = selectedAge === "all" ? true : String(student.age) === selectedAge
      return matchesSearch && matchesClass && matchesAge
    })
  }, [students, search, selectedClassId, selectedAge])

  const ageOptions = useMemo(() => {
    const uniqueAges = Array.from(new Set(students.map((student) => String(student.age).trim())))
      .filter((age) => age.length > 0)
      .sort((a, b) => Number(a) - Number(b))
    return uniqueAges
  }, [students])

  const classNameById = useMemo(
    () =>
      classes.reduce<Record<string, string>>((acc, item) => {
        acc[item.$id] = item.name
        return acc
      }, {}),
    [classes]
  )

  const unregisteredStudents = useMemo(
    () => filteredStudents.filter((student) => !registeredStudentIdsForYear.has(student.$id)),
    [filteredStudents, registeredStudentIdsForYear]
  )

  const registeredStudents = useMemo(
    () => filteredStudents.filter((student) => registeredStudentIdsForYear.has(student.$id)),
    [filteredStudents, registeredStudentIdsForYear]
  )

  const getMonthsBetweenInclusive = (startDate: Date, endDate: Date) => {
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1
    )
  }

  useEffect(() => {
    setSelectedStudentIds((prev) =>
      prev.filter((id) => unregisteredStudents.some((student) => student.$id === id))
    )
  }, [unregisteredStudents])

  const registerStudentForSelectedPlan = async (student: IStudent) => {
    if (!selectedPlanId) {
      throw new Error("Please select a school fees plan before registering.")
    }

    if (isRegisteredForYear(student.$id, selectedYear)) {
      throw new Error(`${student.firstName} ${student.surname} is already registered for ${selectedYear}.`)
    }

    const selectedPlan = yearPlans.find((plan) => plan.$id === selectedPlanId)
    if (!selectedPlan) {
      throw new Error("The selected fee plan could not be found.")
    }

    const now = new Date()
    const startDate =
      selectedYear === now.getFullYear()
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
        : new Date(selectedYear, 0, 1)
    const endDate = new Date(selectedYear, 11, 31)

    const monthsToBill = getMonthsBetweenInclusive(startDate, endDate)
    const totalFees = selectedPlan.registrationFee + selectedPlan.monthlyFee * monthsToBill

    const createFeeResponse = await fetch("/api/student-fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student.$id,
        schoolFeesRegId: selectedPlan.$id,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        fees: selectedPlan.monthlyFee,
        totalFees,
        paidAmount: 0,
        balance: totalFees,
        paymentFrequency: "monthly",
        paymentDate: 1,
      }),
    })

    const createFeeData = await createFeeResponse.json()
    if (!createFeeResponse.ok) {
      throw new Error(createFeeData?.message || "Failed to register student")
    }

    const newBalance = (student.balance || 0) + totalFees
    const updateStudentResponse = await fetch(`/api/students/${student.$id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ balance: newBalance }),
    })
    if (!updateStudentResponse.ok) {
      throw new Error("Student was registered but failed to update student balance.")
    }
  }

  const registerStudent = async (student: IStudent) => {
    setIsSaving(true)
    try {
      await registerStudentForSelectedPlan(student)
      await onRefresh()
      toast({
        title: "Registered",
        description: `${student.firstName} ${student.surname} was registered for ${selectedYear}.`,
      })
      setSelectedStudentIds((prev) => prev.filter((id) => id !== student.$id))
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Could not register student.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
      setDraggingStudentId(null)
    }
  }

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    )
  }

  const selectAllVisible = () => {
    setSelectedStudentIds(unregisteredStudents.map((student) => student.$id))
  }

  const clearSelection = () => {
    setSelectedStudentIds([])
  }

  const registerSelectedStudents = async () => {
    if (!selectedPlanId) {
      toast({
        title: "Select Fee Plan",
        description: "Please select a school fees plan before registering.",
        variant: "destructive",
      })
      return
    }

    const selectedStudents = unregisteredStudents.filter((student) =>
      selectedStudentIds.includes(student.$id)
    )

    if (selectedStudents.length === 0) {
      toast({
        title: "No Students Selected",
        description: "Select at least one unregistered student to continue.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const results = await Promise.allSettled(
        selectedStudents.map((student) => registerStudentForSelectedPlan(student))
      )

      const successCount = results.filter((result) => result.status === "fulfilled").length
      const failed = results.filter((result) => result.status === "rejected") as PromiseRejectedResult[]

      await onRefresh()
      clearSelection()

      if (successCount > 0) {
        toast({
          title: "Bulk Registration Complete",
          description: `${successCount} student(s) were successfully registered for ${selectedYear}.`,
        })
      }

      if (failed.length > 0) {
        const firstReason = failed[0].reason instanceof Error ? failed[0].reason.message : "Unknown error"
        toast({
          title: "Some Registrations Failed",
          description: `${failed.length} student(s) failed. First error: ${firstReason}`,
          variant: "destructive",
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const yearRange = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Select1 value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v, 10))}>
          <SelectTrigger>
            <SelectValue1 placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {yearRange.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select1>

        <Select1 value={selectedPlanId} onValueChange={setSelectedPlanId}>
          <SelectTrigger>
            <SelectValue1 placeholder="Select fee plan" />
          </SelectTrigger>
          <SelectContent>
            {yearPlans.map((plan) => (
              <SelectItem key={plan.$id} value={plan.$id}>
                {plan.ageStart}-{plan.ageEnd} {plan.ageUnit} | R{plan.monthlyFee}/month
              </SelectItem>
            ))}
          </SelectContent>
        </Select1>

        <Select1 value={selectedClassId} onValueChange={setSelectedClassId}>
          <SelectTrigger>
            <SelectValue1 placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((classItem) => (
              <SelectItem key={classItem.$id} value={classItem.$id}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select1>

        <Select1 value={selectedAge} onValueChange={setSelectedAge}>
          <SelectTrigger>
            <SelectValue1 placeholder="Filter by age" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            {ageOptions.map((age) => (
              <SelectItem key={age} value={age}>
                {age}
              </SelectItem>
            ))}
          </SelectContent>
        </Select1>

        <Input
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={selectAllVisible}
          disabled={isSaving || unregisteredStudents.length === 0}
        >
          Select All Visible
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearSelection}
          disabled={isSaving || selectedStudentIds.length === 0}
        >
          Clear Selection
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={registerSelectedStudents}
          disabled={isSaving || !selectedPlanId || selectedStudentIds.length === 0}
        >
          {isSaving ? "Registering..." : `Register Selected (${selectedStudentIds.length})`}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Unregistered</h3>
            <Badge variant="outline">{unregisteredStudents.length}</Badge>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {unregisteredStudents.map((student) => (
              <div
                key={student.$id}
                draggable={!isSaving}
                onDragStart={(e) => {
                  e.dataTransfer.setData("studentId", student.$id)
                  setDraggingStudentId(student.$id)
                }}
                className="rounded-md border p-2 bg-white cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 min-w-0 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedStudentIds.includes(student.$id)}
                      onChange={() => toggleStudentSelection(student.$id)}
                      disabled={isSaving}
                    />
                    <span className="text-sm font-medium truncate">
                      {student.firstName} {student.surname}
                    </span>
                  </label>
                  <div className="text-sm font-medium flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {classNameById[student.studentClass] || "No Class"}
                    </span>
                    {selectedStudentIds.includes(student.$id) && (
                      <Badge variant="secondary">Selected</Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isSaving || !selectedPlanId}
                    onClick={() => registerStudent(student)}
                  >
                    Register
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`border rounded-md p-3 min-h-[220px] ${draggingStudentId ? "bg-green-50 border-green-300" : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const studentId = e.dataTransfer.getData("studentId")
            const student = students.find((item) => item.$id === studentId)
            if (student) registerStudent(student)
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Registered</h3>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{registeredStudents.length}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Drag unregistered students here to register quickly.
          </p>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {registeredStudents.map((student) => (
              <div key={student.$id} className="rounded-md border p-2 bg-green-50">
                <div className="text-sm font-medium">
                  {student.firstName} {student.surname}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
