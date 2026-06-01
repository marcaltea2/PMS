import type { TaskStatus, Priority } from "@prisma/client";

export type TaskAssignee = {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  assigneeId: string | null;
  createdById: string;
  assignee: TaskAssignee | null;
};