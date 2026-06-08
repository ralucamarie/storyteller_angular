export type NewsEventType =
  | 'contribution_on_my_story'
  | 'comment_on_my_story'
  | 'contribution_on_followed_story'
  | 'comment_on_followed_story'
  | 'favorite_author_new_story';

export interface NewsEvent {
  id: string;
  type: NewsEventType;
  occurredAt: string;
  storyId: number;
  storyTitle: string;
  actorId: number | null;
  actorName: string | null;
  preview: string;
}

export interface NewsFeedResponse {
  count: number;
  items: NewsEvent[];
}

export function newsEventIcon(type: NewsEventType): string {
  switch (type) {
    case 'contribution_on_my_story':
    case 'contribution_on_followed_story':
      return 'pi pi-pencil';
    case 'comment_on_my_story':
    case 'comment_on_followed_story':
      return 'pi pi-comments';
    case 'favorite_author_new_story':
      return 'pi pi-star-fill';
    default:
      return 'pi pi-bell';
  }
}

