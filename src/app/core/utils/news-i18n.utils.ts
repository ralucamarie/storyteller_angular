import { TranslateService } from '@ngx-translate/core';
import { NewsEvent, NewsEventType } from '../models/news.model';

export function newsEventMessage(event: NewsEvent, translate: TranslateService): string {
  const actor = event.actorName ?? translate.instant('news.someone');
  const title = event.storyTitle || translate.instant('news.aStory');

  const keyMap: Record<NewsEventType, string> = {
    contribution_on_my_story: 'news.contributionOnMyStory',
    comment_on_my_story: 'news.commentOnMyStory',
    contribution_on_followed_story: 'news.contributionOnFollowedStory',
    comment_on_followed_story: 'news.commentOnFollowedStory',
    favorite_author_new_story: 'news.favoriteAuthorNewStory',
  };

  const key = keyMap[event.type] ?? 'news.genericUpdate';
  return translate.instant(key, { actor, title });
}
