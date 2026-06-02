import type {
  Priority,
  ProjectRole,
  ProjectStatus,
} from "@prisma/client";

export type Member = {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
};

export type Attachment = {
  id: string;
  filename: string;
  url: string;
  storageKey: string | null;
  mimeType: string;
  size: number;
};

export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
  user: Member | null;
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
  attachments: Attachment[];
};