import CreateUser from '@/components/ui/createUser'
import Event from '@/components/ui/event'
import Grocery from '@/components/ui/grocery'
import AddNewUser from '@/components/ui/newUser'
import PettyCash from '@/components/ui/pettyCash'
import SchoolFeesSetup from '@/components/ui/SchoolFeesSetup'
import React from 'react'
import SchoolFeeManagement from '../school-fees/page'
import StudentFeesManagement from '@/components/ui/SchoolFeesManagement'
import StaffSalaryManagement from '@/components/ui/StaffSalary'
import ClassAndFeeManagement from '@/components/ui/ClassAndFeeManagement'

const Users = () => {
  return (
    // <div><AddNewUser/></div>
    // <SchoolFeesSetup/>
    // <StaffSalaryManagement/>
    // <SchoolFeesSetup/>
    // <ClassAndFeeManagement/>
    <StudentFeesManagement/>
    // <PettyCash/>
    // <Grocery/>
    // <Event/>
  )
}

export default Users