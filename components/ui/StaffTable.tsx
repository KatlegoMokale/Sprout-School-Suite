"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { IStuff, positionColors } from "@/lib/utils"

interface StaffTableProps {
  staff: IStuff[]
  onDelete: (id: string) => void
}

export default function StaffTable({ staff, onDelete }: StaffTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Position</TableHead>
            <TableHead className="font-semibold">Contact</TableHead>
            <TableHead className="font-semibold">Address</TableHead>
            <TableHead className="w-[100px] font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.$id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">
                      {member.firstName[0]}{member.surname[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{member.firstName} {member.surname}</div>
                    <div className="text-sm text-gray-500">{member.position}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  positionColors[member.position.toLowerCase() as keyof typeof positionColors] || 'bg-gray-100 text-gray-800'
                }`}>
                  {member.position}
                </span>
              </TableCell>
              <TableCell>{member.contact}</TableCell>
              <TableCell className="max-w-[200px] truncate">{member.address1}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/manage-school/stuff/${member.$id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(member.$id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 