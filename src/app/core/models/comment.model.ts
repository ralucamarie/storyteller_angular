export const COMMENT_REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'] as const;

export const COMMENT_DROPDOWN_REACTION_EMOJIS = ['👍', '😂', '😮', '😢', '🔥'] as const;

export type CommentReactionEmoji = (typeof COMMENT_REACTION_EMOJIS)[number];

export interface CommentReactionSummary {
  emoji: string;
  count: number;
  reactedByMe?: boolean;
  reacted_by_me?: boolean;
}

export interface IComment {
  id: number | null;
  author: {
    id: number | null;
    author_name: string | null;
    authorName?: string | null;
    name?: string | null;
    surname?: string | null;
    email?: string | null;
  } | null;
  content: string | null;
  createdAt: string | null;
  created_at?: string | null;
  updatedAt?: string | null;
  updated_at?: string | null;
  likesCount: number;
  likes_count?: number;
  likedByMe: boolean;
  liked_by_me?: boolean;
  reactions: CommentReactionSummary[];
  isMine: boolean;
  is_mine?: boolean;
}

export class Comment implements IComment {
  id: number | null = null;
  author: IComment['author'] = null;
  content: string | null = null;
  createdAt: string | null = null;
  updatedAt: string | null = null;
  likesCount = 0;
  likedByMe = false;
  reactions: CommentReactionSummary[] = [];
  isMine = false;
}

export function commentCreatedAt(comment: IComment): string | null {
  return comment.createdAt ?? comment.created_at ?? null;
}

export function commentAuthorName(comment: IComment): string {
  return comment.author?.authorName ?? comment.author?.author_name ?? 'Unknown';
}

export function commentLikedByMe(comment: IComment): boolean {
  return comment.likedByMe ?? comment.liked_by_me ?? false;
}

export function commentLikesCount(comment: IComment): number {
  return comment.likesCount ?? comment.likes_count ?? 0;
}

export function commentIsMine(comment: IComment): boolean {
  return comment.isMine ?? comment.is_mine ?? false;
}

export function reactionIsMine(reaction: CommentReactionSummary): boolean {
  return reaction.reactedByMe ?? reaction.reacted_by_me ?? false;
}

export function commentTimestamp(comment: IComment): number {
  const raw = comment as IComment & {
    created?: string | null;
    date?: string | null;
  };
  const value =
    commentCreatedAt(comment) ?? raw.created ?? raw.date ?? null;
  if (!value) {
    return 0;
  }
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}
