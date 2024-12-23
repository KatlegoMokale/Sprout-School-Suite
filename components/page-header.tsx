import { Button } from '@/components/ui/button'
import {Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Home, Package2, PanelLeft, ShoppingCart, Archive, Users, Landmark, Clipboard, User, Settings, ArchiveIcon, Search, CircleUser} from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
// import { getLoggedInUser } from '@/lib/actions/user.actions'
import { UserButton } from '@clerk/nextjs'

const HeaderNav = async () => {
  // const loggedIn = await getLoggedInUser()

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.length > 1
      ? names[0][0].toUpperCase() + names[1][0].toUpperCase()
      : names[0][0].toUpperCase();
  };
    return (
        <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto 
            sm:border-0 sm:bg-transparent sm:px-6'>
              <Sheet>
                <SheetTrigger asChild>
                <Button size="icon" variant="outline" className='sm:hidden'>
                <PanelLeft className='h-5 w-5' />
                <span className='sr-only'>Toggle Menu</span>
              </Button>
              </SheetTrigger>
              <SheetContent side="left" className='sm:max-w-xs bg-white'>
                <nav className='grid gap-1 text-lg font-medium'>
                  <Link href='#' className='group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base'>
                <Package2 className='h-5 w-5 transition-all group-hover:scale-110' />
                <span className='sr-only'>Acme Inc</span>
                </Link>
                <Link href='/' className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground hover:bg-slate-200 py-2 rounded-md'>
                <Home className='h-5 w-5' />
                Home
                </Link>
    
                <Link href='/school-fees' className='flex items-center gap-4 px-2.5 text-foreground hover:bg-slate-200 py-2 rounded-md'>
                <Archive className='h-5 w-5' />
                School Fees
                </Link>
    
                <Link href='/students' className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground hover:bg-slate-200 py-2 rounded-md'>
                <Users className='h-5 w-5' />
                Students
                </Link>
    
                <Link href='/finances' className='flex items-center gap-4 px-2.5 text-foreground hover:bg-slate-200 py-2 rounded-md'>
                <Landmark className='h-5 w-5' />
                Finances
                </Link>
    
                <Link href='/teachers' className='flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-slate-200 py-2 rounded-md'>
                <Clipboard className='h-5 w-5' />
                Teachers
                </Link>
    
                <Link href='/user' className='flex items-center gap-4 px-2.5 text-foreground hover:bg-slate-200 py-2 rounded-md'>
                <User className='h-5 w-5' />
                Users
                </Link>
                </nav>
              </SheetContent>
              </Sheet>
              <h1 className=' text-green-700 font-bold text-2xl'>Sprout School Suite</h1>
              <div className='relative ml-auto flex-1 md:grow-0'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input type='search' placeholder='Search...' className='w-full rounded-lg pl-8 md:w-[240px] lg:w-[336px]' />
              </div>
              <UserButton showName/>
            </header>
      )
    }

export default HeaderNav
