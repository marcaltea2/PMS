// src/app/(dashboard)/page.tsx
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function RootPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const member = await db.workspaceMember.findFirst({
    where: { userId: session.user.id },
    include: { workspace: true },
    orderBy: { joinedAt: "asc" },
  });

  if (!member) redirect("/onboarding"); // no workspace yet

  redirect(`/${member.workspace.slug}`);
}