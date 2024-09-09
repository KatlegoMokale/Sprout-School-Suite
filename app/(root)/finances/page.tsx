import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableBody, TableCell, TableHead, TableHeader, TableRow,Table } from '@/components/ui/table'
import { Badge, Car } from 'lucide-react'
import React from 'react'

const Finances = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      Finances Page
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                R45,231.89
              </div>
              <p>
                  +20.1% from last month  
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                R45,231.89
              </div>
              <p>
                  +20.1% from last month  
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                R45,231.89
              </div>
              <p>
                  +20.1% from last month  
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Outstanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                R45,231.89
              </div>
              <p>
                  +20.1% from last month  
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader>
            <div className="grid gap-2">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Recent transactions from your</CardDescription>
            </div>
            </CardHeader> 
            <CardContent>
            <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">
                            Student
                            </TableHead>
                          <TableHead className="">
                            Type
                          </TableHead>
                          <TableHead className="">
                            Date
                          </TableHead>
                          <TableHead className="">
                            Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                             <div className="">Thando Mokoena</div>
                          </TableCell>
                          <TableCell>
                            EFT
                          </TableCell>
                          <TableCell>
                          2023-06-24
                          </TableCell>
                          <TableCell>
                            R1,250.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                             <div className="">Boitumelo Modise</div>
                          </TableCell>
                          <TableCell>
                            Card
                          </TableCell>
                          <TableCell>
                          2023-06-29
                          </TableCell>
                          <TableCell>
                            R1,200.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                             <div className="">Boitumelo Modise</div>
                          </TableCell>
                          <TableCell>
                            Card
                          </TableCell>
                          <TableCell>
                          2023-06-29
                          </TableCell>
                          <TableCell>
                            R1,200.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                             <div className="">Boitumelo Modise</div>
                          </TableCell>
                          <TableCell>
                            Card
                          </TableCell>
                          <TableCell>
                          2023-06-29
                          </TableCell>
                          <TableCell>
                            R1,200.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                             <div className="">Boitumelo Modise</div>
                          </TableCell>
                          <TableCell>
                            Card
                          </TableCell>
                          <TableCell>
                          2023-06-29
                          </TableCell>
                          <TableCell>
                            R1,200.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                             <div className="">Boitumelo Modise</div>
                          </TableCell>
                          <TableCell>
                            Card
                          </TableCell>
                          <TableCell>
                          2023-06-29
                          </TableCell>
                          <TableCell>
                            R1,200.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                             <div className="">Boitumelo Modise</div>
                          </TableCell>
                          <TableCell>
                            Card
                          </TableCell>
                          <TableCell>
                          2023-06-29
                          </TableCell>
                          <TableCell>
                            R1,200.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                             <div className="">Boitumelo Modise</div>
                          </TableCell>
                          <TableCell>
                            Card
                          </TableCell>
                          <TableCell>
                          2023-06-29
                          </TableCell>
                          <TableCell>
                            R1,200.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                             <div className="">Boitumelo Modise</div>
                          </TableCell>
                          <TableCell>
                            Card
                          </TableCell>
                          <TableCell>
                          2023-06-29
                          </TableCell>
                          <TableCell>
                            R1,200.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                             <div className="">Boitumelo Modise</div>
                          </TableCell>
                          <TableCell>
                            Card
                          </TableCell>
                          <TableCell>
                          2023-06-29
                          </TableCell>
                          <TableCell>
                            R1,200.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                             <div className="">Boitumelo Modise</div>
                          </TableCell>
                          <TableCell>
                            Card
                          </TableCell>
                          <TableCell>
                          2023-06-29
                          </TableCell>
                          <TableCell>
                            R1,200.00
                          </TableCell>
                        </TableRow>
                      
                      </TableBody>
            </Table>
            </CardContent>
            
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Finances
