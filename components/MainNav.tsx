'use client'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Home, Package2, PanelLeft, ShoppingCart, Archive, Users, Landmark, Clipboard, User, Settings} from 'lucide-react'
import * as LucideIcons from 'lucide-react';


const MainNav = () => {
    const pathname = usePathname();
    return (
        <section className=''>
          <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
            <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
    
              <Link href='#' className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold 
              text-primary-foreground md:h-8 md:text-base'>
    
                <Package2 className='h-4 w-4 transition-all group-hover:scale-110' />
                <span className='sr-only'>Acme Inc</span>
                </Link>

                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                  const IconComponent = item.icon;
                  return (
                    <TooltipProvider key={item.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                      <Link href={item.route} className='flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground 
                      transition-colors hover:text-foreground md:h-8 md:w-8 '>
                     <IconComponent 
                        className={cn('h-5 w-5', isActive ? 'text-foreground' : 'text-foreground/60')} />
                      <span className='sr-only'>{item.label}</span>
                    </Link>
                    </TooltipTrigger>
                    <TooltipContent side='right'>{item.label}</TooltipContent>
                    </Tooltip>
                    </TooltipProvider>
                  )
                })}
            </nav>
    
            <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <Link href='/settings-page' className='flex h-9 w-9 items-center justify-center rounded-lg 
                foreground transition-colors hover:text-foreground md:h-8 md:w-8 '>
                <Settings className='h-5 w-5' />
                <span className='sr-only'>Settings</span>
              </Link>
              </TooltipTrigger>
              <TooltipContent side='right'>Settings</TooltipContent>
              </Tooltip>
              </TooltipProvider>  
              </nav>
    
          </aside>
        </section>
      )
    }

export default MainNav
