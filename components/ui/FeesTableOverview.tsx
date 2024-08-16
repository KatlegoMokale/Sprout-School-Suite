import { columns, columnsFees, Payment, StudentFees } from "./colums"
import { DataTable } from "./data-table"

async function getData(): Promise<StudentFees[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      studentId:"001",
      studentName: "Mohamed",
      class: "Class 1",
      lastPaidDate: "2021-01-01",
      amount: 1650,
      balance: 100,
      contact:"0728282828"
    },
    {
        id: "231ed21f",
        studentId:"002",
        studentName: "Siyabonga Nkosi",
        class: "3 Years",
        lastPaidDate: "2024-06-16",
        amount: 1200,
        balance: -1100,
        contact:"0728282828"
    },
    {
        id: "213ed12f",
        studentId:"003",
        studentName: "Siyabonga Nkosi",
        class: "Babys",
        lastPaidDate: "2024-06-25",
        amount: 1200,
        balance: -800,
        contact:"0728282828"
    },
    {
        id: "732ed11f",
        studentId:"004",
        studentName: "Kagiso Moloi",
        class: "Grade R",
        lastPaidDate: "2024-06-24",
        amount: 1250,
        balance: 0,
        contact:"0728282828"
    },
    {
        id: "324ed19f",
        studentId:"005",
        studentName: "Mpho Modise",
        class: "2 Years",
        lastPaidDate: "2024-05-25",
        amount: 1200,
        balance: -1200,
        contact:"0728282828"
    },
    {
        id: "321ed21f",
        studentId:"006",
        studentName: "Kgotso Mokoena",
        class: "2 Years",
        lastPaidDate: "2024-06-24",
        amount: 2400,
        balance: 1200,
        contact:"0728282828"
    },
    {
        id: "786ed43f",
        studentId:"007",
        studentName: "Lulama Mbatha",
        class: "Grade R",
        lastPaidDate: "2024-06-21",
        amount: 800,
        balance: -400,
        contact:"0728282828"
    },
    
  ]
}

export default async function FeesTableOverview() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columnsFees} data={data} />
    </div>
  )
}
