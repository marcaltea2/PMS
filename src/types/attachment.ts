export type AttachmentUploader = {
  id: string;
  name: string | null;
  image: string | null;
};

export type Attachment = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: Date;
  uploadedById: string;
  projectId: string | null;
  taskId: string | null;
  uploadedBy: AttachmentUploader;
};