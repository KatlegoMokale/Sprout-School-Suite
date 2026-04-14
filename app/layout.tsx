import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
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
import { ReduxProvider } from './(root)/StoreProvider'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
})

export const metadata: Metadata = {
  title: "Sprouts School Suite",
  description: "Daycare Dashboard is a modern school management system.",
  icons : {
    icon: '/assets/logoSSS.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      elements: {
        footer: "hidden",
      },
    }}>
      <html lang="en">
        <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
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
        </body>
      </html>
    </ClerkProvider>
  );
}
