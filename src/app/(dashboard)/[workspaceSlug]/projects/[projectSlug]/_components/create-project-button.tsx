"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CreateProjectDialog } from "./create-project-dialog";

type Props = {
  workspaceId: string;
};

export function CreateProjectButton({ workspaceId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="lg">
        <Plus className="h-4 w-4" />
        New Project
      </Button>
      <CreateProjectDialog 
        open={open} 
        onOpenChange={setOpen}
        workspaceId={workspaceId}
      />
    </>
  );
}