import { ProjectDetailsLayout } from "./_components/ProjectDetailsLayout";

type Props = {
  params: Promise<{
    workspaceSlug: string;
    projectSlug: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const { workspaceSlug, projectSlug } = await params;
  return <ProjectDetailsLayout workspaceSlug={workspaceSlug} projectSlug={projectSlug} />;
}