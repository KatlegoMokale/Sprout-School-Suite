import MainNav from "@/components/MainNav";
import HeaderNav from "@/components/page-header";
import MobileNav from "@/components/ui/MobileNav";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/lib/actions/user.actions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const loggedIn = await getLoggedInUser();


  if (loggedIn) {
    redirect("/sign-in");
  }

  return (
    <main className="flex min-h-screen w-full flex-col">
        <MainNav user={loggedIn}/>
        
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <HeaderNav/>
          {children}
        </div>
        
    </main>
  );
}