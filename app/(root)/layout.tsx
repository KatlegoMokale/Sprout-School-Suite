import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import MainNav from '@/components/MainNav'
import HeaderNav from '@/components/page-header'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { ReduxProvider } from './StoreProvider'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{
      elements: {
        footer: "hidden",
      },
    }}>
      <main className="flex min-h-screen w-full flex-col">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
          <MainNav/>
         <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
           <HeaderNav/>
          <ReduxProvider>
          {children}
          </ReduxProvider>
          </div>
          </SignedIn>
      </main>
    </ClerkProvider>
  )
}