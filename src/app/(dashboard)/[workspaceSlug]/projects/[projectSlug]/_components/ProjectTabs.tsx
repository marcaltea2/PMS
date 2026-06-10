"use client";

import { Info, Paperclip, Users, CheckSquare } from "lucide-react";
import { cn } from "~/lib/utils";
import type { TabId } from "./ProjectDetailsLayout";

type Tab = {
  id: TabId;
  label: string;
  icon: React.ReactNode;
};

const TABS: Tab[] = [
  { id: "details",     label: "Details",        icon: <Info size={14} /> },
  { id: "attachments", label: "Attachments",    icon: <Paperclip size={14} /> },
  { id: "members",     label: "Members",        icon: <Users size={14} /> },
  { id: "tasks",       label: "Tasks",          icon: <CheckSquare size={14} /> },
];

type ProjectTabsProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

export function ProjectTabs({ activeTab, onTabChange }: ProjectTabsProps) {
  return (
    <div className="flex gap-0 px-6 border-b border-border bg-background">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-xs font-medium relative transition-colors whitespace-nowrap",
            activeTab === tab.id
              ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-foreground after:rounded-t"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}