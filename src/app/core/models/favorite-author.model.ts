export interface FavoriteAuthorSummary {
  id: number;
  author_name: string;
}

export interface FavoriteAuthorsResponse {
  author_ids?: number[];
  authorIds?: number[];
  authors: FavoriteAuthorSummary[];
}
