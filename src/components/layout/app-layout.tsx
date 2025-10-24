
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart,
  Calendar,
  Film,
  HelpCircle,
  Image,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  Repeat,
  Search,
  Settings,
  Users,
  LogOut,
} from "lucide-react";

import { Logo } from "@/components/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, useUser } from "@/firebase";
import { getAuth } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import React from "react";
import ClientOnly from "../client-only";

const navItems = [
  { href: "/", label: "Content Ideas", icon: Lightbulb },
  { href: "/keyword-research", label: "Keyword Research", icon: Search },
  { href: "/competitor-analysis", label: "Competitor Analysis", icon: Users },
  { href: "/thumbnail-optimizer", label: "Thumbnail Optimizer", icon: Image },
  { href: "/rank-tracker", label: "Rank Tracker", icon: BarChart },
  { href: "/reel-seo", label: "Reel SEO", icon: Film },
  { href: "/repurposing", label: "Repurposing", icon: Repeat },
];

const bottomNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/help", label: "Help", icon: HelpCircle },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  
  React.useEffect(() => {
    // Only redirect if authentication has finished loading and there's no user.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await auth.signOut();
    // Invalidate session cookie by calling our API endpoint
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: '' }), // Sending empty token to signal logout
    });
    router.push('/login');
  };
  
  // Display a loading skeleton while the user state is being determined.
  if (isUserLoading || !user) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
         <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
      </div>
    )
  }


  const UserAvatar = () => {
    if(isUserLoading) return <Skeleton className="h-8 w-8 rounded-full" />
    return (
      <Avatar className="size-full p-1.5">
          <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/40/40`} alt="User" />
          <AvatarFallback>{user?.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <ClientOnly>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="h-16 items-center justify-center gap-2 border-b border-sidebar-border px-3 text-lg font-semibold text-sidebar-foreground">
          <Logo />
          <span className="duration-200 group-data-[collapsible=icon]:-translate-x-4 group-data-[collapsible=icon]:opacity-0">
            CreatorX SEO
          </span>
        </SidebarHeader>

        <SidebarContent className="flex-1 p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarContent className="p-2">
           <SidebarMenu>
            {bottomNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{ children: item.label }}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <SidebarMenuButton tooltip={{children: "User Profile"}} asChild={false}>
                        <UserAvatar />
                        <span>User Profile</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mb-2 w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                       <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
             </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Can add breadcrumbs or page title here */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </ClientOnly>
  );
}

    