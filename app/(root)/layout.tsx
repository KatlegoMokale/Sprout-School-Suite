import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { ReduxProvider } from './StoreProvider'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <main className="flex min-h-screen w-full flex-col">
         <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <ReduxProvider>
          {children}
          </ReduxProvider>
          </div>
      </main>
  )
}