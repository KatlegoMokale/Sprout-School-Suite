"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Package2, PanelLeft, Archive, Users, Landmark, Clipboard, User, Search, LogOut } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Me = { fullName: string; email: string; role: string; profileImage?: string };

const HeaderNav = () => {
  const [me, setMe] = useState<Me | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setMe(data.user);
        }
      })
      .catch(() => undefined);
  }, []);

  const initials = useMemo(() => {
    if (!me?.fullName) return "U";
    const parts = me.fullName.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [me?.fullName]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-white">
          <nav className="grid gap-1 text-lg font-medium">
            <Link href="#" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Sprouts School Suite</span>
            </Link>
            <Link href="/" className="flex items-center gap-4 px-2.5 hover:bg-slate-200 py-2 rounded-md"><Home className="h-5 w-5" />Home</Link>
            <Link href="/school-fees" className="flex items-center gap-4 px-2.5 hover:bg-slate-200 py-2 rounded-md"><Archive className="h-5 w-5" />School Fees</Link>
            <Link href="/students" className="flex items-center gap-4 px-2.5 hover:bg-slate-200 py-2 rounded-md"><Users className="h-5 w-5" />Students</Link>
            <Link href="/finances" className="flex items-center gap-4 px-2.5 hover:bg-slate-200 py-2 rounded-md"><Landmark className="h-5 w-5" />Finances</Link>
            <Link href="/manage-school" className="flex items-center gap-4 px-2.5 hover:bg-slate-200 py-2 rounded-md"><Clipboard className="h-5 w-5" />Manage School</Link>
            <Link href="/settings" className="flex items-center gap-4 px-2.5 hover:bg-slate-200 py-2 rounded-md"><User className="h-5 w-5" />Settings</Link>
          </nav>
        </SheetContent>
      </Sheet>

      <h1 className="text-green-700 font-bold text-2xl">Sprout School Suite</h1>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="w-full rounded-lg pl-8 md:w-[240px] lg:w-[336px]" />
      </div>

      {me && (
        <div className="hidden md:flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-emerald-200">
            <AvatarImage src={me.profileImage || ""} alt={me.fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{me.fullName} ({me.role})</span>
        </div>
      )}
      <Button variant="ghost" size="icon" onClick={logout}>
        <LogOut className="h-5 w-5" />
      </Button>
    </header>
  );
};

export default HeaderNav;
