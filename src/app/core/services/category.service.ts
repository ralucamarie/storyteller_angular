import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  getStoryCategories(): Array<Category> {
    // TODO replace with API
    return [
      { id: 1, name: 'fantasy', numberOfStories: 5 },
      { id: 2, name: 'scienceFiction', numberOfStories: 5 },
      { id: 3, name: 'mysteryThriller', numberOfStories: 5 },
      { id: 4, name: 'romance', numberOfStories: 5 },
      { id: 5, name: 'horror', numberOfStories: 5 },
      { id: 6, name: 'historicalFiction', numberOfStories: 5 },
      { id: 7, name: 'adventure', numberOfStories: 5 },
      { id: 8, name: 'biography', numberOfStories: 5 },
      { id: 9, name: 'memoir', numberOfStories: 5 },
      { id: 10, name: 'selfHelp', numberOfStories: 5 },
      { id: 11, name: 'travel', numberOfStories: 5 },
      { id: 12, name: 'trueCrime', numberOfStories: 5 },
      { id: 13, name: 'scienceTechnology', numberOfStories: 5 },
      { id: 14, name: 'history', numberOfStories: 5 },
      { id: 15, name: 'politics', numberOfStories: 5},
      { id: 16, name: 'business', numberOfStories: 5 },
      { id: 17, name: 'sports', numberOfStories: 5 },
      { id: 18, name: 'entertainment', numberOfStories: 5 },
      { id: 19, name: 'health', numberOfStories: 5 },
      { id: 20, name: 'opinionEssays', numberOfStories: 5 },
      { id: 21, name: 'socialIssues', numberOfStories: 5 },
      { id: 22, name: 'inspirational', numberOfStories: 5 },
      { id: 23, name: 'fanFiction', numberOfStories: 5 },
      { id: 24, name: 'childrenStories', numberOfStories: 5 },
      { id: 25, name: 'youngAdult', numberOfStories: 5 }
    ];
  }

}
