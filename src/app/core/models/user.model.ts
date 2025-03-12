export interface IUser {
  id: string | null;
  name: string | null;
  surname: string | null;
  email: string | null;
  password: string | null;
  authorName: string | null;
}

export class User implements IUser {
  email: string | null = null;
  id: string | null = null;
  name: string | null = null;
  password: string | null = null;
  surname: string | null = null;
  authorName: string | null = null;
}
