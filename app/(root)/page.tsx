import AttendanceCard from '@/components/ui/AttendanceCard';
import BottomCard from '@/components/ui/BottomCard';
import HeaderBox from '@/components/ui/HeaderBox'
import HomeCard from '@/components/ui/HomeCard';
import RightSideBar from '@/components/ui/RightSideBar';
import TableFeesHome from '@/components/ui/TableFeesHome';
import TotalBalanceBox from '@/components/ui/TotalBalanceBox';
import React from 'react'

const Home = () => {

  return (
  <div>
    <div className='flex flex-col gap-4'>
      <HomeCard title='MONEY Income' value='R100000' subtext='1200 today' date='2024/08/12' />
      <HomeCard title='MONEY Income' value='R100000' subtext='1200 today' date='2024/08/12' />
      <HomeCard title='MONEY Income' value='R100000' subtext='1200 today' date='2024/08/12' />
    </div>
    <div>
      <TableFeesHome/>
      <div>
        <AttendanceCard/>
        <BottomCard/>
      </div>

    </div>




  </div>

  )
}

export default Home
