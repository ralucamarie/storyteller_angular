import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class MenuItemsService {

  getStoryCategories(): Array<MenuItem> {
    return [
      { title: 'fantasy', label: 'Fantasy', color: 'purple' },
      { title: 'scienceFiction', label: 'Science Fiction', color: 'blue' },
      { title: 'mysteryThriller', label: 'Mystery & Thriller', color: 'black' },
      { title: 'romance', label: 'Romance', color: 'pink' },
      { title: 'horror', label: 'Horror', color: 'red' },
      { title: 'historicalFiction', label: 'Historical Fiction', color: 'brown' },
      { title: 'adventure', label: 'Adventure', color: 'orange' },
      { title: 'biography', label: 'Biography', color: 'teal' },
      { title: 'memoir', label: 'Memoir', color: 'cyan' },
      { title: 'selfHelp', label: 'Self-Help', color: 'green' },
      { title: 'travel', label: 'Travel', color: 'lightblue' },
      { title: 'trueCrime', label: 'True Crime', color: 'darkred' },
      { title: 'scienceTechnology', label: 'Science & Technology', color: 'darkblue' },
      { title: 'history', label: 'History', color: 'gold' },
      { title: 'politics', label: 'Politics', color: 'darkgreen' },
      { title: 'business', label: 'Business', color: 'gray' },
      { title: 'sports', label: 'Sports', color: 'lime' },
      { title: 'entertainment', label: 'Entertainment', color: 'magenta' },
      { title: 'health', label: 'Health', color: 'lightgreen' },
      { title: 'opinionEssays', label: 'Opinion & Essays', color: 'navy' },
      { title: 'socialIssues', label: 'Social Issues', color: 'darkgray' },
      { title: 'inspirational', label: 'Inspirational', color: 'yellow' },
      { title: 'fanFiction', label: 'Fan Fiction', color: 'violet' },
      { title: 'childrenStories', label: 'Children Stories', color: 'lightpink' },
      { title: 'youngAdult', label: 'Young Adult', color: 'turquoise' }]
  }
}
