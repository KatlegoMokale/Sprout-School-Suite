import { logoutAccount } from '@/lib/actions/user.actions'
import { SignOutButton } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { use } from 'react'

const Footer = () => {
    // const Footer = ({user, type ='desktop'}: FooterProps) => {
    const router = useRouter();
    const handleLogOut = async () => {
       const loggedOut = await logoutAccount();

       if(loggedOut){ router.push('/sign-in')

       }
    }
  return (
    <footer className='footer justify-center items-center'>
        {/* <div className={type==='mobile' ? 'footer_name-mobile' : 'footer_name'}>
            <p className=' text-xl font-bold text-gray-700'>
                {user?.firstName[0]}
            </p>
        </div>
        <div className={type==='mobile' ? 'footer_email-mobile' : 'footer_email'}>
           <h1 className='text-14 truncate font-semibold text-gray-700'>
           {user?.surname}
           </h1>
           <h1 className='text-14 truncate font-normal text-gray-600'>
                {user?.email}
           </h1>
        </div> */}
        <div className=' bg-white flex justify-center w-full items-center' onClick={handleLogOut}>
            <SignOutButton>
                <LogOut className='h-6 w-6 text-gray-700' />
            </SignOutButton>
        </div>
    </footer>
  )
}

export default Footer
