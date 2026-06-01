export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
];

export const ALL_ATTACHMENT_TYPES = [...IMAGE_TYPES, ...DOCUMENT_TYPES];
export const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.gif,.webp";
export const DOCUMENT_ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv";
export const ALL_ATTACHMENT_ACCEPT = `${IMAGE_ACCEPT},${DOCUMENT_ACCEPT}`;