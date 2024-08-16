import AttendanceCard from '@/components/ui/AttendanceCard';
import BottomCard from '@/components/ui/BottomCard';
import FeesTableOverview from '@/components/ui/FeesTableOverview';
import HeaderBox from '@/components/ui/HeaderBox'
import HomeCard from '@/components/ui/HomeCard';
import RightSideBar from '@/components/ui/RightSideBar';
import StudentTable from '@/components/ui/StudentTable';
import TableFeesHome from '@/components/ui/TableFeesHome';
import TotalBalanceBox from '@/components/ui/TotalBalanceBox';
import React from 'react'

const Home = () => {

  return (
  <div className=''>
   <div>
      Overview
   </div>
   <div>
    {/* <StudentTable/> */}
    <FeesTableOverview/>
   </div>



  </div>

  )
}

export default Home
