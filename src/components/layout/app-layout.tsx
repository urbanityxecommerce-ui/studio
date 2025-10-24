"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart,
  Calendar,
  Film,
  HelpCircle,
  Image,
  LayoutDashboard,
  Lightbulb,
  Repeat,
  Search,
  Settings,
  Users,
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

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/content-ideas", label: "Content Ideas", icon: Lightbulb },
  { href: "/keyword-research", label: "Keyword Research", icon: Search },
  { href: "/competitor-analysis", label: "Competitor Analysis", icon: Users },
  { href: "/thumbnail-optimizer", label: "Thumbnail Optimizer", icon: Image },
  { href: "/rank-tracker", label: "Rank Tracker", icon: BarChart },
  { href: "/reel-seo", label: "Reel SEO", icon: Film },
  { href: "/repurposing", label: "Repurposing", icon: Repeat },
  { href: "/planner", label: "Planner", icon: Calendar },
];

const bottomNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };
  // For demo, we are on the root, but we want to show content-ideas as active.
  const isContentIdeasActive = pathname === "/";

  return (
    <>
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
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/content-ideas"
                        ? isContentIdeasActive
                        : isActive(item.href)
                    }
                    tooltip={{ children: item.label }}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarContent className="p-2">
           <SidebarMenu>
            {bottomNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{ children: item.label }}>
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton tooltip={{children: "User Profile"}} asChild>
                    <Link href="/profile">
                        <Avatar className="size-full p-1.5">
                            <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span>User Profile</span>
                    </Link>
                </SidebarMenuButton>
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
    </>
  );
}
