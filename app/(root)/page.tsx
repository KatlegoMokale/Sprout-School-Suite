import FeesTableOverview from '@/components/ui/FeesTableOverview';
import AttendanceChart from '@/components/ui/attendanceChart';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CirclePlus } from 'lucide-react';
import React from 'react'

const Dashboard = () => {
  return (
    <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 '>
        <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3 '>
          <div className='grid gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 '>

            <Card className='sm:col-span-1' x-chuck="dashboard-05-chunk-0">
              <CardDescription className='pl-6 pt-4'>
                Monthly Income <span className=''>2024/08/16</span>
              </CardDescription>
              <CardHeader className="pb-3">
                <CardTitle>
                  45 580
                </CardTitle>
                <CardDescription className='max-w-lg text-balance leading-relaxed'>
                    Your orders are currently being processed.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                 <div className='text-green-500 flex-row items-center gap-1 flex'><CirclePlus size={15}/> 3500 <span className=' text-black'> today</span> </div>
              </CardFooter>
            </Card>

            <Card className='sm:col-span-1' x-chuck="dashboard-05-chunk-0">
              <CardDescription className='pl-6 pt-4'>
                Monthly Income <span className=''>2024/08/16</span>
              </CardDescription>
              <CardHeader className="pb-3">
                <CardTitle>
                  45 580
                </CardTitle>
                <CardDescription className='max-w-lg text-balance leading-relaxed'>
                    Your orders are currently being processed.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                 <div className='text-green-500 flex-row items-center gap-1 flex'><CirclePlus size={15}/> 3500 <span className=' text-black'> today</span> </div>
              </CardFooter>
            </Card>

            <Card className='sm:col-span-1' x-chuck="dashboard-05-chunk-0">
              <CardDescription className='pl-6 pt-4'>
                Monthly Income <span className=''>2024/08/16</span>
              </CardDescription>
              <CardHeader className="pb-3">
                <CardTitle>
                  45 580
                </CardTitle>
                <CardDescription className='max-w-lg text-balance leading-relaxed'>
                    Your orders are currently being processed.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                 <div className='text-green-500 flex-row items-center gap-1 flex'><CirclePlus size={15}/> 3500 <span className=' text-black'> today</span> </div>
              </CardFooter>
            </Card>

          </div>
          <div className='grid gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4  rounded-xl shadow-inner bg-slate-50'>
            <div className='sm:col-span-2 md:col-span-3 lg:col-span-3 xl:col-span-3 ' x-chuck="dashboard-05-chunk-0">
              <div className='pt-5 pl-6 grid grid-cols-2'>
                <div className=' col-span-1'>
                  <h1 className='text-lg '>Student Fees overview</h1>
                  <p className='text-sm text-gray-500'>Updated 30min ago</p>
                </div>
                

                <div className='col-span-1 flex justify-end'>
                <Tabs defaultValue="account" className="w-[400px] text-end pr-8">
                <TabsList className='bg-slate-50 rounded-lg  shadow-md'>
                  <TabsTrigger value="week" className=' bg-slate-400 rounded-lg'>All</TabsTrigger>
                  <TabsTrigger value="month">Paid</TabsTrigger>
                  <TabsTrigger value="year">Owing</TabsTrigger>
                </TabsList>
                </Tabs>
                </div>
              </div>
                <FeesTableOverview/>  
            </div>
            <div className='sm:col-span-1 rounded-lg pt-8 p-5' x-chuck="dashboard-05-chunk-0">
                <AttendanceChart/>
            </div>


            
          </div>
          
        </div>
        
      </div>
  

  )
}

export default Dashboard
