// src/lib/utils/file-icon.tsx
import {
  File,
  FileText,
  FileSpreadsheet,
  ImageIcon,
} from "lucide-react";

export function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? "")) {
    return <ImageIcon className="h-4 w-4 text-blue-500" />;
  }

  if (ext === "pdf") {
    return <FileText className="h-4 w-4 text-red-500" />;
  }

  if (["doc", "docx"].includes(ext ?? "")) {
    return <FileText className="h-4 w-4 text-blue-600" />;
  }

  if (["xls", "xlsx", "csv"].includes(ext ?? "")) {
    return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
  }

  return <File className="h-4 w-4 text-gray-500" />;
}