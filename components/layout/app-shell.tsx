"use client";

import MainNav from "@/components/MainNav";
import HeaderNav from "@/components/page-header";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <MainNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 lg:pl-72">
        <HeaderNav />
        {children}
      </div>
    </>
  );
}
