import { HydrateClient } from "~/trpc/server";
import { ProjectList } from "./_components/project-list";
import { CreateProjectButton } from "./_components/create-project-button";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { redirect } from "next/navigation";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const session = await auth();

  if (!session) redirect("/login");

  const workspace = await db.workspace.findFirst({
    where: { slug: workspaceSlug },
  });

  if (!workspace) redirect("/");
  return (
    <HydrateClient>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="text-muted-foreground text-sm">
              Manage and track all your projects
            </p>
          </div>
          <CreateProjectButton workspaceId={workspace.id} />
        </div>

        {/* Project List */}
        <ProjectList workspaceId={workspace.id} />
      </div>
    </HydrateClient>
  );
}
