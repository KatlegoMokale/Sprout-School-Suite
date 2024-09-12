import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const students = [
  {
    id: "001",
    name: "John Doe",
    class: "10A",
    lastPaidDate: "2023-05-15",
    amount: "$500",
    balance: "$0",
    contact: "123-456-7890"
  },
  {
    id: "002",
    name: "Jane Smith",
    class: "11B",
    lastPaidDate: "2023-05-10",
    amount: "$450",
    balance: "$50",
    contact: "234-567-8901"
  },
  {
    id: "003",
    name: "Bob Johnson",
    class: "9C",
    lastPaidDate: "2023-05-20",
    amount: "$550",
    balance: "$0",
    contact: "345-678-9012"
  },
  {
    id: "004",
    name: "Alice Brown",
    class: "12A",
    lastPaidDate: "2023-05-05",
    amount: "$400",
    balance: "$100",
    contact: "456-789-0123"
  }
]

export default function StudentTable() {
  return (
    <div className="p-8 bg-orange-50">
      <h2 className="text-2xl font-bold mb-4 text-orange-800">Student Payment Information</h2>
      <div className="rounded-lg overflow-hidden border border-orange-200 shadow-lg">
        <Table>
          <TableHeader className="bg-orange-500">
            <TableRow>
              <TableHead className="text-white font-semibold">Student ID</TableHead>
              <TableHead className="text-white font-semibold">Student Name</TableHead>
              <TableHead className="text-white font-semibold">Class</TableHead>
              <TableHead className="text-white font-semibold">Last Paid Date</TableHead>
              <TableHead className="text-white font-semibold">Amount</TableHead>
              <TableHead className="text-white font-semibold">Balance</TableHead>
              <TableHead className="text-white font-semibold">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={student.id} className={index % 2 === 0 ? "bg-orange-100" : "bg-white"}>
                <TableCell className="font-medium text-orange-900">{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.lastPaidDate}</TableCell>
                <TableCell>{student.amount}</TableCell>
                <TableCell className={student.balance === "$0" ? "text-green-600" : "text-red-600"}>
                  {student.balance}
                </TableCell>
                <TableCell>{student.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}