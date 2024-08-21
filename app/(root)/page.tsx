import FeesTableOverview from '@/components/ui/FeesTableOverview';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CirclePlus } from 'lucide-react';
import React from 'react'

const Dashboard = () => {
  return (
    <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
        <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
          <div className='grid gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3'>

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
          <FeesTableOverview/>
        </div>
        
      </div>
  

  )
}

export default Dashboard
