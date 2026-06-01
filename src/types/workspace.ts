import type { WorkspaceRole } from "@prisma/client";

export type WorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  joinedAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
  } | null;
};

export type Workspace = {
  id: string;
  name: string;
  logoUrl: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  members: WorkspaceMember[];
};