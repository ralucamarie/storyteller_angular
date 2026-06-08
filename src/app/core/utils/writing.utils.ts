import { IStory } from '../models/story.model';
import { IWriting } from '../models/writing.model';

export function getFirstWriting(story: IStory | null | undefined): IWriting | null {
  const writings = story?.writings;
  if (!writings?.length) {
    return null;
  }

  return [...writings].sort((left, right) => {
    const leftTime = left.created ? new Date(left.created).getTime() : 0;
    const rightTime = right.created ? new Date(right.created).getTime() : 0;
    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }
    return (left.id ?? 0) - (right.id ?? 0);
  })[0];
}
