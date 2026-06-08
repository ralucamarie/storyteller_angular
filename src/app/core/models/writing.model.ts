import { User } from './user.model';
import { WritingLayout } from './writing-layout.model';

export interface IWriting {
  id: number | null;
  created: Date | null;
  author: User | null;
  author_name: string | null;
  text: string | null;
  layout?: WritingLayout | null;
  imageUrl?: string | null;
  image_url?: string | null;
  imageUpdated?: string | null;
  image_updated?: string | null;
}

export class Writing {
  id: number | null = null;
  created: Date | null = null;
  author: User | null = null;
  author_name: string | null = null;
  text: string | null = null;
  layout: WritingLayout | null = null;
  imageUrl: string | null = null;
  imageUpdated: string | null = null;
}
