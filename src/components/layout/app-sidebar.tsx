"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Compass,
  Webhook,
  Key,
  Plus,
  GitBranch,
  Terminal,
  Shield,
  Layers,
  BookOpen,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Developer",
    email: "dev@gitforprompts.com",
    avatar: "/logo.svg",
  },
  teams: [
    {
      name: "Git for Prompts",
      logo: <GitBranch />,
      plan: "Pro Vault",
    },
    {
      name: "Acme Production",
      logo: <Layers />,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard />,
      isActive: true,
      items: [
        {
          title: "Prompt Bundles",
          url: "/dashboard",
        },
        {
          title: "New Bundle",
          url: "/dashboard/new",
        },
      ],
    },
    {
      title: "Explore Library",
      url: "/dashboard/explore",
      icon: <Compass />,
      items: [
        {
          title: "Community Prompts",
          url: "/dashboard/explore",
        },
      ],
    },
    {
      title: "Event Engine",
      url: "/dashboard/webhooks",
      icon: <Webhook />,
      items: [
        {
          title: "Webhooks",
          url: "/dashboard/webhooks",
        },
      ],
    },
    {
      title: "Developer Credentials",
      url: "/dashboard/api-keys",
      icon: <Key />,
      items: [
        {
          title: "REST API Keys",
          url: "/dashboard/api-keys",
        },
      ],
    },
  ],
  projects: [
    {
      name: "CLI & SDK Docs",
      url: "/#docs",
      icon: <Terminal />,
    },
    {
      name: "Security Standard",
      url: "/#security",
      icon: <Shield />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-border bg-sidebar font-sans" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
