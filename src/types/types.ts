interface FormResponseTypes {
  success: boolean;
  message: string;
  errors?: string[];
}
export type FormStatusTypes = FormResponseTypes | null;

export type UserTypes = { username: string; id: string } | null;

interface BlogInfoTypes {
  blogId: number;
  blogAuthor: string;
  blogTitle: string;
  active: boolean;
  creationDate: Date;
}
export type GetBlogsResponseTypes = { success: boolean; data?: BlogInfoTypes[]; message: string };
