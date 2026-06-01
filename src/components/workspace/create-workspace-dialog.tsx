"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { useFileUpload } from "~/hooks/use-file-upload";
import { toast } from "sonner";
import { toSlug } from "~/lib/to-slug";
import { IMAGE_TYPES, IMAGE_ACCEPT } from "~/lib/constants/file-types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateWorkSpace({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);

  const { file, preview, inputRef, handleFileChange, handleRemove, reset } =
    useFileUpload({
      maxSize: 2 * 1024 * 1024,
      allowedTypes: IMAGE_TYPES,
    });

  const utils = api.useUtils();
  const uploadFile = api.attachments.upload.useMutation();
  const createWorkspace = api.workspace.create.useMutation({
    onSuccess: () => handleClose(),
  });

  const isLoading = uploading || createWorkspace.isPending;

  const handleClose = () => {
    reset();
    setName("");
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      setUploading(true);

      let logoUrl = "";
      let logoKey = "";

      // 1. upload file if selected
      if (file) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve((reader.result as string).split(",")[1]!);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const result = await uploadFile.mutateAsync({
          filename: file.name,
          fileData: base64,
          mimeType: file.type,
          folder: "logos",
        });

        logoUrl = result.url;
        logoKey = result.storageKey ?? "";
      }

      // 2. create workspace with the uploaded url
      await createWorkspace.mutateAsync({
        name,
        logoUrl,
        logoKey,
        slug: toSlug(name),
      });

      // 3. refresh workspace list and close dialog
      await utils.workspace.invalidate();
      handleClose();
      
    } catch (err) {
      console.error("Failed", err);
      toast.error("Failed to create workspace.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Add a new workspace for your team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => !isLoading && inputRef.current?.click()}
                className={cn(
                  "hover:bg-muted relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors",
                  preview ? "border-transparent" : "border-muted-foreground/30",
                )}
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="Workspace logo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImagePlus className="text-muted-foreground h-6 w-6" />
                )}
              </button>

              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => inputRef.current?.click()}
                >
                  {preview ? "Change logo" : "Upload logo"}
                </Button>
                {preview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={handleRemove}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Remove
                  </Button>
                )}
                <p className="text-muted-foreground text-xs">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              placeholder="Workspace name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {name && (
              <p className="text-muted-foreground text-xs">
                URL: /workspace/
                <span className="text-foreground">{toSlug(name)}</span>
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!name.trim() || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
