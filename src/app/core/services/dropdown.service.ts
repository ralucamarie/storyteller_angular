import { DropdownItem } from '../models/dropdown.model';
import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})

export class DropdownService {

  getStoryCategories(): Array<DropdownItem<string>> {
    return [
      new DropdownItem({
        id: 1,
        value: 'fantasy',
        label: 'Fantasy'
      }),
      new DropdownItem({
        id: 3,
        value: 'scienceFiction',
        label: 'Science Fiction'
      }),
      new DropdownItem({
        id: 4,
        value: 'mysteryThriller',
        label: 'Mystery & Thriller'
      }),
      new DropdownItem({
        id: 5,
        value: 'romance',
        label: 'Romance'
      }),
      new DropdownItem({
        id: 6,
        value: 'horror',
        label: 'Horror'
      }),
      new DropdownItem({
        id: 7,
        value: 'historicalFiction',
        label: 'Historical Fiction'
      }),
      new DropdownItem({
        id: 8,
        value: 'adventure',
        label: 'Adventure'
      }),
      new DropdownItem({
        id: 9,
        value: 'biography',
        label: 'Biography'
      }),
      new DropdownItem({
        id: 10,
        value: 'memoir',
        label: 'Memoir'
      }),
      new DropdownItem({
        id: 11,
        value: 'selfHelp',
        label: 'Biography'
      }),
      new DropdownItem({
        id: 12,
        value: 'travel',
        label: 'Travel'
      }),
      new DropdownItem({
        id: 13,
        value: 'trueCrime',
        label: 'True Crime'
      }),
      new DropdownItem({
        id: 14,
        value: 'scienceTechnology',
        label: 'Science & Technology'
      }),
      new DropdownItem({
        id: 15,
        value: 'history',
        label: 'History'
      }),
      new DropdownItem({
        id: 16,
        value: 'politics',
        label: 'Politics'
      }),
      new DropdownItem({
        id: 17,
        value: 'business',
        label: 'Business'
      }),
      new DropdownItem({
        id: 18,
        value: 'sports',
        label: 'Sports'
      }),
      new DropdownItem({
        id: 19,
        value: 'entertainment',
        label: 'Entertainment'
      }),
      new DropdownItem({
        id: 20,
        value: 'socialIssues',
        label: 'Social Issues'
      }),
      new DropdownItem({
        id: 21,
        value: 'opinionEssays',
        label: 'Opinion & Essays'
      }),
      new DropdownItem({
        id: 22,
        value: 'health',
        label: 'Health'
      }),
      new DropdownItem({
        id: 23,
        value: 'inspirational',
        label: 'Inspirational'
      }),
      new DropdownItem({
        id: 24,
        value: 'fanFiction',
        label: 'Fan Fiction'
      }),
      new DropdownItem({
        id: 25,
        value: 'childrenStories',
        label: 'Children Stories'
      }),
      new DropdownItem({
        id: 26,
        value: 'youngAdult',
        label: 'Young Adult'
      })
    ];
  }
}
