import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    workspaceSlug: string;
    projectSlug: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const { workspaceSlug, projectSlug } = await params;
  const session = await auth();

  if (!session) redirect("/login");

  const workspace = await db.workspace.findUnique({
    where: { slug: workspaceSlug },
  });

  if (!workspace) redirect("/");

const project = await db.project.findFirst({
  where: {
    slug: projectSlug,
    workspaceId: workspace.id,
  },
  include: {
    members: {
      include: {
        user: true,
      },
    },
  },
});
  if (!project) redirect("/");

  return <div>
    <ul>
        <li>Project Name: {project.name}</li>
        <li>Project Description: {project.description}</li>
        <li>Project Status: {project.status}</li>
        <li>Project Priority: {project.priority}</li>
        <li>Project Due Date: {project.dueDate?.toLocaleDateString()}</li>
        <li>Project Members: {project.members.map(member => member.user.name).join(", ")}</li>
    </ul>
  </div>;
}
