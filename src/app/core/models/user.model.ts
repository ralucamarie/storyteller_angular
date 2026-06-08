export interface IUser {
  id: number | null;
  name: string | null;
  surname: string | null;
  email: string | null;
  author_name: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  avatarUpdated?: string | null;
  avatar_updated?: string | null;
}

export class User implements IUser {
  id: number | null = null;
  email: string | null = null;
  name: string | null = null;
  surname: string | null = null;
  author_name: string | null = null;
  avatarUrl: string | null = null;
  avatar_url: string | null = null;
  avatarUpdated: string | null = null;
  avatar_updated: string | null = null;
}
