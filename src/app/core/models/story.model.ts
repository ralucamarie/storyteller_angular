import { User } from './user.model';
import { Category } from './category.model';
import { Writing } from './writing.model';
import { Comment } from './comment.model';

export interface IStoryOverview {
  id?: string | null;
  title: string | null;
  author: User | null;
  author_name: string | null;
  categories: Array<Category>;
  categoryObjects?: Array<Category>;
  introContent: string | null;
  createdAt: string | null;
}

export interface IStory {
  id?: string | null;
  title: string | null;
  author: User | null;
  author_name: string | null;
  categories: Array<Category>;
  categoryObjects?: Array<Category>;
  writings: Array<Writing> | null;
  comments: Array<Comment> | null;
  createdAt: string | null;

}

export class Story implements IStory {
  id?: string | null = null;
  title: string | null = null;
  author: User | null = null;
  author_name: string | null = null;
  categories: Array<Category> = [];
  categoryObjects?: Array<Category>;
  writings: Array<Writing> = [];
  comments: Array<Comment> = [];
  createdAt: string | null = null;
}
