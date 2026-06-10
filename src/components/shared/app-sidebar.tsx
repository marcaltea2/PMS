"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type Session } from "next-auth";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { CreateWorkspaceButton } from "~/components/workspace/creat-workspace-button";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Users,
  Settings,
  ChevronsUpDown,
  LogOut,
  Bell,
  CreditCard,
  UserCircle,
  Sparkles,
  Plus,
  MessageSquare,
  Check,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import type { WorkspaceListItem } from "~/types"

export function AppSidebar({ session }: { session: Session }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: workspaces, isLoading } = api.workspace.getAll.useQuery();

  //  Derive from URL — no useState, no useEffect
  const workspaceSlug = pathname.split("/")[1] ?? "";

  const selectedWorkspace =
    workspaces?.find((w) => w.slug === workspaceSlug) ??
    workspaces?.[0] ??
    null;
  const slug = selectedWorkspace?.slug ?? "";

  //  Navigation items
  const main = [
    { label: "Dashboard", href: `/${slug}`, icon: LayoutDashboard },
    { label: "Projects", href: `/${slug}/projects`, icon: FolderKanban },
    { label: "Tasks", href: `/${slug}/tasks`, icon: CheckSquare },
    { label: "Calendar", href: `/${slug}/calendar`, icon: Calendar },
  ];

  const teams = [
    { label: "Members", href: `/${slug}/members`, icon: Users },
    { label: "Message", href: `/${slug}/messages`, icon: MessageSquare },
  ];

  const settings = [
    { label: "Settings", href: `/${slug}/settings`, icon: Settings },
  ];

  // Workspace switch handler
  const handleSelectWorkspace = (workspace: WorkspaceListItem) => {
    if (!workspace.slug) return;
    const newPath = pathname.replace(`/${workspaceSlug}`, `/${workspace.slug}`);
    router.push(newPath);
  };

  return (
    <Sidebar>
      {/* Header — Workspace Switcher */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={selectedWorkspace?.logoUrl ?? ""} />
                    <AvatarFallback className="rounded-lg text-xs">
                      {selectedWorkspace?.name.slice(0, 2).toUpperCase() ??
                        "WS"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">
                      {selectedWorkspace?.name ?? "Select Workspace"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {workspaces
                        ? `${workspaces.length} Workspaces`
                        : "0 Workspaces"}
                    </span>
                  </div>
                  <ChevronsUpDown className="text-muted-foreground ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="start"
                side="right"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Workspaces
                </DropdownMenuLabel>
                {isLoading ? (
                  <DropdownMenuItem disabled>
                    <span className="text-muted-foreground text-xs">
                      Loading...
                    </span>
                  </DropdownMenuItem>
                ) : (
                  workspaces?.map((workspace) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      onClick={() => handleSelectWorkspace(workspace)}
                      className={
                        selectedWorkspace?.id === workspace.id
                          ? "bg-accent"
                          : ""
                      }
                    >
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={workspace.logoUrl ?? ""}
                          alt={workspace.name}
                        />
                        <AvatarFallback className="rounded-md text-xs">
                          {workspace.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {workspace.name}
                      {selectedWorkspace?.id === workspace.id && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <CreateWorkspaceButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="mb-3" />
        <div>
          <Button className="w-full" size="lg">
            <Plus className="h-3 w-3" />
            Create Task
          </Button>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Main Nav */}
        <SidebarGroup>
          <SidebarGroupLabel>MAIN</SidebarGroupLabel>
          <SidebarMenu>
            {main.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <Separator className="mt-3" />
        {/* Team Nav */}
        <SidebarGroup>
          <SidebarGroupLabel>TEAM</SidebarGroupLabel>
          <SidebarMenu>
            {teams.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <Separator className="mt-3" />
        {/* Setting Nav */}
        <SidebarGroup>
          <SidebarGroupLabel>SETTINGS</SidebarGroupLabel>
          <SidebarMenu>
            {settings.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — User */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={session.user.image ?? ""} />
                    <AvatarFallback className="rounded-lg text-xs">
                      {session.user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="text-sm font-medium">
                      {session.user.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {session.user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="text-muted-foreground ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                side="right"
                sideOffset={4}
              >
                {/* User info header */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={session.user.image ?? ""} />
                      <AvatarFallback className="rounded-lg text-xs">
                        {session.user.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">
                        {session.user.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
