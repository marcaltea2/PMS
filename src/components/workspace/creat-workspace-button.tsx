"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { CreateWorkSpace } from "~/components/workspace/create-workspace-dialog";

export function CreateWorkspaceButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault(); 
          setOpen(true);
        }}
        onSelect={(e) => e.preventDefault()}
      >
        <div className="bg-background flex h-6 w-6 items-center justify-center rounded-md border">
          <Plus className="h-3 w-3" />
        </div>
        Add Workspace
      </DropdownMenuItem>
      <CreateWorkSpace open={open} onOpenChange={setOpen} />
    </>
  );
}