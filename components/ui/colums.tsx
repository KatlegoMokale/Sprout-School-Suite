"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export type StudentFees = {
  id: string
  studentId: string
  studentName: string
  class: string
  lastPaidDate: string
  amount: number
  balance: number
  contact: string
}

export const columnsFees: ColumnDef<StudentFees>[] = [
    {
    accessorKey: "studentId",
    header: "Student ID",
    },
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "lastPaidDate",
    header: "Last Paid Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "balance",
    header: "Balance",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
]

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
