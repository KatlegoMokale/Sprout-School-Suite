import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge, Car, Table } from 'lucide-react'
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
                            <TableHead>
                            Customer
                            </TableHead>
                          <TableHead>
                            Type
                          </TableHead>
                          <TableHead>
                            Status
                          </TableHead>
                          <TableHead>
                            Date
                          </TableHead>
                          <TableHead>
                            Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                             <div className="">Olivia Smith</div>
                            <div className="">
                              olivia@example.com
                            </div>
                          </TableCell>
                          <TableCell>
                            Refund
                          </TableCell>
                          <TableCell>
                            Declined
                          </TableCell>
                          <TableCell>
                          2023-06-24
                          </TableCell>
                          <TableCell>
                            $1,256.00
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
