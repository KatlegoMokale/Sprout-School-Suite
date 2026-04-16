"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select1,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue1,
} from "@/components/ui/select"
import { IStudent, IStudentFeesSchema } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface StudentRegistrationManagerProps {
  student: IStudent | null
  onSaved?: () => Promise<void> | void
}

interface RegistrationFormState {
  startDate: string
  endDate: string
  fees: number
  totalFees: number
  paidAmount: number
  balance: number
  paymentFrequency: "monthly" | "quarterly" | "yearly"
  paymentDate: number
  discountType: "none" | "percentage" | "amount"
  discountValue: number
  fullExemption: boolean
  exemptedMonthsText: string
  competitionWinner: boolean
  competitionTitle: string
  registrationNotes: string
}

const defaultFormState: RegistrationFormState = {
  startDate: "",
  endDate: "",
  fees: 0,
  totalFees: 0,
  paidAmount: 0,
  balance: 0,
  paymentFrequency: "monthly",
  paymentDate: 1,
  discountType: "none",
  discountValue: 0,
  fullExemption: false,
  exemptedMonthsText: "",
  competitionWinner: false,
  competitionTitle: "",
  registrationNotes: "",
}

export default function StudentRegistrationManager({
  student,
  onSaved,
}: StudentRegistrationManagerProps) {
  const [registrations, setRegistrations] = useState<IStudentFeesSchema[]>([])
  const [selectedRegistrationId, setSelectedRegistrationId] = useState("")
  const [form, setForm] = useState<RegistrationFormState>(defaultFormState)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const selectedRegistration = useMemo(
    () => registrations.find((item) => item.$id === selectedRegistrationId),
    [registrations, selectedRegistrationId]
  )

  const setFormFromRegistration = (registration: IStudentFeesSchema) => {
    setForm({
      startDate: registration.startDate || "",
      endDate: registration.endDate || "",
      fees: registration.fees || 0,
      totalFees: registration.totalFees || 0,
      paidAmount: registration.paidAmount || 0,
      balance: registration.balance || 0,
      paymentFrequency: (registration.paymentFrequency as "monthly" | "quarterly" | "yearly") || "monthly",
      paymentDate: registration.paymentDate || 1,
      discountType: registration.discountType || "none",
      discountValue: registration.discountValue || 0,
      fullExemption: Boolean(registration.fullExemption),
      exemptedMonthsText: (registration.exemptedMonths || []).join(", "),
      competitionWinner: Boolean(registration.competitionWinner),
      competitionTitle: registration.competitionTitle || "",
      registrationNotes: registration.registrationNotes || "",
    })
  }

  useEffect(() => {
    const loadStudentRegistrations = async () => {
      if (!student?.$id) {
        setRegistrations([])
        setSelectedRegistrationId("")
        setForm(defaultFormState)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch("/api/student-fees")
        if (!response.ok) throw new Error("Failed to load student registrations")

        const data = (await response.json()) as IStudentFeesSchema[]
        const byStudent = data.filter((item) => item.studentId === student.$id)

        setRegistrations(byStudent)
        if (byStudent.length > 0) {
          setSelectedRegistrationId(byStudent[0].$id)
          setFormFromRegistration(byStudent[0])
        } else {
          setSelectedRegistrationId("")
          setForm(defaultFormState)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Could not load registration data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadStudentRegistrations()
  }, [student?.$id])

  const handleSelectRegistration = (registrationId: string) => {
    setSelectedRegistrationId(registrationId)
    const target = registrations.find((item) => item.$id === registrationId)
    if (target) setFormFromRegistration(target)
  }

  const getMonthsBetweenInclusive = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0

    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1
  }

  const handleCalculate = () => {
    if (!form.startDate || !form.endDate) {
      toast({
        title: "Missing Dates",
        description: "Please set start and end date before calculating.",
        variant: "destructive",
      })
      return
    }

    const monthsCount = getMonthsBetweenInclusive(form.startDate, form.endDate)
    if (monthsCount <= 0) {
      toast({
        title: "Invalid Period",
        description: "End date must be equal to or after start date.",
        variant: "destructive",
      })
      return
    }

    let billingUnits = monthsCount
    if (form.paymentFrequency === "quarterly") billingUnits = Math.ceil(monthsCount / 3)
    if (form.paymentFrequency === "yearly") billingUnits = Math.ceil(monthsCount / 12)

    const baseTotal = Math.max(0, Number(form.fees) || 0) * billingUnits

    let calculatedTotal = baseTotal
    if (form.fullExemption || form.competitionWinner) {
      calculatedTotal = 0
    } else {
      const exemptedMonthsCount = form.exemptedMonthsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean).length

      const monthRate =
        form.paymentFrequency === "monthly"
          ? form.fees
          : form.paymentFrequency === "quarterly"
          ? form.fees / 3
          : form.fees / 12

      const exemptionAmount = Math.max(0, monthRate * exemptedMonthsCount)
      calculatedTotal = Math.max(0, calculatedTotal - exemptionAmount)

      if (form.discountType === "percentage") {
        calculatedTotal = Math.max(0, calculatedTotal - calculatedTotal * ((Number(form.discountValue) || 0) / 100))
      } else if (form.discountType === "amount") {
        calculatedTotal = Math.max(0, calculatedTotal - (Number(form.discountValue) || 0))
      }
    }

    const roundedTotal = Number(calculatedTotal.toFixed(2))
    let calculatedPaid = Number(form.paidAmount) || 0

    if (calculatedPaid <= 0 && (Number(form.balance) || 0) > 0) {
      calculatedPaid = roundedTotal - (Number(form.balance) || 0)
    }

    calculatedPaid = Math.min(Math.max(0, calculatedPaid), roundedTotal)
    const calculatedBalance = Number((roundedTotal - calculatedPaid).toFixed(2))

    setForm((prev) => ({
      ...prev,
      totalFees: roundedTotal,
      paidAmount: Number(calculatedPaid.toFixed(2)),
      balance: calculatedBalance,
    }))

    toast({
      title: "Calculated",
      description: "Total fees, paid amount, and balance were recalculated.",
    })
  }

  const handleSave = async () => {
    if (!selectedRegistrationId) {
      toast({
        title: "No Registration",
        description: "This student does not have a registration record to update yet.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const exemptedMonths = form.exemptedMonthsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)

      const payload = {
        startDate: form.startDate,
        endDate: form.endDate,
        fees: Number(form.fees) || 0,
        totalFees: Number(form.totalFees) || 0,
        paidAmount: Number(form.paidAmount) || 0,
        balance: Number(form.balance) || 0,
        paymentFrequency: form.paymentFrequency,
        paymentDate: Number(form.paymentDate) || 1,
        discountType: form.discountType,
        discountValue: Number(form.discountValue) || 0,
        fullExemption: Boolean(form.fullExemption),
        exemptedMonths,
        competitionWinner: Boolean(form.competitionWinner),
        competitionTitle: form.competitionTitle.trim(),
        registrationNotes: form.registrationNotes.trim(),
      }

      const response = await fetch(`/api/student-fees/${selectedRegistrationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.message || "Failed to update registration")
      }

      // Keep competition credit transaction in sync with registration settings.
      const [transactionsResponse, plansResponse] = await Promise.all([
        fetch("/api/fee-transactions"),
        fetch("/api/school-fees"),
      ])

      if (transactionsResponse.ok && plansResponse.ok && student?.$id) {
        const allTransactions = await transactionsResponse.json()
        const plans = await plansResponse.json()
        const registration = registrations.find((item) => item.$id === selectedRegistrationId)
        const plan = plans.find((item: any) => item.$id === registration?.schoolFeesRegId)
        const registrationFee = Number(plan?.registrationFee || 0)
        const fullYearCreditAmount = Math.max(0, (Number(payload.totalFees) || 0) - registrationFee)
        const competitionMethodPrefix = "Competition Credit"
        const competitionPaymentMethod = form.competitionTitle.trim()
          ? `${competitionMethodPrefix} - ${form.competitionTitle.trim()}`
          : `${competitionMethodPrefix} - Full Year`

        const existingCompetitionTransactions = allTransactions.filter(
          (item: any) =>
            item.studentId === student.$id &&
            item.feeType === "school-fees" &&
            typeof item.paymentMethod === "string" &&
            item.paymentMethod.startsWith(competitionMethodPrefix)
        )

        if (payload.competitionWinner && fullYearCreditAmount > 0) {
          const paymentDate = payload.startDate || new Date().toISOString().split("T")[0]
          if (existingCompetitionTransactions.length > 0) {
            await Promise.all(
              existingCompetitionTransactions.map((item: any, index: number) =>
                fetch(`/api/fee-transactions/${item.$id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    amount: index === 0 ? fullYearCreditAmount : 0,
                    paymentDate,
                    paymentMethod: competitionPaymentMethod,
                    feeType: "school-fees",
                  }),
                })
              )
            )

            // Remove any duplicate zeroed records, keep one competition credit transaction.
            await Promise.all(
              existingCompetitionTransactions.slice(1).map((item: any) =>
                fetch(`/api/fee-transactions/${item.$id}`, { method: "DELETE" })
              )
            )
          } else {
            await fetch("/api/fee-transactions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                studentId: student.$id,
                amount: fullYearCreditAmount,
                paymentMethod: competitionPaymentMethod,
                paymentDate,
                feeType: "school-fees",
              }),
            })
          }
        } else if (existingCompetitionTransactions.length > 0) {
          await Promise.all(
            existingCompetitionTransactions.map((item: any) =>
              fetch(`/api/fee-transactions/${item.$id}`, { method: "DELETE" })
            )
          )
        }
      }

      toast({
        title: "Saved",
        description: "Student registration settings were updated.",
      })

      setRegistrations((prev) =>
        prev.map((item) =>
          item.$id === selectedRegistrationId
            ? {
                ...item,
                ...payload,
              }
            : item
        )
      )

      if (onSaved) await onSaved()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not update this registration.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DialogContent className="w-[92vw] min-w-0 max-w-3xl max-h-[85vh]">
      <DialogHeader>
        <DialogTitle>Manage Registration Settings</DialogTitle>
        <DialogDescription>
          {student
            ? `${student.firstName} ${student.surname}: edit registration details, discounts, exemptions, and competition settings.`
            : "Select a student to manage registration settings."}
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="max-h-[65vh] pr-2">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Registration Record</Label>
            <Select1
              value={selectedRegistrationId || "none"}
              onValueChange={(value) => value !== "none" && handleSelectRegistration(value)}
              disabled={isLoading || registrations.length === 0}
            >
              <SelectTrigger>
                <SelectValue1 placeholder={isLoading ? "Loading..." : "Select registration"} />
              </SelectTrigger>
              <SelectContent>
                {registrations.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No registrations found
                  </SelectItem>
                ) : (
                  registrations.map((registration) => (
                    <SelectItem key={registration.$id} value={registration.$id}>
                      {registration.startDate} to {registration.endDate} ({registration.paymentFrequency})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                disabled={!selectedRegistrationId}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                disabled={!selectedRegistrationId}
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Frequency</Label>
              <Select1
                value={form.paymentFrequency}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    paymentFrequency: value as "monthly" | "quarterly" | "yearly",
                  }))
                }
                disabled={!selectedRegistrationId}
              >
                <SelectTrigger>
                  <SelectValue1 />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select1>
            </div>
            <div className="space-y-2">
              <Label>Payment Date (Day)</Label>
              <Input
                type="number"
                min={1}
                max={31}
                value={form.paymentDate}
                onChange={(e) => setForm((prev) => ({ ...prev, paymentDate: Number(e.target.value) || 1 }))}
                disabled={!selectedRegistrationId}
              />
            </div>
            <div className="space-y-2">
              <Label>Fees</Label>
              <Input
                type="number"
                value={form.fees}
                onChange={(e) => setForm((prev) => ({ ...prev, fees: Number(e.target.value) || 0 }))}
                disabled={!selectedRegistrationId}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Fees</Label>
              <Input
                type="number"
                value={form.totalFees}
                onChange={(e) => setForm((prev) => ({ ...prev, totalFees: Number(e.target.value) || 0 }))}
                disabled={!selectedRegistrationId}
              />
            </div>
            <div className="space-y-2">
              <Label>Paid Amount</Label>
              <Input
                type="number"
                value={form.paidAmount}
                onChange={(e) => setForm((prev) => ({ ...prev, paidAmount: Number(e.target.value) || 0 }))}
                disabled={!selectedRegistrationId}
              />
            </div>
            <div className="space-y-2">
              <Label>Balance</Label>
              <Input
                type="number"
                value={form.balance}
                onChange={(e) => setForm((prev) => ({ ...prev, balance: Number(e.target.value) || 0 }))}
                disabled={!selectedRegistrationId}
              />
            </div>
          </div>

          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-semibold">Discounts & Exemptions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select1
                  value={form.discountType}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      discountType: value as "none" | "percentage" | "amount",
                    }))
                  }
                  disabled={!selectedRegistrationId}
                >
                  <SelectTrigger>
                    <SelectValue1 />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discount</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select1>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm((prev) => ({ ...prev, discountValue: Number(e.target.value) || 0 }))}
                  disabled={!selectedRegistrationId || form.discountType === "none"}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fullExemption"
                checked={form.fullExemption}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, fullExemption: Boolean(checked) }))}
                disabled={!selectedRegistrationId}
              />
              <Label htmlFor="fullExemption">Full Exemption (whole period)</Label>
            </div>
            <div className="space-y-2">
              <Label>Specific Exemption Months</Label>
              <Input
                placeholder="Jan, Feb, Mar"
                value={form.exemptedMonthsText}
                onChange={(e) => setForm((prev) => ({ ...prev, exemptedMonthsText: e.target.value }))}
                disabled={!selectedRegistrationId}
              />
            </div>
          </div>

          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-semibold">Competition</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="competitionWinner"
                checked={form.competitionWinner}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, competitionWinner: Boolean(checked) }))}
                disabled={!selectedRegistrationId}
              />
              <Label htmlFor="competitionWinner">Competition Winner (free school fees)</Label>
            </div>
            <div className="space-y-2">
              <Label>Competition Notes</Label>
              <Input
                placeholder="Year-end competition 2026"
                value={form.competitionTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, competitionTitle: e.target.value }))}
                disabled={!selectedRegistrationId}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Registration Notes</Label>
            <textarea
              value={form.registrationNotes}
              onChange={(e) => setForm((prev) => ({ ...prev, registrationNotes: e.target.value }))}
              className="w-full min-h-[90px] rounded-md border border-input px-3 py-2 text-sm"
              placeholder="Add internal notes about registration, exemption decisions, or discount approvals"
              disabled={!selectedRegistrationId}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCalculate} disabled={!selectedRegistrationId}>
              Calculate Fees
            </Button>
            <Button onClick={handleSave} disabled={!selectedRegistrationId || isSaving}>
              {isSaving ? "Saving..." : "Save Registration Settings"}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  )
}
