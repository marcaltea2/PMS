// src/types/project.ts
import type { ProjectStatus, ProjectRole, Priority } from "@prisma/client";

export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
  } | null;
};

export type Member = {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
};

export type ExistingAttachment = {
  id: string;
  filename: string;
  url: string;
  storageKey: string | null;
  mimeType: string;
  size: number;
};


export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  dueDate: Date | null;
  coverColor: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  workspaceId: string;
  members: ProjectMember[];
  attachments: {
    id: string;
    filename: string;
    url: string;
    storageKey: string | null;
    mimeType: string;
    size: number;
  }[];
};
