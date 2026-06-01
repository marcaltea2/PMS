// src/hooks/use-file-upload.ts
import { useState, useRef } from "react";
import { toast } from "sonner";

type UseFileUploadOptions = {
  maxSize?: number;
  allowedTypes?: string[];
};

type UseFileUploadReturn = {
  file: File | null;
  preview: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>; 
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemove: () => void;
  reset: () => void;
};

export function useFileUpload({
  maxSize = 2 * 1024 * 1024,
  allowedTypes = ["image/jpeg", "image/png"],
}: UseFileUploadOptions = {}): UseFileUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!allowedTypes.includes(selected.type)) {
      toast.error(`Only ${allowedTypes.map((t) => t.split("/")[1]?.toUpperCase()).join(", ")} files are allowed.`);
      return;
    }

    if (selected.size > maxSize) {
      toast.error(`File size must be under ${maxSize / (1024 * 1024)}MB.`);
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return { file, preview, inputRef, handleFileChange, handleRemove, reset };
}