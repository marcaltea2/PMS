"use client";

import { useState, useEffect } from "react";
import { Loader2, CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { toSlug } from "~/lib/to-slug";
import { ProjectStatus, Priority } from "@prisma/client";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import type { Project } from "~/types";
import { COLOR_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from "~/lib/project-options";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  project?: Project | null;
};

export function CreateProjectDialog({
  open,
  onOpenChange,
  workspaceId,
  project,
}: Props) {
  const isEdit = !!project;
  const utils = api.useUtils();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.ACTIVE);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [coverColor, setCoverColor] = useState<string>("#6366f1");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description ?? "");
      setStatus(project.status);
      setPriority(project.priority);
      setDueDate(project.dueDate ?? undefined);
      setCoverColor(project.coverColor ?? "#6366f1");
    }
  }, [project]);

  const createProject = api.project.create.useMutation({
    onSuccess: async () => {
      await utils.project.invalidate();
      toast.success("Project created!");
      handleClose();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateProject = api.project.update.useMutation({
    onSuccess: async () => {
      await utils.project.invalidate();
      toast.success("Project updated!");
      handleClose();
    },
    onError: (err) => toast.error(err.message),
  });

  const isPending = createProject.isPending || updateProject.isPending;

  const handleClose = () => {
    setName("");
    setDescription("");
    setStatus(ProjectStatus.ACTIVE);
    setPriority(Priority.MEDIUM);
    setDueDate(undefined);
    setCoverColor("#6366f1");
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (isEdit && project) {
      updateProject.mutate({
        id: project.id,
        name,
        slug: toSlug(name),
        description,
        status,
        priority,
        dueDate,
        coverColor,
      });
    } else {
      createProject.mutate({
        workspaceId,
        name,
        slug: toSlug(name),
        description,
        status,
        priority,
        dueDate,
        coverColor,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          borderTop: `5px solid ${coverColor ?? "#6366f1"}`,
        }}
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Project" : "New Project"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your project details."
              : "Create a new project for your workspace."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="grid items-center gap-4 md:grid-cols-[140px_1fr]">
            <Label>Name</Label>

            <div className="space-y-1">
              <Input
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* {name && (
                <p className="text-muted-foreground text-xs">
                  URL: /projects/
                  <span className="text-foreground">{toSlug(name)}</span>
                </p>
              )} */}
              
            </div>
          </div>

          {/* Description */}
          <div className="grid items-start gap-4 md:grid-cols-[140px_1fr]">
            <Label className="pt-2">
              Description{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>

            <Textarea
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Status */}
          <div className="grid items-center gap-4 md:grid-cols-[140px_1fr]">
            <Label>Status</Label>

            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ProjectStatus)}
            >
              <SelectTrigger className = "w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="grid items-center gap-4 md:grid-cols-[140px_1fr]">
            <Label>Priority</Label>

            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as Priority)}
            >
              <SelectTrigger className = "w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {PRIORITY_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="grid items-center gap-4 md:grid-cols-[140px_1fr]">
            <Label>
              Due Date{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />

                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Cover Color */}
          <div className="grid items-start gap-4 md:grid-cols-[140px_1fr]">
            <Label className="pt-1">Cover Color</Label>

            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.label}
                  onClick={() => setCoverColor(color.value)}
                  className={cn(
                    "h-7 w-7 rounded-full transition-all",
                    coverColor === color.value
                      ? "ring-offset-background scale-110 ring-2 ring-offset-2"
                      : "opacity-70 hover:opacity-100",
                  )}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button disabled={!name.trim() || isPending} onClick={handleSubmit}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
