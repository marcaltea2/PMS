export type CommentAuthor = {
  id: string;
  name: string | null;
  image: string | null;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  projectId: string | null;
  taskId: string | null;
  author: CommentAuthor;
};