import type { RouterOutputs } from "~/trpc/react";

export type WorkspaceListItem = RouterOutputs["workspace"]["getAll"][number];
export type WorkspaceById = NonNullable<RouterOutputs["workspace"]["getById"]>;
export type WorkspaceMember = RouterOutputs["workspace"]["getMembers"][number];

