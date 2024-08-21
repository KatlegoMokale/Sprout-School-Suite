import MainNav from "@/components/MainNav";
import HeaderNav from "@/components/page-header";
import MobileNav from "@/components/ui/MobileNav";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <MainNav/>
        <body className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <HeaderNav/>
          {children}
        </body>
        
    </main>
  );
}