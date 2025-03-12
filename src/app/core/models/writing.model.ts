import { User } from './user.model';

export interface IWriting {
  id: number | null;
  created: Date | null;
  author: User | null;
  authorName: string | null;
  text: string | null;
}

export class Writing {
  id: number | null = null;
  created: Date | null = null;
  author: User | null = null;
  authorName: string | null = null;
  text: string | null = null;
}
