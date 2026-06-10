"use client";

import { useState } from "react";
import { Circle, Clock, CheckCircle2, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Status = "done" | "progress" | "todo";
type Priority = "high" | "medium" | "low";
type Filter = "all" | Status;

type Task = {
  id: number;
  title: string;
  status: Status;
  priority: Priority;
  assignee: string;
  assigneeColor: string;
  due: string;
};

const TASKS: Task[] = [
  { id: 1, title: "Design system component library", status: "done",     priority: "high",   assignee: "AR", assigneeColor: "bg-violet-500", due: "Jun 10" },
  { id: 2, title: "Set up CI/CD pipeline",           status: "progress", priority: "high",   assignee: "SC", assigneeColor: "bg-amber-500",  due: "Jun 15" },
  { id: 3, title: "User authentication flow",        status: "progress", priority: "medium", assignee: "JL", assigneeColor: "bg-emerald-500",due: "Jun 20" },
  { id: 4, title: "API rate limiting",               status: "todo",     priority: "medium", assignee: "TK", assigneeColor: "bg-pink-500",   due: "Jun 28" },
  { id: 5, title: "Write onboarding docs",           status: "todo",     priority: "low",    assignee: "MS", assigneeColor: "bg-purple-500", due: "Jul 5"  },
  { id: 6, title: "Performance audit",               status: "todo",     priority: "high",   assignee: "AR", assigneeColor: "bg-violet-500", due: "Jul 12" },
];

const STATUS_ICON: Record<Status, React.ReactNode> = {
  done:     <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />,
  progress: <Clock size={15} className="text-amber-500 flex-shrink-0" />,
  todo:     <Circle size={15} className="text-muted-foreground flex-shrink-0" />,
};

const PRIORITY_COLOR: Record<Priority, string> = {
  high:   "bg-red-500",
  medium: "bg-amber-500",
  low:    "bg-emerald-500",
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "todo",     label: "Todo" },
  { id: "progress", label: "In progress" },
  { id: "done",     label: "Done" },
];

export function TasksTab() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = TASKS.filter((t) => filter === "all" || t.status === filter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs transition-colors border",
                filter === f.id
                  ? "bg-secondary text-foreground border-border"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
          <Plus size={13} /> New task
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
        {visible.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
              task.status === "done" && "opacity-50"
            )}
          >
            {STATUS_ICON[task.status]}
            <span className={cn("flex-1 text-sm", task.status === "done" && "line-through text-muted-foreground")}>
              {task.title}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_COLOR[task.priority]}`} />
            <span className="text-xs text-muted-foreground tabular-nums font-mono w-12 text-right">
              {task.due}
            </span>
            <div className={`w-6 h-6 rounded-full ${task.assigneeColor} flex items-center justify-center text-[9px] font-medium text-white flex-shrink-0`}>
              {task.assignee}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}