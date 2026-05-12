"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home, Archive, Users, Landmark, Clipboard, Settings, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

type NavGroup = {
  label: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcuts: Array<{ label: string; route: string }>;
};

const navGroups: NavGroup[] = [
  {
    label: "Home",
    route: "/",
    icon: Home,
    shortcuts: [
      { label: "Dashboard", route: "/" },
      { label: "Profile", route: "/profile" },
      { label: "Settings", route: "/settings" },
    ],
  },
  {
    label: "School Fees",
    route: "/school-fees",
    icon: Archive,
    shortcuts: [
      { label: "Overview", route: "/school-fees" },
      { label: "Fees Table", route: "/school-fees/view" },
    ],
  },
  {
    label: "Students",
    route: "/students",
    icon: Users,
    shortcuts: [
      { label: "All Students", route: "/students" },
      { label: "Add Student", route: "/students/add-student" },
      { label: "Registration", route: "/students/registration" },
    ],
  },
  {
    label: "Finances",
    route: "/finances",
    icon: Landmark,
    shortcuts: [
      { label: "Finance Dashboard", route: "/finances" },
      { label: "School Fees", route: "/school-fees" },
    ],
  },
  {
    label: "Manage School",
    route: "/manage-school",
    icon: Clipboard,
    shortcuts: [
      { label: "Overview", route: "/manage-school" },
      { label: "Add Staff", route: "/manage-school/add-stuff" },
    ],
  },
];

const MainNav = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Home: true,
    "School Fees": true,
    Students: true,
    Finances: false,
    "Manage School": true,
  });

  const activeRoot = useMemo(
    () => navGroups.find((group) => pathname === group.route || pathname.startsWith(`${group.route}/`))?.label,
    [pathname]
  );

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <section>
      <aside className={cn("fixed inset-y-0 left-0 z-20 hidden flex-col border-r bg-background transition-all duration-200 sm:flex", isExpanded ? "w-72 shadow-2xl rounded-r-3xl" : "w-14")}>
        <div className="flex items-center justify-between px-2 py-4">
          <Link href="/" className="group flex h-10 items-center gap-2 rounded-full px-1">
            <Image src="/assets/logoSSS.png" width={32} height={32} alt="SSS Logo" />
            {isExpanded && <span className="text-sm font-semibold">Sprouts Suite</span>}
          </Link>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="rounded-md p-1 hover:bg-accent"
            aria-label="Toggle sidebar"
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {navGroups.map((group) => {
            const Icon = group.icon;
            const isActive = pathname === group.route || pathname.startsWith(`${group.route}/`);
            const isOpen = openGroups[group.label] ?? false;

            if (!isExpanded) {
              return (
                <TooltipProvider key={group.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={group.route} className={cn("mb-2 flex h-10 w-10 items-center justify-center rounded-lg transition-colors", isActive ? "bg-green-200 text-foreground" : "hover:bg-green-100 text-foreground/80")}>
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{group.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{group.label}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            return (
              <div key={group.label} className="mb-2 rounded-lg border border-transparent">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors", isActive ? "bg-green-100" : "hover:bg-accent")}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4" />
                    {group.label}
                  </span>
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {isOpen && (
                  <div className="mt-1 space-y-1 pl-9 pr-2 pb-1">
                    {group.shortcuts.map((shortcut) => {
                      const isShortcutActive = pathname === shortcut.route || pathname.startsWith(`${shortcut.route}/`);
                      return (
                        <Link
                          key={shortcut.route}
                          href={shortcut.route}
                          className={cn("block rounded-md px-2 py-1.5 text-xs transition-colors", isShortcutActive ? "bg-green-200 font-medium" : "text-muted-foreground hover:bg-green-50 hover:text-foreground")}
                        >
                          {shortcut.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* <nav className="border-t px-2 py-3">
          {isExpanded ? (
            <Link href="/settings" className={cn("flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent", activeRoot === "Settings" ? "bg-green-100" : "") }>
              <span className="flex items-center gap-2"><Settings className="h-4 w-4" />Settings</span>
            </Link>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/settings" className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </nav> */}
      </aside>
    </section>
  );
};

export default MainNav;
