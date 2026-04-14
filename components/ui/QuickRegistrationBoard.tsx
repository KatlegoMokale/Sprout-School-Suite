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

export default function QuickRegistrationBoard({
  students,
  studentSchoolFees,
  onRefresh,
}: QuickRegistrationBoardProps) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [plans, setPlans] = useState<ISchoolFees[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [search, setSearch] = useState("")
  const [draggingStudentId, setDraggingStudentId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

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

  const yearPlans = useMemo(
    () => plans.filter((plan) => plan.year === selectedYear),
    [plans, selectedYear]
  )

  useEffect(() => {
    if (yearPlans.length > 0 && !yearPlans.some((plan) => plan.$id === selectedPlanId)) {
      setSelectedPlanId(yearPlans[0].$id)
    }
  }, [yearPlans, selectedPlanId])

  const isRegisteredForYear = (studentId: string, year: number) =>
    studentSchoolFees.some(
      (fee) => fee.studentId === studentId && new Date(fee.startDate).getFullYear() === year
    )

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return students
    return students.filter((student) =>
      `${student.firstName} ${student.surname}`.toLowerCase().includes(term)
    )
  }, [students, search])

  const unregisteredStudents = filteredStudents.filter(
    (student) => !isRegisteredForYear(student.$id, selectedYear)
  )

  const registeredStudents = filteredStudents.filter((student) =>
    isRegisteredForYear(student.$id, selectedYear)
  )

  const getMonthsBetweenInclusive = (startDate: Date, endDate: Date) => {
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1
    )
  }

  const registerStudent = async (student: IStudent) => {
    if (!selectedPlanId) {
      toast({
        title: "Select Fee Plan",
        description: "Please select a school fees plan before registering.",
        variant: "destructive",
      })
      return
    }

    if (isRegisteredForYear(student.$id, selectedYear)) {
      toast({
        title: "Already Registered",
        description: `${student.firstName} ${student.surname} is already registered for ${selectedYear}.`,
      })
      return
    }

    const selectedPlan = yearPlans.find((plan) => plan.$id === selectedPlanId)
    if (!selectedPlan) {
      toast({
        title: "Plan Not Found",
        description: "The selected fee plan could not be found.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
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
      await fetch(`/api/students/${student.$id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: newBalance }),
      })

      await onRefresh()
      toast({
        title: "Registered",
        description: `${student.firstName} ${student.surname} was registered for ${selectedYear}.`,
      })
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

  const yearRange = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

        <Input
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
                  <div className="text-sm font-medium">
                    {student.firstName} {student.surname}
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
