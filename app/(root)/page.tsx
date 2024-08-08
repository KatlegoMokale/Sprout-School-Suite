import HeaderBox from '@/components/ui/HeaderBox'
import RightSideBar from '@/components/ui/RightSideBar';
import TotalBalanceBox from '@/components/ui/TotalBalanceBox';
import React from 'react'

const Home = () => {

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
          type="greeting"
          title="Welcome"
          subtext="Welcome to your dashboard. Here, you can manage your account and transactions efficiently."
          />
       
       
         </header>
    
      </div>

    </section>
  )
}

export default Home
