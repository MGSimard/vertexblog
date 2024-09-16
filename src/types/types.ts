interface FormResponseTypes {
  success: boolean;
  message: string;
  errors?: string[];
}
export type FormStatusTypes = FormResponseTypes | null;

export type UserTypes = { username: string; id: string } | null;

// TODO: RETYPE DATE STUFF ONCE WE MOVE FROM JSON PLACEHOLDER DATA TO DB
export interface BlogInfoTypes {
  id: number;
  author: string;
  title: string;
  active: boolean;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  deletedAt: Date | string | null;
}

export interface PostInfoTypes {
  id: number;
  parentBlog: number;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string | null;
  // TODO: REMOVE DELETEDAT WE WON'T ACTUALLY RETRIEVE IT FROM DB LATER
  deletedAt: Date | string | null;
}
